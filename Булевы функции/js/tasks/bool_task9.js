document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчик события input
    document.getElementById('vectorInput').addEventListener('input', function() {
        updateInputDisplay();
    });
});

function formatWithSpaces(input) {
    return input.replace(/(.{4})(?=.)/g, '$1 ');  // Вставляем пробел после каждого 4-го символа
}

function validateVector(vector) {
    // Убираем все пробелы для проверки длины
    const cleanVector = vector.replace(/\s/g, '');
    const length = cleanVector.length;

    // Проверяем, что длина является степенью двойки
    if (length === 0 || (length & (length - 1)) !== 0) {
        showError('Длина вектора должна быть степенью двойки');
        return false;
    }

    return true;
}

function updateInputDisplay() {
    const inputField = document.getElementById('vectorInput');
    let inputValue = inputField.value.replace(/[^0-1]/g, '');  // Убираем все, кроме 0 и 1

    // Форматируем значение с пробелами
    const formattedValue = formatWithSpaces(inputValue);

    // Сохраняем позицию курсора
    const cursorPosition = inputField.selectionStart;

    // Вставляем форматированное значение обратно в input
    inputField.value = formattedValue;

    // Восстанавливаем позицию курсора после обновления значения
    const newPosition = cursorPosition + (formattedValue.length - inputValue.length);
    inputField.setSelectionRange(newPosition, newPosition);
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

function generateTable(vector) {
    // Очищаем вектор от пробелов
    const cleanVector = vector.replace(/\s/g, '');
    
    // Проверяем длину вектора
    if (!validateVector(cleanVector)) {
        return;
    }
    
    const n = Math.log2(cleanVector.length); // количество переменных
    const table = document.getElementById('tableContainer');
    table.innerHTML = '';

    // Создаем заголовок таблицы
    const headerRow = table.insertRow();
    
    // Добавляем заголовки для переменных
    for (let i = 1; i <= n; i++) {
        const th = document.createElement('th');
        th.textContent = `x${i}`;
        headerRow.appendChild(th);
    }
    
    // Добавляем заголовок для значения функции
    const thF = document.createElement('th');
    thF.textContent = 'f';
    headerRow.appendChild(thF);

    // Создаем тело таблицы
    for (let i = 0; i < cleanVector.length; i++) {
        const row = table.insertRow();
        
        // Преобразуем индекс в двоичное представление
        const binary = i.toString(2).padStart(n, '0');
        
        // Добавляем значения переменных
        for (let j = 0; j < n; j++) {
            const td = row.insertCell();
            td.textContent = binary[j];
        }
        
        // Добавляем значение функции
        const tdF = row.insertCell();
        tdF.textContent = cleanVector[i];
    }
}

function buildSKNFFormula(vector) {
    const n = Math.log2(vector.length); // количество переменных
    const terms = [];

    for (let i = 0; i < vector.length; i++) {
        if (vector[i] === '0') { // Ищем нули в векторе функции
            const binary = i.toString(2).padStart(n, '0');
            const variables = [];
            
            for (let j = 0; j < n; j++) {
                if (binary[j] === '1') { // Инвертируем условие по сравнению с СДНФ
                    variables.push(`<mover><msub><mi>x</mi><mn>${j + 1}</mn></msub><mo stretchy="true" style="transform: scale(3, 1.2) translateX(-0.1em) translateY(-0.05em);">‾</mo></mover>`);
                } else {
                    variables.push(`<msub><mi>x</mi><mn>${j + 1}</mn></msub>`);
                }
            }
            terms.push(`<mrow><mo>(</mo>${variables.join('<mo>∨</mo>')}<mo>)</mo></mrow>`); // Используем дизъюнкцию внутри скобок
        }
    }

    return `<math>${terms.join('<mo>∧</mo>')}</math>`; // Соединяем термы конъюнкцией
}

function buildSKNF() {
    hideError();
    const vectorInput = document.getElementById('vectorInput').value;
    
    if (!validateVector(vectorInput)) {
        return;
    }

    // Очищаем вектор от пробелов
    const cleanVector = vectorInput.replace(/\s/g, '');

    // Строим таблицу истинности
    generateTable(vectorInput);

    // Строим и отображаем СКНФ
    const sknfFormula = buildSKNFFormula(cleanVector);
    document.getElementById('sknfFormula').innerHTML = sknfFormula;
}