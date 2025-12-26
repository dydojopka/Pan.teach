export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    window.location.href = '/login.html';
    return;
  }

  return res.json();
}
