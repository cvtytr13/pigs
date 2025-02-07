// Post Form
document.getElementById('post-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const postContent = document.getElementById('post-content').value;
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.firestore().collection('posts').add({
            userId: user.uid,
            content: postContent,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            document.getElementById('post-content').value = '';
            loadPosts();
        });
    }
});

// Load Posts
function loadPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    firebase.firestore().collection('posts').orderBy('timestamp', 'desc').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const post = doc.data();
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `<p>${post.content}</p>`;
                postsContainer.appendChild(postElement);
            });
        });
}

// Profile Form
document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const displayName = document.getElementById('display-name').value;
    const bio = document.getElementById('bio').value;
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.firestore().collection('users').doc(user.uid).set({
            displayName: displayName,
            bio: bio
        }, { merge: true }).then(() => {
            alert('تم حفظ التغييرات');
        });
    }
});

// Load Profile
function loadProfile() {
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.firestore().collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const profileInfo = document.getElementById('profile-info');
                    profileInfo.innerHTML = `
                        <p><strong>اسم العرض:</strong> ${doc.data().displayName}</p>
                        <p><strong>نبذة عنك:</strong> ${doc.data().bio}</p>
                    `;
                }
            });
    }
}

// Check Auth State
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadPosts();
        loadProfile();
    } else {
        window.location.href = 'login.html';
    }
});
// إنشاء حساب
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // تم إنشاء الحساب بنجاح
            alert('تم إنشاء الحساب بنجاح!');
            window.location.href = 'index.html'; // تحويل المستخدم إلى الصفحة الرئيسية
        })
        .catch((error) => {
            // حدث خطأ أثناء إنشاء الحساب
            alert(`خطأ: ${error.message}`);
        });
});

// تسجيل الدخول
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // تم تسجيل الدخول بنجاح
            alert('تم تسجيل الدخول بنجاح!');
            window.location.href = 'index.html'; // تحويل المستخدم إلى الصفحة الرئيسية
        })
        .catch((error) => {
            // حدث خطأ أثناء تسجيل الدخول
            alert(`خطأ: ${error.message}`);
        });
});
// التحقق من أول زيارة
if (!localStorage.getItem('visited')) {
    localStorage.setItem('visited', 'true');
    window.location.href = 'signup.html'; // تحويل المستخدم إلى صفحة إنشاء حساب
}
