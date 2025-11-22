import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key', {
    apiVersion: '2024-11-20.acacia' as any, // Force cast to avoid type mismatch with specific version
    typescript: true,
})
