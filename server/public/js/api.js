export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token') || '';

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  });

  if (res.status === 401) {
    // если нет прав
    window.location.href = '/login.html';
    return;
  }

  return res.json();
}
