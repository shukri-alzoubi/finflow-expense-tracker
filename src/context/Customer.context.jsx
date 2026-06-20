import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./Auth.context";
import { db } from "../config/firebase.config";
import { collection, doc, onSnapshot, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import Loading from "../components/feedback/Loading";
import Customer from "../models/Customer.model";
import Plan from "../models/Plan.model";

// Mock Data
import plans from '../assets/mock/plans.mock.json'
import categories from '../assets/mock/categories.mock.json'
import { Category } from "../models/Category.model";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {

    const { user } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setCustomer(null);
            setLoading(false);
            return () => { }
        }

        const unsub = onSnapshot(doc(db, `users/${user.uid}`), (snapshot) => {
            if (snapshot.exists()) {
                setCustomer(snapshot.data());
                setTimeout(() => setLoading(false), 500)
            } else {
                createCustomer();
            }
        });

        return () => unsub();
    }, [user]);

    // Get Current Plan
    const currentPlan = useMemo(() => plans[customer?.plan?.id] ?? plans.free, [customer]);

    // First Time Users
    const createCustomer = async () => {
        if (user) {
            try {
                // Create A New Firestore Batch
                const batch = writeBatch(db);

                // Create A New Customer Instance in "users" collection
                const customerRef = doc(db, `users/${user.uid}`);
                batch.set(customerRef, Customer.instance({
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    displayName: user.displayName,
                    createdAt: new Date(user.metadata.creationTime).getTime(),
                    lastActive: new Date(user.metadata.lastSignInTime).getTime(),
                    photoUrl: user.photoURL,
                    plan: { lastDue: Date.now() }
                }))

                // Add Most Used Categories for new Customers
                categories.map((category) => {
                    const categoryRef = doc(collection(db, 'categories'))
                    batch.set(categoryRef, Category.instance({
                        ...category,
                        id: categoryRef.id,
                        uid: user.uid,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    }))
                })

                await batch.commit();

            } catch (error) {
                console.log(error.message);
            }
        } else {
            return;
        }
    }

    // Update Customer Instance
    const updateCustomer = async (data) => {
        if (user) {
            try {
                const customerRef = doc(db, `users/${user.uid}`);
                await updateDoc(customerRef, { ...data })
                await refreshCustomer();
            } catch (error) {
                console.log(error.message);
            }
        } else {
            return false;
        }
    }

    // Update Customer Data on Each User State Change
    const refreshCustomer = async () => {
        if (user) {
            try {
                await updateCustomer({
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    displayName: user.displayName,
                    createdAt: new Date(user.metadata.creationTime).getTime(),
                    lastActive: new Date(user.metadata.lastSignInTime).getTime(),
                    photoUrl: user.photoURL,
                });
            } catch (error) {
                console.log(error.message)
            }
        } else {
            return;
        }
    }

    return <CustomerContext.Provider value={{ customer, updateCustomer, refreshCustomer, currentPlan }}>
        {user && <>
            {isLoading && <Loading message="Fetching Customer ..." />}
            {!isLoading && children}
        </>}

        {!user && children}
    </CustomerContext.Provider>

}

/**
 * @returns {{
 * customer: Customer | null,
 * updateCustomer: (customer: Customer) => Promise<void>,
 * refreshCustomer: () => Promise<void>,
 * currentPlan: Plan,
 * }}
 */
export const useCustomer = () => useContext(CustomerContext);