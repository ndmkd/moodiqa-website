import { auth } from './firebase.js';
import { signUp, signIn } from './auth.js';

// Modal handling
const modal = document.getElementById('authModal');
const authButton = document.getElementById('authButton');
const closeBtn = document.querySelector('.close');

// Open modal when clicking Sign In
authButton.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
});

// Close modal when clicking X
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await signIn(email, password);
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    try {
        await signUp(email, password);
    } catch (error) {
        alert('Signup failed: ' + error.message);
    }
});

// Moodboard functionality
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('imageInput');
    const moodboard = document.getElementById('moodboard');
    
    fileInput.addEventListener('change', function(e) {
        console.log('File selected:', e.target.files);
        const files = e.target.files;
        for (let file of files) {
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    console.log('File loaded:', e.target.result.substring(0, 50));
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'moodboard-image';
                    img.draggable = true;
                    moodboard.appendChild(img);
                    
                    // Add drag functionality
                    img.addEventListener('mousedown', startDragging);
                };
                reader.readAsDataURL(file);
            }
        }
    });
});

// Drag functionality
function startDragging(e) {
    const img = e.target;
    let isDragging = true;
    
    // Calculate offset
    const offsetX = e.clientX - img.offsetLeft;
    const offsetY = e.clientY - img.offsetTop;
    
    // Move function
    function moveImage(e) {
        if (isDragging) {
            img.style.left = (e.clientX - offsetX) + 'px';
            img.style.top = (e.clientY - offsetY) + 'px';
            img.style.position = 'absolute';
        }
    }
    
    // Stop dragging
    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', moveImage);
        document.removeEventListener('mouseup', stopDragging);
    }
    
    document.addEventListener('mousemove', moveImage);
    document.addEventListener('mouseup', stopDragging);
}