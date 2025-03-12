function formatWithSpaces(input) {
    return input.replace(/(.{4})(?=.)/g, '$1 ');  // Вставляем пробел после каждого 4-го символа
}

function updateInputDisplay() {
    const inputField = document.getElementById('nInput');
    let inputValue = inputField.value.replace(/[^0-1]/g, '');  // Убираем все, кроме 0 и 1

    // Форматируем значение с пробелами, чтобы визуально отображались пробелы
    const formattedValue = formatWithSpaces(inputValue);  

    // Сохраняем позицию курсора
    const cursorPosition = inputField.selectionStart;

    // Вставляем форматированное значение обратно в input
    inputField.value = formattedValue;

    // Восстанавливаем позицию курсора после обновления значения
    inputField.setSelectionRange(cursorPosition + (formattedValue.length - inputValue.length), cursorPosition + (formattedValue.length - inputValue.length));

    // Обновляем радиокнопки для аргументов
    updateArgs(inputValue);
}

// Функция для обновления радиокнопок
function updateArgs(inputValue) {
    // Убираем пробелы из строки для вычислений
    const functionVector = inputValue.replace(/\s+/g, ''); // Убираем пробелы
    const n = Math.log2(functionVector.length);

    if (!Number.isInteger(n)) return; // Если длина не степень двойки, не обновляем радиокнопки

    const argRadioGroup = document.getElementById('arg-radio-group');
    const existingRadioButtons = argRadioGroup.querySelectorAll('input[type="radio"]');

    // Удаляем лишние радиокнопки
    if (existingRadioButtons.length > n) {
        for (let i = existingRadioButtons.length - 1; i >= n; i--) {
            existingRadioButtons[i].parentElement.remove();
        }
    }

    // Добавляем недостающие радиокнопки
    for (let i = existingRadioButtons.length + 1; i <= n; i++) {
        const radioButton = document.createElement('label');
        radioButton.innerHTML = `<input type="radio" name="arg" value="${i}" ${i === 1 ? 'checked' : ''}>x${i}`;
        argRadioGroup.appendChild(radioButton);
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

// Генерация таблицы и формирование результата
function generateTable() {
    const nInput = document.getElementById('nInput').value.replace(/\s+/g, ''); // Убираем пробелы из ввода
    if (!nInput || !/^[01]+$/.test(nInput)) {
        alert("Введите корректное числовое значение для вектора функции.");
        return;
    }

    const functionVector = Array.from(nInput).map(digit => parseInt(digit, 10));
    const n = Math.log2(functionVector.length);
    if (!Number.isInteger(n)) {
        alert("Длина вектора функции должна быть степенью 2.");
        return;
    }

    const residualValue = parseInt(document.querySelector('input[name="residual"]:checked').value);
    const argValue = parseInt(document.querySelector('input[name="arg"]:checked').value) - 1;

    const residual = computeResidual(functionVector, residualValue, argValue);
    
    // Формируем математическую формулу для вывода с пробелами
    const formattedResidual = formatWithSpaces(residual.join(''));

    const formula = `f<sup>${residualValue}</sup><sub>${argValue + 1}</sub> = (${formattedResidual})`;
    document.getElementById('output').innerHTML = formula;
}