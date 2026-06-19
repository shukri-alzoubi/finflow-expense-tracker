import {
    createUserWithEmailAndPassword,
    deleteUser,
    EmailAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updatePassword,
    updateProfile,
} from "firebase/auth";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase.config";
import Loading from "../components/feedback/Loading";

const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (muser) => {
            setUser(muser);
            initialize(muser);
        });

        return () => unsub();
    }, [])

    // Fetch Admin
    const initialize = async (muser) => {
        setLoading(true);
        try {
            let role = (await muser?.getIdTokenResult())?.claims?.role
            setIsAdmin(role === "admin" || role == "owner")
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }

    // Sign In
    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(error.message);

            if (error.message.includes('auth/invalid-email')) throw new Error('invalid email');
            if (error.message.includes('auth/invalid-credential')) throw new Error('wrong email or password');
            if (error.message.includes('auth/user-not-found')) throw new Error('user not found');
            if (error.message.includes('auth/wrong-password')) throw new Error('wrong password');

            throw new Error('Somthing went wrong');
        }
    }

    // Sign Up
    const createUser = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(error.message);

            if (error.message.includes('auth/invalid-email')) throw new Error('invalid email');
            if (error.message.includes('auth/missing-password')) throw new Error('missing password');
            if (error.message.includes('auth/email-already-in-use')) throw new Error('account already exists');


            throw new Error('Somthing went wrong');
        }
    }

    // Sign Out
    const logout = async () => {
        try {
            if (user) {
                await signOut(auth);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    // Sign In With Google
    const googleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Send Email Verification
    const verifyEmail = async () => {
        try {
            if (!user) throw new Error('user-not-found');
            if (user.emailVerified) throw new Error('user-already-verified');

            await sendEmailVerification(user);
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }

    // Send a password reset link to email address
    const restPasswordLink = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            if (error.message.includes('auth/user-not-found')) throw new Error('user not found');
            if (error.message.includes('auth/missing-email')) throw new Error('missing email');
            throw new Error(error.message);
        }
    }

    // Reauthenticate user via password
    const reauthenticate = async (password, callback) => {
        try {
            if (!user) throw new Error('user-not-found');
            if (user.email === 'demo@demo.com') { return false; }
            const credintial = EmailAuthProvider.credential(user.email, password);
            let cred = await reauthenticateWithCredential(user, credintial);

            if (callback) { return callback(cred.user); }
            return true;
        } catch (error) {
            console.log(error.message)
            return false;
        }
    }
    // Update Password
    const updateUserPassword = async (currentPassword, newPassword) => {
        try {
            if (!user) throw new Error('user-not-found');
            if (!(await reauthenticate(currentPassword))) throw new Error('wrong-password');

            await updatePassword(user, newPassword);
            return true;
        } catch (error) {
            console.log(error.message)
            throw error
        }
    }

    // Update Dislay Name
    const updateDisplayName = async (displayName) => {
        try {
            if (!user) throw new Error('user-not-found');
            await updateProfile(user, { displayName: displayName });
            return true;
        } catch (error) {
            handleError(error)
            return false;
        }
    }

    // Update Dislay Name
    const updatePhotoURL = async (photoURL) => {
        try {
            if (!user) throw new Error('user-not-found');
            await updateProfile(user, { photoURL: photoURL });
            return true;
        } catch (error) {
            handleError(error)
            return false;
        }
    }

    // Delete Account
    const deleteAccount = async (password) => {
        try {
            if (!user) throw new Error('user-not-found');
            if (!(await reauthenticate(password))) throw new Error('wrong-password');

            await deleteUser(user)
                .catch(() => { console.log('🗑️ Verification was sent to email') });
            return true;
        } catch (error) {
            handleError(error);
            throw error
        }
    }

    // Handle Firebase Error
    const handleError = (error) => {
        try {
            localStorage.setItem('error-logs', error?.message ?? error);
            console.log(error);
        } catch (error) {
            console.log(error);
        }
    }

    const values =
    {
        user,
        isAdmin,
        login,
        createUser,
        googleSignIn,
        logout,
        verifyEmail,
        restPasswordLink,
        reauthenticate,
        updateUserPassword,
        updateDisplayName,
        updatePhotoURL,
        deleteAccount,
    }

    return <AuthContext.Provider value={values}>
        {isLoading && <Loading message="Authenticating..." />}
        {!isLoading && children}
    </AuthContext.Provider>
}

/**
 * 
 * @returns {{
 * user: import("firebase/auth").User,
 * isAdmin: boolean,
 * login: (email: String, password: String)=> Promise<Boolean>,
 * createUser: (email: String, password: String)=> Promise<Boolean>,
 * googleSignIn: () => Promise<Boolean>,
 * logout: () => Promise<Boolean>,
 * verifyEmail: () => Promise<Boolean>,
 * restPasswordLink: (email: String) => Promise<Boolean>,
 * updateUserPassword: (currentPassword: String, newPassword: String) => Promise<Boolean>,
 * updateDisplayName: (displayName: String) => Promise<Boolean>,
 * updatePhotoURL: (photoURL: String) => Promise<Boolean>,
 * reauthenticate: (password: String, callback: (user: import("firebase/auth").User | null)=> Promise<Boolean>) => Promise<Boolean>,
 * deleteAccount: (password: String) => Promise<Boolean>,
 * }}
 */
export const useAuth = () => useContext(AuthContext)