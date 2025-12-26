document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      document.getElementById('error-message').textContent = 'Неверный логин или пароль';
      return;
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);

    window.location.href = '/'; // переходим на главную
  } catch (err) {
    document.getElementById('error-message').textContent = 'Ошибка при входе';
  }
});
