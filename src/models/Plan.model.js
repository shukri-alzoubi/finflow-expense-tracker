export default class Plan {

    /** @type {'free' | 'pro'} */planId;
    /** @type {string} */planName;
    /** @type {{amount: number, currency: string}} */price;
    /** @type {string} */badge;
    /** @type {{transactions: number, categories: number}} */limits;
    /** @type {{import: boolean, export: boolean, cloud: boolean}} */permissions;
    /** @type {string[]} */features;

}