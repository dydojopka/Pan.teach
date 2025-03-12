// Запрет ввода нечисловых значений
document.getElementById('nInput').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-1]/g, '');
});

function computeResidual(functionVector, argValue, argIndex) {
    const n = Math.floor(Math.log2(functionVector.length)); // Определяем количество переменных
    let residualFunction = [];

    functionVector.forEach((value, i) => {
        // Преобразуем индекс в двоичное представление
        const binary = i.toString(2).padStart(n, '0');

        // Проверяем, совпадает ли значение аргумента с заданным
        if (parseInt(binary[argIndex], 10) === argValue) {
            residualFunction.push(value);
        }
    });

    return residualFunction;
}

function updateArgs() {
    const nInput = document.getElementById('nInput').value;
    
    // Проверка на корректность введённых данных
    if (!nInput || isNaN(nInput)) {
        return;
    }

    // Преобразуем строку в массив чисел (это будет наш вектор функции)
    const functionVector = Array.from(nInput).map(digit => parseInt(digit, 10));
    
    // Проверка на степень двойки
    const n = Math.log2(functionVector.length);

    // Динамически генерируем радиокнопки для выбора аргумента
    const argRadioGroup = document.getElementById('arg-radio-group');
    argRadioGroup.innerHTML = `<label>Выберите номер аргумента:</label><br>`; // Очищаем старые кнопки
    
    for (let i = 1; i <= n; i++) {
        const radioButton = document.createElement('label');
        radioButton.innerHTML = `<input type="radio" name="arg" value="${i}" ${i === 1 ? 'checked' : ''}>x${i}`;
        argRadioGroup.appendChild(radioButton);
    }
}

function generateTable() {
    const nInput = document.getElementById('nInput').value;
    
    // Проверка на введённые данные
    if (!nInput || isNaN(nInput)) {
        alert("Введите корректное числовое значение для вектора функции.");
        return;
    }

    // Преобразуем введённый вектор в массив
    const functionVector = Array.from(nInput).map(digit => parseInt(digit, 10));

    // Определяем количество аргументов на основе длины вектора
    const n = Math.log2(functionVector.length);
    if (!Number.isInteger(n)) {
        alert("Длина вектора функции должна быть степенью 2.");
        return;
    }

    // Получаем выбранные значения для остаточной и аргумента
    const residualValue = parseInt(document.querySelector('input[name="residual"]:checked').value);
    const argValue = parseInt(document.querySelector('input[name="arg"]:checked').value) - 1; // Номер аргумента (начиная с 0)

    // Вычисляем остаточную функцию
    const residual = computeResidual(functionVector, residualValue, argValue);

    // Формируем математическую формулу для вывода
    const formula = `f<sup>${residualValue}</sup><sub>${argValue + 1}</sub> = ${residual.join('')}`;

    // Выводим результат как формулу
    document.getElementById('output').innerHTML = formula;
}
