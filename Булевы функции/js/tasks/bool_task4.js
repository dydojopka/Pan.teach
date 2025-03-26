import { initValidation } from '../common.js';

document.addEventListener('DOMContentLoaded', function () {
    const booleanFunctions = [
        { name: "Конъюнкция", vector: [0, 0, 0, 1], id: "conjunction" },
        { name: "Дизъюнкция", vector: [0, 1, 1, 1], id: "disjunction" },
        { name: "Сложение", vector: [0, 1, 1, 0], id: "addition" },
        { name: "Штрих Шеффера", vector: [1, 1, 1, 0], id: "sheffer" },
        { name: "Стрелка Пирса", vector: [1, 0, 0, 0], id: "peirce" },
        { name: "Импликация", vector: [1, 1, 0, 1], id: "implication" },
        { name: "Эквивалентность", vector: [1, 0, 0, 1], id: "equivalence" },
        { name: "Компликация", vector: [0, 0, 1, 0], id: "complication" },
        { name: "Обратная импликация", vector: [1, 0, 1, 1], id: "reverse-implication" },
        { name: "Обратная коипликация", vector: [0, 1, 0, 0], id: "reverse-complication" },
        { name: "Функция 0", vector: [0, 0, 0, 0], id: "zero" },
        { name: "Функция переменная x2", vector: [0, 1, 0, 1], id: "x2" },
        { name: "Функция переменная x1", vector: [0, 0, 1, 1], id: "x1" },
        { name: "Функция отрицания x2 (¬x2)", vector: [1, 0, 1, 0], id: "not-x2" },
        { name: "Функция отрицания x1 (¬x1)", vector: [1, 1, 0, 0], id: "not-x1" },
        { name: "Функция 1", vector: [1, 1, 1, 1], id: "one" },
    ];

    let correctFunction;
    let selectedFunction = null;
    const answerMessage = document.getElementById('answer-message');
    const messageText = document.getElementById('message-text');
    const newVectorButton = document.getElementById('new-vector-btn');
    const checkButton = document.getElementById('check-answer-btn');

    function showMessage(isCorrect) {
        answerMessage.querySelectorAll('svg').forEach(icon => icon.style.display = 'none');
        const iconClass = isCorrect ? 'correct-icon' : 'incorrect-icon';
        answerMessage.querySelector(`.${iconClass}`).style.display = 'inline-block';
        answerMessage.className = `answer ${isCorrect ? 'correct' : 'incorrect'} visible`;
        messageText.textContent = isCorrect ? 'Верно!' : 'Неверно!';

        setTimeout(() => {
            answerMessage.className = 'answer hidden';
        }, 2000);
    }

    function toggleRadioState(disabled) {
        document.querySelectorAll('.radio-option input').forEach(radio => {
            radio.disabled = disabled;
        });
    }

    initValidation(
        'check-answer-btn',
        () => selectedFunction !== null,
        ['input[name="boolean-function"]']
    );

    function generateRandomFunction() {
        return booleanFunctions[Math.floor(Math.random() * booleanFunctions.length)];
    }

    function startGame() {
        correctFunction = generateRandomFunction();
        selectedFunction = null;

        // Сбрасываем все стили ответов
        document.querySelectorAll('.radio-option label').forEach(label => {
            label.classList.remove('correct', 'incorrect', 'correct-answer');
            label.style.removeProperty('border-color');
            label.style.removeProperty('box-shadow');
        });

        document.getElementById('output').textContent = `f = (${correctFunction.vector.join('')})`;
        document.querySelectorAll('input[name="boolean-function"]').forEach(radio => {
            radio.checked = false;
            radio.disabled = false;
        });
        const checkButton = document.getElementById('check-answer-btn');
        if (checkButton.updateState) checkButton.updateState();
    }

    document.querySelectorAll('input[name="boolean-function"]').forEach(radio => {
        radio.addEventListener('change', function () {
            selectedFunction = booleanFunctions.find(f => f.id === this.value);
            // Принудительно обновляем состояние кнопки
            initValidation(
                'check-answer-btn',
                () => selectedFunction !== null,
                ['input[name="boolean-function"]']
            );
        });
    });

    checkButton.addEventListener('click', () => {
        if (!selectedFunction || checkButton.disabled) return;

        const isCorrect = selectedFunction.name === correctFunction.name;
        showMessage(isCorrect);

        // Подсветка всех ответов
        document.querySelectorAll('.radio-option label').forEach(label => {
            label.classList.remove('correct', 'incorrect', 'correct-answer');
        });

        // Подсветка выбранного ответа
        const selectedLabel = document.querySelector(`label[for="${selectedFunction.id}"]`);
        if (selectedLabel) {
            selectedLabel.classList.add(isCorrect ? 'correct' : 'incorrect');
        }

        // Подсветка правильного ответа (если он не был выбран)
        if (!isCorrect) {
            const correctLabel = document.querySelector(`label[for="${correctFunction.id}"]`);
            if (correctLabel) {
                correctLabel.classList.add('correct-answer');
            }
        }

        toggleRadioState(true);
        checkButton.disabled = true;
        checkButton.classList.add('disabled');
    });

    newVectorButton.addEventListener('click', startGame);
    startGame();
});