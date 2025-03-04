function generateBooleanFunction(n) {
    const numCombinations = 2 ** n;
    return Array.from({ length: numCombinations }, () => Math.floor(Math.random() * 2));
}

function generateTable() {
    const n = parseInt(document.getElementById('nInput').value);
    if (isNaN(n) || n < 1) {
        alert("Введите корректное значение n (≥1)");
        return;
    }

    const booleanFunction = generateBooleanFunction(n);
    const output = document.getElementById('output');
    const tableContainer = document.getElementById('tableContainer');

    // Очистка предыдущих результатов
    output.innerHTML = '';
    tableContainer.innerHTML = '';

    // Вывод строки f
    output.innerHTML = `f = (${booleanFunction.join(', ')})`;

    // Создание таблицы
    const table = document.createElement('table');
    const headerRow = table.insertRow();

    // Заголовки столбцов
    for (let i = 1; i <= n; i++) {
        const th = document.createElement('th');
        th.textContent = `x${i}`;
        headerRow.appendChild(th);
    }
    const thResult = document.createElement('th');
    thResult.textContent = 'f';
    headerRow.appendChild(thResult);

    // Заполнение данных
    for (let i = 0; i < booleanFunction.length; i++) {
        const tr = table.insertRow();
        const binary = i.toString(2).padStart(n, '0');

        // Входные значения
        for (let bit of binary) {
            const td = tr.insertCell();
            td.textContent = bit;
        }

        // Результат
        const tdResult = tr.insertCell();
        tdResult.textContent = booleanFunction[i];
    }

    tableContainer.appendChild(table);
}