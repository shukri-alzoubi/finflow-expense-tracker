import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./Auth.context";
import { db } from "../config/firebase.config";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import Loading from "../components/feedback/Loading";
import Customer from "../models/Customer.model";
import plans from '../assets/mock/plans.mock.json'
import Plan from "../models/Plan.model";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {

    const { user } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setCustomer(null);
            setLoading(false);
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
        try {
            const customerRef = doc(db, `users/${user.uid}`);
            await setDoc(customerRef, Customer.instance({
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName,
                createdAt: new Date(user.metadata.creationTime).getTime(),
                lastActive: new Date(user.metadata.lastSignInTime).getTime(),
                photoUrl: user.photoURL,
                plan: { lastDue: Date.now() }
            }))
        } catch (error) {
            console.log(error.message);
        }
    }

    // Update Customer Instance
    const updateCustomer = async (data) => {
        try {
            const customerRef = doc(db, `users/${user.uid}`);
            await updateDoc(customerRef, { ...data })
            await refreshCustomer();
        } catch (error) {
            console.log(error.message);
        }
    }

    // Update Customer Data on Each User State Change
    const refreshCustomer = async () => {
        try {
            if (user) {
                await updateCustomer({
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    displayName: user.displayName,
                    createdAt: new Date(user.metadata.creationTime).getTime(),
                    lastActive: new Date(user.metadata.lastSignInTime).getTime(),
                    photoUrl: user.photoURL,
                });
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return <CustomerContext.Provider value={{ customer, updateCustomer, refreshCustomer, currentPlan }}>
        {isLoading && <Loading message="Fetching Customer ..." />}
        {!isLoading && children}
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