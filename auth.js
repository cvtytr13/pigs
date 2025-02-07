import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyDZOs48fHG3weYUTxNgDUhf6qlf6XdiIp8",
    authDomain: "messge102.firebaseapp.com",
    projectId: "messge102",
    storageBucket: "messge102.appspot.com",
    messagingSenderId: "353675326399",
    appId: "1:353675326399:web:1836fcb73faf9d0f39670a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.register = async function() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        document.getElementById('authError').textContent = "حدث خطأ أثناء التسجيل";
    }
};

window.login = async function() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        document.getElementById('authError').textContent = "بيانات تسجيل الدخول غير صحيحة";
    }
};

window.logout = async function() {
    await signOut(auth);
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('contentSection').style.display = 'block';
        document.getElementById('profileSection').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'block';
    } else {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('contentSection').style.display = 'none';
        document.getElementById('profileSection').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'none';
    }
});
