// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBBlrZomj5MkN1WeuOc-UvmyjvirwxBXoU",
    authDomain: "nasareturn0login.firebaseapp.com",
    projectId: "nasareturn0login",
    storageBucket: "nasareturn0login.firebasestorage.app",
    messagingSenderId: "675458127399",
    appId: "1:675458127399:web:d21f02fffba8a8e4082002",
    measurementId: "G-PH1S9NC0TL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: 'select_account'
});

setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Persistence error:', error);
});

console.log('✅ Firebase initialized successfully!');

// EmailJS Configuration - REPLACE WITH YOUR IDs
const EMAILJS_PUBLIC_KEY = "pFnb_UgleVQ1Fui23"; // Get from EmailJS Dashboard
const EMAILJS_SERVICE_ID = "NasaReturn0";
const EMAILJS_TEMPLATE_ID = "template_9alqmba";

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// Helper Functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = `❌ ${message}`;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 6000);
    }
    console.error('Error:', message);
}

function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = `✅ ${message}`;
        successElement.style.display = 'block';
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 3000);
    }
    console.log('Success:', message);
}

function getFirebaseErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'यह ईमेल पहले से रजिस्टर्ड है',
        'auth/invalid-email': 'Invalid email address',
        'auth/operation-not-allowed': 'Email/Password auth not enabled',
        'auth/weak-password': 'Password must be at least 6 characters',
        'auth/user-disabled': 'Account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/too-many-requests': 'Too many attempts. Try again later',
        'auth/network-request-failed': 'Network error. Check connection',
        'auth/popup-closed-by-user': 'Sign-in popup was closed',
        'auth/popup-blocked': 'Popup blocked. Allow popups'
    };
    return errorMessages[errorCode] || `Error: ${errorCode}`;
}

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Email
async function sendOTPEmail(email, username, otp) {
    const templateParams = {
        to_email: email,
        to_name: username || 'User',
        otp_code: otp,
        from_name: 'Exoplanet Research'
    };
    
    try {
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );
        console.log('Email sent successfully:', response);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
}

// Email/Password Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const loginBtn = document.getElementById('loginBtn');
        
        if (!email || !password) {
            showError('loginError', 'Please enter email and password');
            return;
        }
        
        loginBtn.disabled = true;
        loginBtn.textContent = '🚀 Logging in...';
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('Login successful:', user.email);
            showSuccess('loginSuccess', `Welcome back, ${user.displayName || user.email}!`);
            
            setTimeout(() => {
                alert('🎉 Login successful! Redirecting...');
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            console.error('Login error:', error.code, error.message);
            showError('loginError', getFirebaseErrorMessage(error.code));
            loginBtn.disabled = false;
            loginBtn.textContent = '🚀 Access Research Portal';
        }
    });
}

// Email/Password Registration with OTP
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const registerBtn = document.getElementById('registerBtn');
        
        // Validation
        if (!username || !email || !password || !confirmPassword) {
            showError('registerError', 'Please fill all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('registerError', 'Passwords do not match!');
            return;
        }
        
        if (password.length < 6) {
            showError('registerError', 'Password must be at least 6 characters');
            return;
        }
        
        registerBtn.disabled = true;
        registerBtn.textContent = '📧 Sending OTP...';
        
        try {
            // Generate OTP
            const otp = generateOTP();
            console.log('Generated OTP:', otp); // For testing
            
            // Send OTP via email
            const emailSent = await sendOTPEmail(email, username, otp);
            
            if (!emailSent) {
                showError('registerError', 'Failed to send OTP email. Try again.');
                registerBtn.disabled = false;
                registerBtn.textContent = '✨ Create Account';
                return;
            }
            
            // Store registration data temporarily
            sessionStorage.setItem('registrationData', JSON.stringify({
                username: username,
                email: email,
                password: password,
                otp: otp,
                timestamp: Date.now()
            }));
            
            showSuccess('registerSuccess', `📧 OTP sent to ${email}! Check your inbox.`);
            
            // Show OTP verification section
            setTimeout(() => {
                document.getElementById('register-form-section').style.display = 'none';
                document.getElementById('otp-verification-section').style.display = 'block';
                registerBtn.disabled = false;
                registerBtn.textContent = '✨ Create Account';
            }, 1500);
            
        } catch (error) {
            console.error('Registration error:', error);
            showError('registerError', 'Failed to send OTP. Try again.');
            registerBtn.disabled = false;
            registerBtn.textContent = '✨ Create Account';
        }
    });
}

