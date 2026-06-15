
/**
 * Format A Currency
 * @param {Number} amount 
 * @param {String} currency 
 */
export const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount);
};