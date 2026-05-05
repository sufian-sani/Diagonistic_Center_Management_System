import jwt from 'jsonwebtoken'

// staff authentication middleware
const authStaff = async (req, res, next) => {
    const stoken = req.headers['stoken']
    if (!stoken) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(stoken, process.env.JWT_SECRET)
        req.body.staffId = token_decode.id
        req.body.staffRole = token_decode.role
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authStaff;
