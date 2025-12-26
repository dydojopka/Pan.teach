function getTaskUrl(id) {
    const type = id.startsWith('bt') ? 'bool' : 'graph';
    const taskNumber = id.replace(/\D/g, '');
    return `html/tasks/${type}_task${taskNumber}.html`;
}

// Кнопка смены темы
document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);

    // // Анимация при нажатии кнопки
    // const themeBtn = document.getElementById('theme-toggle');
    // themeBtn.style.transform = 'scale(1.2)';
    // setTimeout(() => {
    //     themeBtn.style.transform = 'scale(1)';
    // }, 200);
});

// Переключение темы(авто)
function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Выбор раздела Булевые функции или Теория графов
document.querySelectorAll('.section-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const target = this.dataset.target;
        updateSectionName(target); // Обновляем название раздела

        const selector = document.querySelector('.section-selector');
        const activeSection = document.querySelector(`.${target}-section`);

        // Установка направления анимации
        selector.classList.add(target === 'boolean' ? 'hide-left' : 'hide-right');
        activeSection.style.transform = target === 'boolean' ? 'translateX(-120%)' : 'translateX(120%)';

        // Активация секции
        setTimeout(() => {
            document.querySelectorAll('.section-content').forEach(section => {
                section.classList.remove('active');
            });
            activeSection.style.transform = 'translateX(0)';
            activeSection.classList.add('active');
        }, 300);
    });
});

// Возврат в главное меню
function returnToMainMenu() {
    const selector = document.querySelector('.section-selector');

    // Сбрасываем анимационные классы
    selector.classList.remove('hide-left', 'hide-right');
    selector.classList.add('active');

    // Сбрасываем разделы
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
        section.style.transform = '';
    });

    updateSectionName(null);
}

// Обновление названия раздела
function updateSectionName(section) {
    const sectionName = document.getElementById('section-name');
    const selector = document.querySelector('.section-selector');

    if (section === 'boolean') {
        sectionName.textContent = 'Булевы функции';
        selector.classList.remove('active');
    } else if (section === 'graph') {
        sectionName.textContent = 'Теория графов';
        selector.classList.remove('active');
    } else {
        sectionName.textContent = 'Главное меню';
        selector.classList.add('active');
    }
}

// Сохранение выбора темы
document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // Сохраняем в localStorage
});

// Тема при загрузке страницы
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Анимация загрузки страницы
function animatePageLoad() {
    const overlay = document.getElementById('initial-overlay');
    
    setTimeout(() => {
        overlay.style.opacity = '0';
        document.body.classList.add('loaded');
    }, 400);

    setTimeout(() => {
        overlay.remove();
    }, 800);
}
// Запускаем после полной загрузки
window.addEventListener('load', animatePageLoad);

// Анимация перехода на задачу
document.querySelectorAll('.buttons-task').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.classList.add('animating');

        const taskOverlay = document.getElementById('task-transition-overlay'); // Используем существующий оверлей
        taskOverlay.style.opacity = '1'; // Активируем его

        // Сохраняем оригинальную кнопку
        const originalBtn = this;
        const rect = originalBtn.getBoundingClientRect();

        // Скрываем оригинальную кнопку
        originalBtn.style.opacity = '0';
        originalBtn.style.pointerEvents = 'none';

        // Создаем клон с полными стилями
        const clone = originalBtn.cloneNode(true);
        clone.className = 'buttons-task active clone-animation';
        clone.style.cssText = `
            position: fixed;
            left: ${rect.left}px;
            top: ${rect.top}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            margin: 0;
            opacity: 1;
            pointer-events: none;
            transform: none;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        document.body.appendChild(clone);

        // Анимация масштабирования клона
        requestAnimationFrame(() => {
            clone.style.transform = `
                translate(-50%, -50%)
                scale(${Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.2})
            `;
            clone.style.left = '50%';
            clone.style.top = '50%';
            clone.style.opacity = '0.9';
        });

        // Удаление элементов после анимации
        setTimeout(() => {
            clone.remove();
            taskOverlay.style.opacity = '0'; // Убираем оверлей задач
            originalBtn.style.opacity = '';
            originalBtn.style.pointerEvents = '';
        }, 800);

        // Переход на страницу задачи
        setTimeout(() => {
            window.location.href = getTaskUrl(originalBtn.id);
        }, 750);
    });
});

// Активация сохраненного раздела при загрузке
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.setAttribute('data-theme',
        localStorage.getItem('theme') || 'light'
    );

    animatePageLoad();

    const lastSection = localStorage.getItem('lastActiveSection');
    if (lastSection) {
        const selector = document.querySelector('.section-selector');
        const activeSection = document.querySelector(`.${lastSection}-section`);

        // Анимация скрытия для section-selector
        selector.classList.add(lastSection === 'boolean' ? 'hide-left' : 'hide-right');

        // Активация сохраненного раздела
        setTimeout(() => {
            activeSection.classList.add('active');
            updateSectionName(lastSection);
            selector.classList.remove('active');
            // Полностью скрываем главное меню
        }, 50);

        localStorage.removeItem('lastActiveSection');
    }
});


async function markCompletedTasks() {
    console.log('markCompletedTasks called');

    const token = localStorage.getItem('token');
    console.log('token:', token);

    if (!token) return;

    const res = await fetch('/api/progress', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    console.log('progress response status', res.status);

    const data = await res.json();
    console.log('progress data', data);

    data.completedTasks.forEach(taskId => {
        const btn = document.getElementById(`bt${taskId}`);
        console.log('try mark', taskId, btn);

        if (btn) btn.classList.add('completed');
    });
}

document.addEventListener('DOMContentLoaded', markCompletedTasks);
