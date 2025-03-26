import { initValidation, showToast, hideToast } from '../common.js';

// Глобальные переменные для хранения текущего состояния игры
let currentVector = '';
let variablesCount = 0;
let correctAnswer = [];

let emptyVariablesContainer = true;

// Функция для генерации случайного вектора функции
function generateVector() {
    const input = document.getElementById('variablesCount');
    variablesCount = parseInt(input.value);

    if (variablesCount < 2 || variablesCount > 4) {
        showToast('Количество переменных должно быть от 2 до 4!');
        return;
    }

    const vectorLength = Math.pow(2, variablesCount);
    currentVector = Array.from({ length: vectorLength }, () => Math.round(Math.random())).join('');
    correctAnswer = determineEssentialVariables(currentVector, variablesCount);

    displayVector();
    createVariableControls();
    hideToast();
    resetDropZones();
    document.getElementById('checkAnswer').disabled = false;
}

// Функция для проверки заполнения всех переменных
function checkAllVariablesPlaced() {
    const essential = document.querySelectorAll('#essentialVariables .variable-item').length;
    const fictive = document.querySelectorAll('#fictiveVariables .variable-item').length;
    return (essential + fictive) === variablesCount;
}

// Функция для отображения вектора функции
function displayVector() {
    const vectorSpan = document.querySelector('#functionVector span');
    vectorSpan.textContent = `f = (${currentVector.replace(/(.{4})(?!$)/g, '$1 ')})`;
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

    const observer = new MutationObserver(() => {
        const button = document.getElementById('checkAnswer');
        if (button) button.disabled = !(currentVector && checkAllVariablesPlaced());
    });
    observer.observe(document.getElementById('essentialVariables'), { childList: true });
    observer.observe(document.getElementById('fictiveVariables'), { childList: true });
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
        showToast('Сначала сгенерируйте вектор функции!');
        return;
    }

    if (!checkAllVariablesPlaced()) {
        showToast('Распределите все переменные!');
        emptyVariablesContainer = false;
        return;
    }
    else emptyVariablesContainer = true;

    const essentialZone = document.getElementById('essentialVariables');
    const userAnswer = new Array(variablesCount).fill(false);

    Array.from(essentialZone.children).forEach(child => {
        const index = parseInt(child.dataset.index);
        userAnswer[index] = true;
    });

    const isCorrect = userAnswer.every((answer, index) => answer === correctAnswer[index]);

    if (isCorrect) {
        showToast('Правильно! Все переменные определены верно.', false);
        lockDropZones(); // Блокируем зоны
    } else {
        showToast('Неправильно! Попробуйте еще раз.');
    }
}

// Добавляем валидацию для поля ввода
document.getElementById('variablesCount').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (parseInt(this.value) > 4) this.value = '4';
    if (parseInt(this.value) < 2) this.value = '2';
});

// Функция для блокировки зон и изменения стилей
function lockDropZones() {
    const dropZones = document.querySelectorAll('.variables-drop-zone');

    dropZones.forEach(zone => {
        // Добавляем класс с зеленой границей
        zone.classList.add('correct');

        // Отключаем обработчики событий
        zone.removeEventListener('dragover', handleDragOver);
        zone.removeEventListener('dragleave', handleDragLeave);
        zone.removeEventListener('drop', handleDrop);
    });

    // Делаем переменные не перетаскиваемыми
    document.querySelectorAll('.variable-item').forEach(item => {
        item.draggable = false;
        item.classList.add('disabled');
    });
}

// Функция для сброса состояния зон (вызывать при генерации нового вектора)
function resetDropZones() {
    const dropZones = document.querySelectorAll('.variables-drop-zone');

    dropZones.forEach(zone => {
        zone.classList.remove('correct');
        zone.style.border = '2px dashed var(--color-main)';
    });

    // Восстанавливаем обработчики
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });

    document.querySelectorAll('.variable-item').forEach(item => {
        item.draggable = true;
        item.classList.remove('disabled');
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    // Инициализация drag-and-drop
    const dropZones = document.querySelectorAll('.variables-drop-zone, #variablesGroup');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });

    // УСЛАЛ ДЕЛАТЬ ЧТОБЫ РАБОТАЛ ПРАВЛЬНО - ЗАБИЛ, увы
    // Валидация для кнопки генерации
    // initValidation(
    //     'checkAnswer',
    //     () => currentVector && checkAllVariablesPlaced(),
    //     ['.variables-drop-zone', '#variablesCount', '#variablesGroup']
    // );

    document.getElementById('generate').addEventListener('click', generateVector);
    document.getElementById('checkAnswer').addEventListener('click', checkAnswer);

    // Блокировка кнопки проверки при старте
    // document.getElementById('checkAnswer').disabled = true;
});
