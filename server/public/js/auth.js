// Проверка, что пользователь вошёл
export function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    // Если нет токена — редирект на страницу логина
    window.location.href = '/login.html';
  }
}

// Получение токена
export function getToken() {
  return localStorage.getItem('token');
}

// Универсальная функция для API-запросов с токеном
export async function apiFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    // Если токен недействителен — редирект на логин
    window.location.href = '/login.html';
    return;
  }

  return res.json();
}
