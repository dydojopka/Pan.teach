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

// Выбор раздела Булевые функции или Теория графов
document.querySelectorAll('.section-btn').forEach(btn => {
    btn.addEventListener('click', function() {
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
    updateSectionName(null); // Сбрасываем название раздела

    const selector = document.querySelector('.section-selector');
    const sections = document.querySelectorAll('.section-content');
    
    // Сброс анимации
    selector.classList.remove('hide-left', 'hide-right');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.transform = ''; // Сброс трансформации
    });
}

// Обновление названия раздела
function updateSectionName(section) {
    const sectionName = document.getElementById('section-name');
    if (section === 'boolean') {
        sectionName.textContent = 'Булевы функции';
    } else if (section === 'graph') {
        sectionName.textContent = 'Теория графов';
    } else {
        sectionName.textContent = 'Главное меню';
    }
}