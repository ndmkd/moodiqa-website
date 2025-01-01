import { auth } from './firebase.js';
import { logOut } from './auth.js';

// Check if user is authenticated
auth.onAuthStateChanged((user) => {
    if (!user) {
        // If not logged in, redirect to home page
        window.location.href = '/index.html';
    }
});

// Handle sign out
document.getElementById('signOutButton').addEventListener('click', async () => {
    try {
        await logOut();
    } catch (error) {
        console.error('Error signing out:', error);
    }
}); 