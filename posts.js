import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { app, auth } from './auth.js';

const db = getFirestore(app);

window.createPost = async function() {
    const content = document.getElementById('postContent').value.trim();
    if (!content) {
        document.getElementById('postError').textContent = "لا يمكن نشر منشور فارغ";
        return;
    }
    
    const user = auth.currentUser;
    if (!user) {
        document.getElementById('postError').textContent = "يجب تسجيل الدخول أولاً";
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
        loadPosts();
    } catch (error) {
        document.getElementById('postError').textContent = "حدث خطأ أثناء النشر";
    }
};

async function loadPosts() {
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = "جاري التحميل...";
    try {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(20));
        const snapshot = await getDocs(q);
        postsDiv.innerHTML = '';

        snapshot.forEach((doc) => {
            const post = doc.data();
            postsDiv.innerHTML += `<div class="post"><strong>${post.userEmail}</strong><p>${post.content}</p></div>`;
        });
    } catch (error) {
        postsDiv.innerHTML = "حدث خطأ أثناء تحميل المنشورات.";
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadPosts();
    }
});
