// Синхронизация темы с главной и обратно 
function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Кнопка бокового меню
document.getElementById('menu-toggle').addEventListener('click', function () {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('sidebar--active');
});

// Логика кнопки "Назад" для страниц задач
function returnToMainMenu() {
    const taskType = getTaskTypeFromUrl();
    
    if (taskType) {
        localStorage.setItem('lastActiveSection', taskType);
    }
    window.location.href = '../index.html';
}

// Определение раздела по url задачи
function getTaskTypeFromUrl() {
    const path = window.location.pathname;
    if (path.includes('bool_task')) return 'boolean';
    if (path.includes('graph_task')) return 'graph';
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    // Восстановление темы для задач
    document.documentElement.setAttribute('data-theme', 
        localStorage.getItem('theme') || 'light'
    );
});