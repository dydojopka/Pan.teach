// Синхронизация темы с главной и обратно 
function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Кнопка бокового меню
document.getElementById('menu-toggle').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    const infoBtn = document.querySelector('.info-btn');
    const modal = document.getElementById('infoModal');
    
    sidebar.classList.toggle('sidebar--active');
    
    // Закрываем модалку при открытии/закрытии панели
    modal.style.display = 'none';
    
    // Переключаем состояние кнопки
    infoBtn.classList.toggle('disabled', sidebar.classList.contains('sidebar--active'));
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

// Логика модального окна информации
let isDragging = false;
let currentModal = null;
let offset = [0,0];

function toggleInfoModal() {
    const modal = document.getElementById('infoModal');
    const container = document.querySelector('.task-container');
    
    if(modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
        modal.style.opacity = '0';
        
        // Рассчет позиции относительно контейнера
        const containerRect = container.getBoundingClientRect();
        const modalWidth = modal.offsetWidth;
        
        modal.style.left = `${containerRect.left + (containerRect.width/2 - modalWidth/2)}px`;
        modal.style.top = `${containerRect.top + 20}px`; // 20px от верхнего края
        
        setTimeout(() => {
            modal.style.opacity = '1';
            currentModal = modal;
        }, 10);
    }
}

// Логика перетаскивания
document.addEventListener('mousedown', function(e) {
    if(e.target.closest('.modal-header')) {
        isDragging = true;
        currentModal = e.target.closest('.modal');
        const rect = currentModal.getBoundingClientRect();
        offset = [
            e.clientX - rect.left,
            e.clientY - rect.top
        ];
        
        // Фиксируем текущую позицию окна
        currentModal.dataset.initialTop = rect.top;
        currentModal.dataset.initialLeft = rect.left;
    }
});

document.addEventListener('mousemove', function(e) {
    if(isDragging && currentModal) {
        // Используем абсолютные координаты с учетом прокрутки
        const x = e.clientX - offset[0];
        const y = e.clientY - offset[1];
        
        currentModal.style.left = `${x}px`;
        currentModal.style.top = `${y}px`;
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
    currentModal = null;
});

// Закрытие по кнопке
document.addEventListener('click', function(e) {
    if(e.target.closest('.close-btn')) {
        const modal = document.getElementById('infoModal');
        modal.style.display = 'none';
    }
});