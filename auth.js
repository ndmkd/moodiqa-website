import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Sign Up
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = '/dashboard.html';
        return userCredential.user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Sign In
export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/dashboard.html';
        return userCredential.user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Sign Out
export const logOut = async () => {
    try {
        await signOut(auth);
        window.location.href = '/index.html';
    } catch (error) {
        console.error(error);
        throw error;
    }
}; 