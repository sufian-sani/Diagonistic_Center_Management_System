import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import staffModel from "../models/staffModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import axios from 'axios'
import PaymentGateway from "../utils/PaymentGateway.js";

// Gateway Singleton instance helper
const paymentGateway = PaymentGateway.getInstance();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // Role Isolation Check: Prevent Staff/Admin from registering as Patients
        const isDoctor = await doctorModel.findOne({ email });
        const isStaff = await staffModel.findOne({ email });
        const isAdmin = email === process.env.ADMIN_EMAIL;

        if (isDoctor || isStaff || isAdmin) {
            return res.json({ success: false, message: 'This email is reserved for Staff/Admin access. Please use a different email.' })
        }

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login with Google
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        // Role Isolation Check: Prevent Staff/Admin from logging in as Patients
        const isDoctor = await doctorModel.findOne({ email });
        const isStaff = await staffModel.findOne({ email });
        const isAdmin = email === process.env.ADMIN_EMAIL;

        if (isDoctor || isStaff || isAdmin) {
            return res.json({ success: false, message: 'This email is registered for Staff/Admin. Patient access denied.' })
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            // Create new user if not exists
            const userData = {
                name,
                email,
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
                image: picture
            }
            user = new userModel(userData);
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token: jwtToken });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime, isTeleconsultation } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        // Apply 30% discount if it's an online consultation
        const finalAmount = isTeleconsultation ? Math.floor(docData.fees * 0.7) : docData.fees;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: finalAmount,
            isTeleconsultation: isTeleconsultation || false,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        
        if (!userId) {
            return res.json({ success: false, message: 'User ID not found' })
        }

        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await paymentGateway.getRazorpay().orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await paymentGateway.getRazorpay().orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await paymentGateway.getStripe().checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

//aamarpay setup
//aamarpay payment
const aamarpaySandboxUrl = 'https://sandbox.aamarpay.com/jsonpost.php';
const callbackUrl = 'http://localhost:5000/callback';

const paymentAamarpay = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const cusDetails = await userModel.findById(req.body.userId)

        const payload = {
            store_id: 'aamarpaytest',
            signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183', // Sandbox signature key
            amount: appointmentData.amount,
            payment_type: 'VISA',
            currency: 'BDT',
            tran_id: `tran_${Date.now()}`,
            cus_name: cusDetails.name,
            cus_email: cusDetails.email,
            cus_phone: cusDetails.phone,
            desc: appointmentData.id,
            success_url: `http://localhost:4000/api/user/payment-success/${appointmentId}`,
            fail_url: "http://localhost:4000/api/user/payment-fail/",
            cancel_url: "http://localhost:4000/api/user/payment-cancel/",
            type: "json"
        };

        const responseData = await axios.post(aamarpaySandboxUrl, payload, {
            headers: { 'Content-Type': 'application/json' },
        });

        res.json({ success: true, response: responseData.data })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// paymentSuccess
const paymentSuccess = async (req, res) => {
    const appointmentId = req.params.appointmentId;
    await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
    const successUrl = 'http://localhost:5173/success';
    res.redirect(successUrl);
}
// paymentFail
const paymentFail = async (req, res) => {
    const failUrl = 'http://localhost:5173/fail';
    res.redirect(failUrl);
}
// paymentCancel
const paymentCancel = async (req, res) => {
    const cancelUrl = 'http://localhost:5173/cancel';
    res.redirect(cancelUrl);
}

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe,
    paymentAamarpay,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    googleLogin,
}
