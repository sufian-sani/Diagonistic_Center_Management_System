import stripe from "stripe";
import razorpay from "razorpay";

class PaymentGateway {
    // 1. Private static instance
    static #instance;

    // Gateways
    #stripeClient;
    #razorpayClient;

    // 2. Private Constructor
    constructor() {
        if (PaymentGateway.#instance) {
            throw new Error("Use PaymentGateway.getInstance()");
        }

        // Initialize Stripe
        this.#stripeClient = new stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

        // Initialize Razorpay
        this.#razorpayClient = new razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
        });

        console.log("PaymentGateway Singleton initialized. Clients created.");
    }

    // 3. Static getInstance method
    static getInstance() {
        if (!PaymentGateway.#instance) {
            PaymentGateway.#instance = new PaymentGateway();
        }
        return PaymentGateway.#instance;
    }

    // Getters for clients
    getStripe() {
        return this.#stripeClient;
    }

    getRazorpay() {
        return this.#razorpayClient;
    }
}

export default PaymentGateway;
