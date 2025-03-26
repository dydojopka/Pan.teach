/** 
 * Инициализирует динамическое управление состоянием кнопки на основе валидации входных данных
 * 
 * @param {string} buttonId - ID HTML-элемента кнопки, которую нужно контролировать
 * @param {function} checkConditions - Функция-валидатор. Должна возвращать:
 *                   true - если все условия выполнены (кнопка активируется)
 *                   false - если условия не выполнены (кнопка блокируется)
 * @param {string[]} elementsToObserve - Массив CSS-селекторов для элементов,
 *                   при изменении которых нужно перепроверять условия
 * 
 * @example
 * // Пример использования:
 * initValidation(
 *   'submit-btn',
 *   () => document.getElementById('email').value.includes('@'),
 *   ['#email', '#password']
 * );
 */
export function initValidation(buttonId, checkConditions, elementsToObserve) {
    // Находим кнопку в DOM по указанному ID
    const button = document.getElementById(buttonId);
    if (!button) {
        console.error(`Кнопка с ID "${buttonId}" не найдена`);
        return;
    }

    /**
     * Внутренняя функция для обновления состояния кнопки.
     * Выполняет 3 ключевые действия:
     * 1. Проверяет условия через переданный callback
     * 2. Блокирует/разблокирует кнопку через атрибут disabled
     * 3. Управляет CSS-классом для визуальной индикации состояния
     */
    function updateButtonState() {
        // Вызываем функцию-валидатор для проверки условий
        const isValid = checkConditions();
        
        // Блокируем кнопку если условия не выполнены
        button.disabled = !isValid;
        
        /* 
         * Добавляем/удаляем CSS-класс 'disabled' для стилизации:
         * - true: добавляет класс (условия НЕ выполнены)
         * - false: удаляет класс (условия выполнены)
         */
        button.classList.toggle('disabled', !isValid);
    }

    // Назначаем обработчики событий для всех отслеживаемых элементов
    elementsToObserve.forEach(selector => {
        // Ищем все элементы соответствующие селектору
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            /*
             * Следим за двумя типами событий:
             * - input: любые изменения значения (ввод текста, автозаполнение. Например в bool_task2)
             * - change: изменение состояния (для чекбоксов/радио-кнопок. Например в bool_task4)
             */
            element.addEventListener('input', updateButtonState);
            element.addEventListener('change', updateButtonState);
            
            // Для элементов с предустановленными значениями сразу обновляем состояние
            if (element.value) updateButtonState();
        });
    });

    // Первоначальная проверка при инициализации
    updateButtonState();
}

/** 
 * Вставляет пробел каждые 4 символа
 * 
 * @param {string} input - Строка в которой нужно вставить пробелы
 */
export function formatWithSpaces(input) {
    const str = String(input); // Явное преобразование в строку
    return str.replace(/(.{4})(?=.)/g, '$1 '); // Регулярка с учётом границ строки
}


export function showToast(message, isError = true) {
    const toast = document.querySelector('.custom-toast');
    if (!toast) return;

    toast.querySelector('.toast-text').textContent = message;
    toast.classList.add('active');
    toast.style.backgroundColor = isError ? 'var(--color-red-light)' : 'var(--color-green-light)';

}

export function hideToast() {
    const toast = document.querySelector('.custom-toast');
    if (toast) toast.classList.remove('active');
}