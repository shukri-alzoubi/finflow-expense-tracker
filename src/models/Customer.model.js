export default class Customer {

    /** @type {string} */ uid;
    /** @type {string} */ email;
    /** @type {boolean} */ emailVerified;
    /** @type {string} */ displayName;
    /** @type {string} */ photoUrl;
    /** @type {string} */ createdAt;
    /** @type {string} */ lastActive;
    /** @type {'active' | 'deleted'} */ status;
    /** 
     * @type {{
     * id: string,
     * lastDue: number,
     * nextDue: number,
     * status: 'active' | 'canceled' | 'expired'
     * }} 
     * */ plan;

    /**
     * Create Customer Instance
     * @param {Customer} values 
     * @returns {Customer}
     */
    static instance(values = {}) {
        return JSON.parse(JSON.stringify({
            uid: values.uid,
            email: values.email,
            emailVerified: values.emailVerified,
            displayName: values.displayName,
            photoUrl: values.photoUrl,
            createdAt: values.createdAt,
            lastActive: values.lastActive,
            status: values.status ?? 'active',
            plan: {
                id: values.plan?.id ?? 'free',
                lastDue: values.plan?.lastDue,
                nextDue: values.plan?.nextDue,
                status: values.plan?.status ?? 'active',
            }
        }))
    }
}