// Verify OTP and Create Account
window.verifyOTPAndRegister = async function() {
    const otpInput = document.getElementById('otpInput').value.trim();
    const verifyBtn = document.getElementById('verifyOtpBtn');
    
    if (!otpInput || otpInput.length !== 6) {
        showError('registerError', 'Please enter valid 6-digit OTP');
        return;
    }
    
    // Get stored registration data
    const storedData = sessionStorage.getItem('registrationData');
    if (!storedData) {
        showError('registerError', 'Session expired. Please register again.');
        return;
    }
    
    const data = JSON.parse(storedData);
    
    // Check OTP expiry (5 minutes)
    const timeElapsed = Date.now() - data.timestamp;
    if (timeElapsed > 5 * 60 * 1000) {
        showError('registerError', 'OTP expired. Please register again.');
        sessionStorage.removeItem('registrationData');
        document.getElementById('otp-verification-section').style.display = 'none';
        document.getElementById('register-form-section').style.display = 'block';
        return;
    }
    
    // Verify OTP
    if (otpInput !== data.otp) {
        showError('registerError', 'Invalid OTP. Please try again.');
        return;
    }
    
    verifyBtn.disabled = true;
    verifyBtn.textContent = '✨ Creating Account...';
    
    try {
        // Create Firebase account
        const userCredential = await createUserWithEmailAndPassword(
            auth, 
            data.email, 
            data.password
        );
        const user = userCredential.user;
        
        // Update profile
        await updateProfile(user, {
            displayName: data.username
        });
        
        console.log('Registration successful:', user.email);
        showSuccess('registerSuccess', `✅ Account created! Welcome ${data.username}!`);
        
        // Clear stored data
        sessionStorage.removeItem('registrationData');
        
        setTimeout(() => {
            alert('🎉 Registration successful! Redirecting...');
            window.location.href = 'index.html';
        }, 2000);
        
    } catch (error) {
        console.error('Firebase registration error:', error);
        showError('registerError', getFirebaseErrorMessage(error.code));
        verifyBtn.disabled = false;
        verifyBtn.textContent = '✓ Verify & Register';
    }
}

// Resend OTP
window.resendOTP = async function() {
    const storedData = sessionStorage.getItem('registrationData');
    if (!storedData) {
        showError('registerError', 'Session expired. Please register again.');
        return;
    }
    
    const data = JSON.parse(storedData);
    
    // Generate new OTP
    const newOTP = generateOTP();
    console.log('New OTP:', newOTP); // For testing
    
    // Send new OTP
    const emailSent = await sendOTPEmail(data.email, data.username, newOTP);
    
    if (emailSent) {
        // Update stored OTP
        data.otp = newOTP;
        data.timestamp = Date.now();
        sessionStorage.setItem('registrationData', JSON.stringify(data));
        
        showSuccess('registerSuccess', '📧 New OTP sent! Check your email.');
    } else {
        showError('registerError', 'Failed to resend OTP. Try again.');
    }
}

// Back to Registration
window.backToRegister = function() {
    sessionStorage.removeItem('registrationData');
    document.getElementById('otp-verification-section').style.display = 'none';
    document.getElementById('register-form-section').style.display = 'block';
    document.getElementById('otpInput').value = '';
}

// Google Sign-In
async function handleGoogleSignIn(buttonType) {
    const errorId = buttonType === 'login' ? 'loginError' : 'registerError';
    const successId = buttonType === 'login' ? 'loginSuccess' : 'registerSuccess';
    
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        showSuccess(successId, `Welcome ${user.displayName}!`);
        
        setTimeout(() => {
            alert(`🎉 Google Sign-${buttonType} successful!`);
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('Google Sign-In error:', error);
        showError(errorId, getFirebaseErrorMessage(error.code));
    }
}

const googleLoginBtn = document.getElementById('googleLoginBtn');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleGoogleSignIn('login');
    });
}

const googleRegisterBtn = document.getElementById('googleRegisterBtn');
if (googleRegisterBtn) {
    googleRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleGoogleSignIn('register');
    });
}

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('👤 User logged in:', user.email);
        console.log('Display Name:', user.displayName);
    } else {
        console.log('No user logged in');
    }
});

console.log('✅ Auth.js loaded successfully!');
