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

    const toastText = toast.querySelector('.toast-text');
    if (message.includes('<math>')) {
        toastText.innerHTML = message;
    } else {
        toastText.textContent = message;
    }
    toast.classList.add('active');
    toast.style.backgroundColor = isError ? 'var(--color-red-light)' : 'var(--color-green-light)';
}

export function hideToast() {
    const toast = document.querySelector('.custom-toast');
    if (toast) {
        toast.classList.remove('active');
        // Очищаем текст и сбрасываем стили
        toast.querySelector('.toast-text').textContent = '';
        toast.style.backgroundColor = '';
    }
}

/**
 * Преобразует математическую формулу в MathML формат
 * 
 * @param {string} formula - Строка формулы в формате ДНФ/КНФ
 * @returns {string} - Строка в формате MathML
 */
export function formulaToMathML(formula) {
    // Обработка констант
    const cleanFormula = formula.trim();
    if (cleanFormula === '0') return "<math><mn>0</mn></math>";
    if (cleanFormula === '1') return "<math><mn>1</mn></math>";

    // Определяем тип формулы (ДНФ или КНФ) по первому оператору
    const isDNF = formula.includes('+');
    const mainOperator = isDNF ? '∨' : '∧';
    const termOperator = isDNF ? '∧' : '∨';

    // Разбиваем формулу на термы
    const terms = isDNF 
        ? formula.split('+').map(t => t.trim())
        : formula.split('*').map(t => t.trim());

    const mathmlTerms = terms.map(term => {
        const variables = term.split(isDNF ? '*' : '+').map(v => {
            const varTrim = v.trim();
            const isNegated = varTrim.startsWith('!');
            const varNum = parseInt(varTrim.replace(/[!x]/gi, ''));
            
            return isNegated
                ? `<mover><msub><mi>x</mi><mn>${varNum}</mn></msub><mo stretchy="true" style="transform: scale(3, 1.2) translateX(-0.1em) translateY(-0.05em);">‾</mo></mover>`
                : `<msub><mi>x</mi><mn>${varNum}</mn></msub>`;
        });

        return variables.length > 1
            ? `<mrow><mo>(</mo>${variables.join(`<mo>${termOperator}</mo>`)}<mo>)</mo></mrow>`
            : variables[0];
    });

    return `<math>${mathmlTerms.join(`<mo>${mainOperator}</mo>`)}</math>`;

}