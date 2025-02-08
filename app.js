import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    signOut, onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

import { 
    getFirestore, collection, addDoc, getDocs, 
    orderBy, query, serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyDZOs48f...",
    authDomain: "messge102.firebaseapp.com",
    projectId: "messge102",
    storageBucket: "messge102.appspot.com",
    messagingSenderId: "353675326399",
    appId: "1:353675326399:web:1836fcb73faf9d0f39670a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function register() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (!email || !password) {
        showError('authError', "يرجى ملء جميع الحقول");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        hideError('authError');
        showHome();
    } catch (error) {
        showError('authError', "حدث خطأ أثناء التسجيل: " + error.message);
    }
}

async function login() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (!email || !password) {
        showError('authError', "يرجى ملء جميع الحقول");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        hideError('authError');
        showHome();
    } catch (error) {
        showError('authError', "بيانات تسجيل الدخول غير صحيحة");
    }
}

async function logout() {
    try {
        await signOut(auth);
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('contentSection').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'none';
    } catch (error) {
        console.error("Error signing out: ", error);
    }
}

async function createPost() {
    const content = document.getElementById('postContent').value.trim();
    if (!content) {
        showError('postError', "لا يمكن نشر منشور فارغ");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        showError('postError', "يجب تسجيل الدخول أولاً");
        return;
    }

    try {
        await addDoc(collection(db, 'posts'), {
            content: content,
            userId: user.uid,
            userEmail: user.email,
            timestamp: serverTimestamp()
        });
        document.getElementById('postContent').value = '';
        hideError('postError');
        loadPosts();
    } catch (error) {
        showError('postError', "حدث خطأ أثناء النشر");
    }
}

async function loadPosts() {
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = "جاري التحميل...";
    
    try {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        postsDiv.innerHTML = '';

        snapshot.forEach(doc => {
            const post = doc.data();
            postsDiv.innerHTML += `<div class="post"><strong>${post.userEmail}</strong><p>${post.content}</p></div>`;
        });
    } catch (error) {
        postsDiv.innerHTML = "حدث خطأ أثناء تحميل المنشورات.";
    }
}

function showError(id, message) {
    const errorDiv = document.getElementById(id);
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError(id) {
    document.getElementById(id).style.display = 'none';
}

onAuthStateChanged(auth, (user) => {
    if (user) showHome();
});
