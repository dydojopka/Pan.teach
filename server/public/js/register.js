document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById('error-message').textContent = data.message;
      return;
    }

    alert('Регистрация успешна! Войдите на сайт.');
    window.location.href = '/login.html';
  } catch (err) {
    document.getElementById('error-message').textContent = 'Ошибка сервера';
  }
});
