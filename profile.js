import { getAuth, updateProfile, updatePassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { auth } from './auth.js';

window.updateProfile = async function() {
    const username = document.getElementById('usernameInput').value.trim();
    const profileImage = document.getElementById('profileImageInput').files[0];

    if (!username && !profileImage) {
        document.getElementById('profileError').textContent = "يجب إدخال اسم مستخدم أو صورة";
        return;
    }

    try {
        const user = auth.currentUser;
        if (username) {
            await updateProfile(user, { displayName: username });
        }
        if (profileImage) {
            // هنا يمكنك رفع الصورة إلى Firebase Storage وتحديث رابط الصورة في ملف المستخدم
        }
        document.getElementById('profileError').textContent = "تم تحديث الملف الشخصي بنجاح";
    } catch (error) {
        document.getElementById('profileError').textContent = "حدث خطأ أثناء تحديث الملف الشخصي";
    }
};

window.changePassword = async function() {
    const newPassword = prompt("أدخل كلمة المرور الجديدة:");
    if (!newPassword) {
        return;
    }

    try {
        const user = auth.currentUser;
        await updatePassword(user, newPassword);
        alert("تم تغيير كلمة المرور بنجاح");
    } catch (error) {
        alert("حدث خطأ أثناء تغيير كلمة المرور");
    }
};
