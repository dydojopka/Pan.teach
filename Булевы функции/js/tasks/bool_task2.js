import { initValidation, formatWithSpaces, showToast, hideToast } from '../common.js';

const GENERATE_BUTTON_ID = 'generate';

function updateInputDisplay() {
    const inputField = document.getElementById('nInput');
    let inputValue = inputField.value.replace(/[^0-1]/g, '');  // Убираем все, кроме 0 и 1

    // Форматируем значение с пробелами, чтобы визуально отображались пробелы
    const formattedValue = formatWithSpaces(inputValue);

    // Сохраняем позицию курсора
    const cursorPosition = inputField.selectionStart - (inputField.value.match(/ /g)?.length || 0);

    // Вставляем форматированное значение обратно в input
    inputField.value = formattedValue;

    // Сохранение новой позиции
    const newCursorPos = cursorPosition + Math.floor(cursorPosition / 4);

    // Восстанавливаем позицию курсора после обновления значения
    inputField.setSelectionRange(newCursorPos, newCursorPos);

    // Обновляем радиокнопки для аргументов
    updateArgs(inputValue);
}

// Функция для обновления радиокнопок
function updateArgs(inputValue) {
    const functionVector = inputValue.replace(/\s+/g, '');
    const n = Math.log2(functionVector.length);

    if (!Number.isInteger(n) || functionVector.length < 2) {
        document.getElementById('arg-radio-group').innerHTML = '<label>Выберите аргумент:</label>';
        return;
    }

    if (!Number.isInteger(n)) return;

    const argRadioGroup = document.getElementById('arg-radio-group');
    argRadioGroup.innerHTML = '<label>Выберите аргумент:</label>';

    for (let i = 1; i <= n; i++) {
        const container = document.createElement('div');
        const radioId = `arg-${i}`;

        container.innerHTML = `
            <input type="radio" 
                   name="arg" 
                   id="${radioId}" 
                   value="${i}" 
                   ${i === 1 ? 'checked' : ''}>
            <label for="${radioId}">x${i}</label>
        `;

        argRadioGroup.appendChild(container);
    }
}

// Функция для вычисления остаточной функции
function computeResidual(functionVector, argValue, argIndex) {
    let residualFunction = [];
    for (let i = 0; i < functionVector.length; i++) {
        const bit = (i >> argIndex) & 1;
        if (bit === argValue) {
            residualFunction.push(functionVector[i]);
        }
    }
    return residualFunction;
}

// Функция проверки условий валидации
function validationCheck() {
    const nInput = document.getElementById('nInput').value.replace(/\s+/g, '');
    let errorMessage = null;

    // Проверка 1: Корректность символов
    if (!nInput || !/^[01]+$/.test(nInput)) {
        errorMessage = "Введите вектор функции";
    }
    // Проверка 2: Длина вектора
    else if (nInput.length < 2 || !Number.isInteger(Math.log2(nInput.length))) {
        errorMessage = "Длина вектора должна быть степенью двойки";
    }

    if (errorMessage) {
        showToast(errorMessage);
        return false;
    } else {
        hideToast();
        return true;
    }
}

// Генерация таблицы и формирование результата
function generateTable() {
    if (!validationCheck()) return;

    const nInput = document.getElementById('nInput').value.replace(/\s+/g, ''); // Убираем пробелы из ввода
    const functionVector = Array.from(nInput).map(digit => parseInt(digit, 10));

    // Проверка существования выбранного аргумента
    const argRadio = document.querySelector('input[name="arg"]:checked');
    if (!argRadio) {
        showToast("Выберите аргумент для вычисления");
        return;
    }

    const residualValue = parseInt(document.querySelector('input[name="residual"]:checked').value);
    const argValue = parseInt(argRadio.value) - 1;

    const residual = computeResidual(functionVector, residualValue, argValue);

    // Формируем математическую формулу для вывода с пробелами
    const formattedResidual = formatWithSpaces(residual.join(''));

    document.getElementById('output').innerHTML = 
    `f<sup>${residualValue}</sup><sub>${argValue + 1}</sub> = (${formattedResidual})`;
}

// Инициализация валидации при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initValidation(
        GENERATE_BUTTON_ID,
        validationCheck,
        ['#nInput', 'input[name="arg"]', 'input[name="residual"]']
    );

    document.getElementById('nInput').addEventListener('input', updateInputDisplay);
    document.getElementById(GENERATE_BUTTON_ID).addEventListener('click', generateTable);

    document.getElementById('nInput').addEventListener('input', () => {
        if (validationCheck()) hideToast();
    });
});