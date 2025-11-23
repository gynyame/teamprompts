/**
 * Convert GHS to pesewas
 * GHS 45 -> 4500 pesewas
 */
export function ghsToPesewas(ghs: number): number {
    return Math.round(ghs * 100);
}

/**
 * Convert pesewas to GHS
 * 4500 pesewas -> GHS 45
 */
export function pesewasToGhs(pesewas: number): number {
    return pesewas / 100;
}

/**
 * Format GHS amount for display
 * 45 -> "GHS 45.00"
 */
export function formatGhs(amount: number): string {
    return `GHS ${amount.toFixed(2)}`;
}

/**
 * Get approximate USD equivalent
 * GHS 45 -> "$3.00 USD"
 * Using approximate rate: 1 USD = 15 GHS
 */
export function getUsdEquivalent(ghs: number): string {
    const usd = ghs / 15; // Approximate exchange rate
    return `~$${usd.toFixed(2)} USD`;
}

/**
 * Generate transaction reference
 */
export function generateReference(prefix: string = 'teamprompts'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Verify Paystack webhook signature
 */
export function verifyWebhookSignature(
    payload: string,
    signature: string
): boolean {
    const crypto = require('crypto');
    const hash = crypto
        .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
        .update(payload)
        .digest('hex');
    return hash === signature;
}
