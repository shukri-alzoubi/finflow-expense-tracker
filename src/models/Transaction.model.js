export class Transaction {

    /** @type {string} */ id;
    /** @type {'expense' | 'income'} */ type;
    /** @type {string} */ categoryId;
    /** @type {string} */ description;
    /** @type {string} */ amount;
    /** @type {number} */ date;
    /** @type {number} */ createdAt;
    /** @type {number} */ updatedAt;

    /**
     * Create Transaction Instance
     * @param {Transaction} values 
     * @returns {Transaction}
     */
    static instance(values = {}){
        return JSON.parse(JSON.stringify({
            id: values.id ?? crypto.randomUUID(),
            type: values.type ?? 'expense',
            categoryId: values.categoryId,
            description: values.description ?? '',
            amount: values.amount ?? 0.0,
            date: values.date ?? Date.now(),
            createdAt: values.createdAt ?? Date.now(),
            updatedAt: values.updatedAt ?? Date.now(),
        }))
    }
}