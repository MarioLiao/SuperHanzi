import express from 'express';
import Stripe from 'stripe';
import { authenticateToken } from '../middleware/auth.js';
import { models } from '../db/models/index.js';
import dotenv from 'dotenv';

dotenv.config();
const { Payment, User } = models;
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'cad' } = req.body;
    const userId = req.user.id;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Premium+',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // TODO: make success and cancel page in frontend
      success_url: `${process.env.FRONTEND_URL}/after-payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/after-payment/cancel`,
    });

    const payment = await Payment.create({
      paymentId: session.id,
      amount: amount,
      status: session.payment_status,
      userId: userId,
    });

    res.json({
      sessionId: session.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook handler
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object;
    console.log(`Handling event type: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await updatePaymentStatus(data.id, 'completed');
        try {
          const payment = await Payment.findOne({
            where: { paymentId: data.id },
          });
          const user = await User.findOne({
            where: { id: payment.userId },
          });
          user.update({ isPremium: true });
        } catch (error) {
          console.error('Error updating user premium status:', error);
        }
        break;
      case 'checkout.session.async_payment_succeeded':
        await updatePaymentStatus(data.id, 'succeeded');
        break;
      case 'checkout.session.async_payment_failed':
        await updatePaymentStatus(data.id, 'failed');
        break;
      case 'checkout.session.expired':
        await updatePaymentStatus(data.id, 'expired');
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

// Get payment details
router.get('/:paymentId', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: {
        id: req.params.paymentId,
        userId: req.user.id,
      },
      attributes: ['paymentIntentId', 'amount', 'status', 'receiptUrl'],
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all payments for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'paymentIntentId', 'amount', 'status', 'receiptUrl'],
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function updatePaymentStatus(sessionId, status) {
  try {
    let payment = await Payment.findOne({
      where: { paymentId: sessionId },
    });

    if (payment) {
      await payment.update({ status: status });
      console.log(
        `Updated payment status to ${status} for Checkout Session ${sessionId}`
      );
    } else {
      if (created) {
        console.log(
          `Created payment record with status ${status} for Checkout Session ${sessionId}`
        );
      }
    }
  } catch (error) {
    console.error(
      `Error updating payment status to ${status} for Checkout Session ${sessionId}:`,
      error
    );
  }
}

export default router;
