import axios, { AxiosInstance } from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

class PaystackClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: PAYSTACK_BASE_URL,
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Initialize a transaction
     */
    async initializeTransaction(data: {
        email: string;
        amount: number; // in pesewas (GHS 45 = 4500)
        currency?: 'GHS';
        callback_url?: string;
        metadata?: any;
        channels?: string[]; // ['card', 'mobile_money', 'bank']
    }) {
        const response = await this.client.post('/transaction/initialize', {
            ...data,
            currency: data.currency || 'GHS',
        });
        return response.data;
    }

    /**
     * Verify a transaction
     */
    async verifyTransaction(reference: string) {
        const response = await this.client.get(
            `/transaction/verify/${reference}`
        );
        return response.data;
    }

    /**
     * Create a customer
     */
    async createCustomer(data: {
        email: string;
        first_name: string;
        last_name: string;
        phone?: string;
    }) {
        const response = await this.client.post('/customer', data);
        return response.data;
    }

    /**
     * Create a subscription
     */
    async createSubscription(data: {
        customer: string; // customer code or email
        plan: string; // plan code
        authorization: string; // authorization code from successful transaction
    }) {
        const response = await this.client.post('/subscription', data);
        return response.data;
    }

    /**
     * Create a plan
     */
    async createPlan(data: {
        name: string;
        amount: number; // in pesewas
        interval: 'monthly' | 'annually';
        currency?: 'GHS';
        description?: string;
    }) {
        const response = await this.client.post('/plan', {
            ...data,
            currency: data.currency || 'GHS',
        });
        return response.data;
    }

    /**
     * Cancel a subscription
     */
    async cancelSubscription(
        code: string,
        token: string // email token from subscription object
    ) {
        const response = await this.client.post('/subscription/disable', {
            code,
            token,
        });
        return response.data;
    }

    /**
     * Enable a subscription
     */
    async enableSubscription(
        code: string,
        token: string
    ) {
        const response = await this.client.post('/subscription/enable', {
            code,
            token,
        });
        return response.data;
    }

    /**
     * Get subscription details
     */
    async getSubscription(idOrCode: string) {
        const response = await this.client.get(`/subscription/${idOrCode}`);
        return response.data;
    }

    /**
     * List all transactions
     */
    async listTransactions(params?: {
        perPage?: number;
        page?: number;
        customer?: string;
        status?: 'success' | 'failed' | 'abandoned';
        from?: string; // ISO date
        to?: string; // ISO date
    }) {
        const response = await this.client.get('/transaction', { params });
        return response.data;
    }
}

export const paystackClient = new PaystackClient();
