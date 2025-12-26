const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    alert('Ошибка входа');
    return;
  }

  const data = await res.json();
  localStorage.setItem('token', data.token);

  window.location.href = '/';
});
