import { initValidation } from '../common.js';

// Глобальные переменные для хранения текущего состояния игры
let currentVector = '';
let variablesCount = 0;
let correctAnswer = [];

// Функция для генерации случайного вектора функции
function generateVector() {
    // Получаем значение из поля ввода
    const input = document.getElementById('variablesCount');
    variablesCount = parseInt(input.value);
    
    // Проверяем валидность введенного значения
    if (variablesCount < 2 || variablesCount > 4) {
        document.getElementById('result').textContent = 'Количество переменных должно быть от 2 до 4!';
        return;
    }
    
    const vectorLength = Math.pow(2, variablesCount);
    
    // Генерируем случайный вектор
    currentVector = Array.from({length: vectorLength}, () => Math.round(Math.random())).join('');
    
    // Определяем существенные переменные
    correctAnswer = determineEssentialVariables(currentVector, variablesCount);
    
    // Обновляем отображение
    displayVector();
    createVariableControls();
    
    // Очищаем предыдущий результат
    document.getElementById('result').textContent = '';
}

// Функция для отображения вектора функции
function displayVector() {
    const vectorSpan = document.querySelector('#functionVector span');
    vectorSpan.textContent = `(${currentVector.replace(/(.{4})(?!$)/g, '$1 ')})`;
}

// Функция для создания элементов управления переменными
function createVariableControls() {
    const container = document.getElementById('variablesGroup');
    container.innerHTML = '';
    
    for (let i = 0; i < variablesCount; i++) {
        const varDiv = document.createElement('div');
        varDiv.className = 'variable-item';
        varDiv.draggable = true;
        varDiv.dataset.variable = `x${i + 1}`;
        varDiv.dataset.index = i;
        varDiv.textContent = `x${i + 1}`;
        
        // Добавляем обработчики событий drag and drop
        varDiv.addEventListener('dragstart', handleDragStart);
        varDiv.addEventListener('dragend', handleDragEnd);
        
        container.appendChild(varDiv);
    }

    // Очищаем зоны drop
    document.getElementById('essentialVariables').innerHTML = '';
    document.getElementById('fictiveVariables').innerHTML = '';
}

// Обработчики событий drag and drop
function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', JSON.stringify({
        index: this.dataset.index,
        variable: this.dataset.variable,
        sourceContainer: this.parentElement.id
    }));
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const draggedElement = document.querySelector(`[data-index="${data.index}"]`);
    
    if (draggedElement) {
        const newElement = document.createElement('div');
        newElement.className = 'variable-item';
        newElement.draggable = true;
        newElement.dataset.index = data.index;
        newElement.dataset.variable = data.variable;
        newElement.textContent = data.variable;
        
        // Добавляем обработчики событий drag and drop
        newElement.addEventListener('dragstart', handleDragStart);
        newElement.addEventListener('dragend', handleDragEnd);
        
        this.appendChild(newElement);
        draggedElement.remove();
    }
}

// Функция для определения существенных переменных
function determineEssentialVariables(vector, varCount) {
    const result = [];
    const n = Math.pow(2, varCount);
    
    for (let i = 0; i < varCount; i++) {
        let isEssential = false;
        const step = Math.pow(2, i);
        
        for (let j = 0; j < n; j++) {
            if ((j & step) === 0) {
                if (vector[j] !== vector[j | step]) {
                    isEssential = true;
                    break;
                }
            }
        }
        
        result.push(isEssential);
    }
    
    return result;
}

// Функция для проверки ответа пользователя
function checkAnswer() {
    if (!currentVector) {
        document.getElementById('result').textContent = 'Сначала сгенерируйте вектор функции!';
        return;
    }
    
    const essentialZone = document.getElementById('essentialVariables');
    const fictiveZone = document.getElementById('fictiveVariables');
    const totalVariables = essentialZone.children.length + fictiveZone.children.length;
    
    if (totalVariables < variablesCount) {
        document.getElementById('result').textContent = 'Распределите все переменные!';
        return;
    }
    
    const userAnswer = new Array(variablesCount).fill(false);
    
    // Проверяем существенные переменные
    Array.from(essentialZone.children).forEach(child => {
        const index = parseInt(child.dataset.index);
        userAnswer[index] = true;
    });
    
    const isCorrect = userAnswer.every((answer, index) => answer === correctAnswer[index]);
    const resultElement = document.getElementById('result');
    
    if (isCorrect) {
        resultElement.textContent = 'Правильно! Все переменные определены верно.';
        resultElement.className = 'result-output correct';
    } else {
        resultElement.textContent = 'Неправильно! Попробуйте еще раз.';
        resultElement.className = 'result-output incorrect';
    }
}

// Добавляем валидацию для поля ввода
document.getElementById('variablesCount').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
    if(parseInt(this.value) > 4) this.value = '4';
    if(parseInt(this.value) < 2) this.value = '2';
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const dropZones = document.querySelectorAll('.variables-drop-zone, #variablesGroup');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });

    // Инициализируем валидацию для поля ввода количества переменных
    initValidation('generate', 
        () => {
            const input = document.getElementById('variablesCount');
            const value = parseInt(input.value);
            return value >= 2 && value <= 4;
        },
        ['#variablesCount']
    );

    // Добавляем обработчики событий
    document.getElementById('generate').addEventListener('click', generateVector);
    document.getElementById('checkAnswer').addEventListener('click', checkAnswer);

    // Устанавливаем начальное значение для количества переменных
    document.getElementById('variablesCount').value = '2';
    generateVector(); // Инициализируем начальное состояние игры
});
