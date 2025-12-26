import { initValidation, formatWithSpaces, showToast, hideToast } from '../common.js';

// Функция для проверки условий валидации
function checkConditions() {
    const zeroInput = document.getElementById('zeroInput');
    const oneInput = document.getElementById('oneInput');
    if (!zeroInput || !oneInput) return false;
    
    const zeroResidual = zeroInput.value.replace(/\s+/g, '');
    const oneResidual = oneInput.value.replace(/\s+/g, '');

    // Проверка на пустые значения
    if (!zeroResidual || !oneResidual) return false;

    // Проверка на корректность символов
    if (!/^[01]+$/.test(zeroResidual) || !/^[01]+$/.test(oneResidual)) return false;

    // Проверка равенства длин векторов
    if (zeroResidual.length !== oneResidual.length) return false;

    // Проверка, что длина является степенью двойки
    const length = zeroResidual.length;
    return (length & (length - 1)) === 0;
}

// Функция для восстановления булевой функции из остаточных функций
function restoreFunction(zeroResidual, oneResidual, argIndex) {
    // Преобразуем строки в массивы чисел
    const zeroVector = zeroResidual.split('').map(Number);
    const oneVector = oneResidual.split('').map(Number);

    // Определяем количество аргументов
    const n = Math.log2(zeroVector.length) + 1;
    const restoredFunction = [];

    // Количество комбинаций для остаточных функций
    const numCombinations = Math.pow(2, n - 1);

    for (let i = 0; i < numCombinations * 2; i++) {
        // Преобразуем индекс в двоичное представление
        const binary = i.toString(2).padStart(n, '0');
        // Определяем значение аргумента x_i
        if (parseInt(binary[argIndex]) === 0) {
            // Используем нулевую остаточную функцию
            const residualIndex = parseInt(
                binary.slice(0, argIndex) + binary.slice(argIndex + 1),
                2
            );
            restoredFunction.push(zeroVector[residualIndex]);
        } else {
            // Используем единичную остаточную функцию
            const residualIndex = parseInt(
                binary.slice(0, argIndex) + binary.slice(argIndex + 1),
                2
            );
            restoredFunction.push(oneVector[residualIndex]);
        }
    }

    return restoredFunction;
}

// Функция для обновления радио-кнопок аргументов
function updateArgRadios(vectorLength) {
    const n = Math.log2(vectorLength) + 1;
    const radioGroup = document.getElementById('arg-radio-group');
    radioGroup.innerHTML = '<label>Выберите аргумент:</label>';

    for (let i = 1; i <= n; i++) {
        const container = document.createElement('div');
        const radioId = `arg-${i}`;

        container.innerHTML = `
            <input type="radio" 
                   name="arg" 
                   id="${radioId}" 
                   value="${i-1}" 
                   ${i === 1 ? 'checked' : ''}>
            <label for="${radioId}">x${i}</label>
        `;

        radioGroup.appendChild(container);
    }
}

// Функция для вычисления и отображения результата
function generateTable() {
    const zeroInput = document.getElementById('zeroInput');
    const oneInput = document.getElementById('oneInput');
    if (!zeroInput || !oneInput) return false;
    
    const zeroResidual = zeroInput.value.replace(/\s+/g, '');
    const oneResidual = oneInput.value.replace(/\s+/g, '');
    const argIndex = parseInt(document.querySelector('input[name="arg"]:checked').value);
    const output = document.getElementById('output');

    hideToast();

    // Проверка равенства длин векторов
    if (zeroResidual.length !== oneResidual.length) {
        showToast('Ошибка: векторы должны быть одинаковой длины');
        return;
    }

    // Проверка, что длина является степенью двойки
    const length = zeroResidual.length;
    if ((length & (length - 1)) !== 0) {
        showToast('Ошибка: длина векторов должна быть степенью двойки');
        return;
    }

    try {
        const result = restoreFunction(zeroResidual, oneResidual, argIndex);
        const formattedResult = formatWithSpaces(result.join(''));
        output.innerHTML = `
            f = (${formattedResult})
        `;
        // showToast('Функция успешно восстановлена!', false);
    } catch (error) {
        showToast(`Ошибка: ${error.message}`);
    }
}

// Обработчик ввода для обновления радио-кнопок
function updateInputDisplay(event) {
    const inputField = event.target;
    let inputValue = inputField.value.replace(/[^0-1]/g, '');  // Убираем все, кроме 0 и 1

    // Форматируем значение с пробелами
    const formattedValue = formatWithSpaces(inputValue);

    // Сохраняем позицию курсора
    const cursorPosition = inputField.selectionStart - (inputField.value.match(/ /g)?.length || 0);

    // Вставляем форматированное значение обратно в input
    inputField.value = formattedValue;

    // Сохранение новой позиции
    const newCursorPos = cursorPosition + Math.floor(cursorPosition / 4);

    // Восстанавливаем позицию курсора после обновления значения
    inputField.setSelectionRange(newCursorPos, newCursorPos);

    const zeroInput = document.getElementById('zeroInput');
    const oneInput = document.getElementById('oneInput');
    if (!zeroInput || !oneInput) return false;
    
    const zeroResidual = zeroInput.value.replace(/\s+/g, '');
    const oneResidual = oneInput.value.replace(/\s+/g, '');

    // Проверка равенства длин векторов
    if (zeroResidual && oneResidual && zeroResidual.length !== oneResidual.length) {
        showToast('Ошибка: векторы должны быть одинаковой длины');
        return;
    }

    // Проверка, что длина является степенью двойки
    if (zeroResidual && oneResidual) {
        const length = zeroResidual.length;
        if ((length & (length - 1)) !== 0) {
            showToast('Ошибка: длина векторов должна быть степенью двойки');
            return;
        }
    }

    hideToast();
    if (checkConditions()) {
        updateArgRadios(zeroResidual.length);
    }
}

// Инициализация валидации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем валидацию для кнопки генерации
    initValidation(
        'generateBtn',
        checkConditions,
        ['#zeroInput', '#oneInput']
    );

    // Добавляем обработчик для кнопки генерации
    const generateButton = document.getElementById('generateBtn');
    if (generateButton) {
        generateButton.addEventListener('click', generateTable);
    }

    // Добавляем обработчики событий для полей ввода
    const zeroInput = document.getElementById('zeroInput');
    const oneInput = document.getElementById('oneInput');
    if (zeroInput && oneInput) {
        zeroInput.addEventListener('input', updateInputDisplay);
        oneInput.addEventListener('input', updateInputDisplay);
    }
});