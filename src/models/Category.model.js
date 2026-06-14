import { type } from "firebase/firestore/pipelines";

export class Category {

    /** @type {string} */ id;
    /** @type {string} */ uid;
    /** @type {string} */ name;
    /** @type {'income' | 'expense'} */ type;
    /** @type {number} */ budget;
    /** @type {string} */ icon;
    /** @type {'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'success'} */ color;
    /** @type {number} */ createdAt;
    /** @type {number} */ updatedAt;


    /**
     * Create A Category Instance
     * @param {Category} values 
     * @returns {Category}
     */
    static instance(values = {}){
        return JSON.parse(JSON.stringify({
            id: values.id ?? crypto.randomUUID(),
            uid: values.uid,
            name: values.name ?? '',
            type: values.type ?? 'expense',
            budget: values.budget,
            icon: values.icon ?? 'bi bi-fork-knife',
            color: values.color ?? 'primary',
            createdAt : values.createdAt ?? Date.now(),
            updatedAt : values.updatedAt ?? Date.now(),
        }))
    }
}