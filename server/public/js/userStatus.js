import { getToken } from './auth.js';

function updateUserStatus() {
    const userStatusEl = document.getElementById('userStatus');
    if (!userStatusEl) return;

    const token = getToken();

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.name || 'Анонимный пользователь';

        userStatusEl.textContent = username;
        userStatusEl.style.cursor = 'pointer';
        userStatusEl.onclick = () => {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        };
    } else {
        userStatusEl.textContent = 'Войти';
        userStatusEl.style.cursor = 'pointer';
        userStatusEl.onclick = () => {
            window.location.href = '/login.html';
        };
    }
}

document.addEventListener('DOMContentLoaded', updateUserStatus);
window.updateUserStatus = updateUserStatus;
