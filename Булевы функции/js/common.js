/** 
 * Валидация состояния кнопки на основе условий
 * @param {string} buttonId - ID кнопки, которую нужно контролировать
 * @param {function} checkConditions - Функция-предикат, возвращающая: 
 *                                     true - если условия выполнены (кнопка активна)
 *                                     false - если условия не выполнены (кнопка неактивна)
 * @param {string[]} elementsToObserve - Массив CSS-селекторов элементов, за изменениями которых нужно следить:
 *                                       ['input.my-class', '#my-id', '.radio-group'] и т.д.
 */
export function initValidation(buttonId, checkConditions, elementsToObserve) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    // Функция обновления состояния кнопки
    function updateButtonState() {
        const isValid = checkConditions();
        button.disabled = !isValid;
        button.classList.toggle('disabled', !isValid);
    }

    // Назначаем обработчики на все указанные элементы
    elementsToObserve.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('input', updateButtonState);
            element.addEventListener('change', updateButtonState);
        });
    });

    // Инициализация начального состояния
    updateButtonState();
}