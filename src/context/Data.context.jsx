import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./Auth.context";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,

} from 'firebase/firestore'
import { db } from "../config/firebase.config";
import Loading from "../components/feedback/Loading";
import { Category } from "../models/Category.model";
import { Transaction } from "../models/Transaction.model";

const defaultValue = {
    transactions: [],
    categories: [],
}

const DataContext = createContext(null);

// DataContext.jsx
export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [data, setData] = useState(defaultValue);
    const [isLoading, setLoading] = useState(true);

    // Data Listeners
    useEffect(() => {
        if (!user) {
            setLoading(false);
            setData(defaultValue);
            return;
        }

        const collectionsList = Object.keys(defaultValue)
        const completed = new Set();

        // Helper to setup listeners
        const setupListener = (colId) => {
            const q = query(
                collection(db, colId),
                where("uid", "==", user.uid),
                colId === 'transactions' ? orderBy('date', 'desc') : orderBy('createdAt', 'desc')
            );

            return onSnapshot(q, (snapshot) => {
                const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setData(prev => ({ ...prev, [colId]: docs }));

                // Mark this collection as completed
                completed.add(colId);

                // Only stop loading when the Set contains all 4 collection names
                if (completed.size === collectionsList.length) {
                    setTimeout(() => setLoading(false), 1000)
                }
            }, (error) => {
                console.error(`${colId} error:`, error);
                // Optional: stop loading even on error so the app doesn't hang
                setLoading(false);
            });
        };

        const unsubs = collectionsList.map(name => setupListener(name));

        return () => unsubs.forEach(unsub => unsub());
    }, [user]);

    // Create Document With Limit Check
    const insertDocument = async (colId, document) => {
        try {
            if (data[colId].length >= 50) throw new Error('limit-exceeded');
            const docRef = doc(collection(db, colId));
            await setDoc(docRef, {
                ...document,
                id: docRef.id,
                uid: user.uid,
                createdAt: Date.now(),
            })

            return docRef.id;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    // Update Document
    const updateDocument = async (colId, docId, document) => {
        try {
            await updateDoc(doc(db, `${colId}/${docId}`), {
                ...document,
                uid: user.uid,
                updatedAt: Date.now(),
            })
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    // Delete Document
    const deleteDocument = async (colId, docId) => {
        try {
            await deleteDoc(doc(db, `${colId}/${docId}`));
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }

    // Find A Collection Item By It
    const findItemById = async (colId, docId) => {
        try {
            let item = await new Promise((resolve, reject) => {
                try {
                    resolve(data[colId]?.find((item) => item.id === docId || item.code === docId))
                } catch (error) {
                    console.log(error.message)
                }

                resolve(null);
            })

            return item;
        } catch (error) {
            console.log(error.message)
            return null
        }
    }

    const values = {
        ...data,
        isLoading,
        insertDocument,
        updateDocument,
        deleteDocument,
        findItemById,
    }

    return (
        <DataContext.Provider value={values}>
            {user && <>
                {!isLoading && children}
                {isLoading && <Loading message="Loading Data ..." />}
            </>}

            {!user && children}
        </DataContext.Provider>
    );
};

/**
 * 
 * @returns {{
 * transactions: Transaction[],
 * categories: Category[],
 * findItemById: (colId: 'transactions' | 'categories' , docId: string) => Promise<* | null>
 * isLoading: boolean,
 * insertDocument: (colId: 'transactions' | 'categories' , data: *) => Promise<string>,
 * updateDocument: (colId: 'transactions' | 'categories', docId: string, data: *) => Promise<void>,
 * deleteDocument: (colId: 'transactions' | 'categories', docId: string) => Promise<void>,
 * }}
 */
export const useData = () => useContext(DataContext);