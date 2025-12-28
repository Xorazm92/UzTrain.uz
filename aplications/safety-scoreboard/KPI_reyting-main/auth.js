// Simple Authentication System
// Users va ularning parollari (Ushbu yerda da taponoma sifatida yozilgan)
const USERS = {
    'admin': 'admin123',
    'manager': 'manager123',
    'supervisor': 'super123',
    'user': 'user123'
};

class Auth {
    constructor() {
        this.currentUser = null;
        this.checkSession();
    }

    checkSession() {
        const sessionUser = sessionStorage.getItem('loggedInUser');
        if (sessionUser) {
            this.currentUser = JSON.parse(sessionUser);
        }
    }

    login(username, password) {
        // Parolni tekshirish
        if (USERS[username] && USERS[username] === password) {
            this.currentUser = { username, role: 'user' };
            sessionStorage.setItem('loggedInUser', JSON.stringify(this.currentUser));
            return { success: true, message: 'Muvaffaqiyatli kirdi' };
        }
        return { success: false, message: 'Noto\'g\'ri login yoki parol' };
    }

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('loggedInUser');
        location.reload();
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getUsername() {
        return this.currentUser ? this.currentUser.username : null;
    }
}

const auth = new Auth();

function showLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.querySelector('.container');
    
    if (auth.isLoggedIn()) {
        if (loginScreen) loginScreen.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';
        // Foydalanuvchi nomini ko'rsatish
        const currentUserEl = document.getElementById('current-user');
        if (currentUserEl) {
            currentUserEl.textContent = '👤 ' + auth.getUsername();
        }
    } else {
        if (loginScreen) loginScreen.style.display = 'flex';
        if (appContainer) appContainer.style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        alert('Login va parolni kiriting');
        return;
    }

    const result = auth.login(username, password);
    if (result.success) {
        showLoginScreen();
        alert('Xush kelibsiz, ' + username + '!');
    } else {
        alert(result.message);
        document.getElementById('login-password').value = '';
    }
}

function handleLogout() {
    if (confirm('Chiqmoqchi musiz?')) {
        auth.logout();
    }
}

// Ishga tushganda kontrol qiling
window.addEventListener('DOMContentLoaded', () => {
    showLoginScreen();
});
