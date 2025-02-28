
// Кнопка смены темы
document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    html.setAttribute('data-theme', html.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
});

// Выбор раздела Булевые функции или Теория графов
document.querySelectorAll('.section-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const target = this.dataset.target;
        const selector = document.querySelector('.section-selector');
        const activeSection = document.querySelector(`.${target}-section`);
        
        // Установка направления анимации
        if(target === 'boolean') {
            selector.classList.add('hide-left');
            activeSection.style.transform = 'translateX(-120%)'; // Исходная позиция слева
        } else {
            selector.classList.add('hide-right');
            activeSection.style.transform = 'translateX(120%)'; // Исходная позиция справа
        }

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
    const sections = document.querySelectorAll('.section-content');
    
    // Сброс анимации
    selector.classList.remove('hide-left', 'hide-right');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.transform = ''; // Сброс трансформации
    });
}
