import { initValidation, formatWithSpaces, showToast } from '../common.js';

document.getElementById('nInput').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (parseInt(this.value) > 5) this.value = '5';
    if (parseInt(this.value) < 1) this.value = '1';
});

document.addEventListener('DOMContentLoaded', function () {
    function generateRandomFunction(n) {
        const length = Math.pow(2, n);
        return Array.from({ length }, () => Math.floor(Math.random() * 2));
    }

    function checkT0(f) { return f[0] === 0; }
    function checkT1(f) { return f[f.length - 1] === 1; }

    function checkS(f) {
        for (let i = 0; i < f.length; i++) {
            if (f[i] === f[f.length - 1 - i]) return false;
        }
        return true;
    }

    function checkM(f) {
        for (let i = 0; i < f.length; i++) {
            for (let j = i; j < f.length; j++) {
                if ((i & j) === i && f[i] > f[j]) return false;
            }
        }
        return true;
    }

    function checkL(f) {
        const n = Math.log2(f.length);
        if (n % 1 !== 0) return false;

        const anf = [...f];
        for (let i = 0; i < n; i++) {
            const stride = 1 << i;
            for (let j = 0; j < anf.length; j += 2 * stride) {
                for (let k = 0; k < stride; k++) {
                    anf[j + k + stride] ^= anf[j + k];
                }
            }
        }

        const mask = (1 << n) - 1;
        for (let i = 0; i < anf.length; i++) {
            if (countBits(i & mask) > 1 && anf[i]) return false;
        }
        return true;
    }

    function countBits(x) {
        return x.toString(2).replace(/0/g, '').length;
    }

    function arraysEqual(a, b) {
        return a.length === b.length && a.every((v, i) => v === b[i]);
    }

    let currentVector = [];
    const elements = {
        output: document.getElementById('output'),
        generateBtn: document.querySelector('.generate-btn'),
        checkBtn: document.querySelector('.check-btn'),
        answerMessage: document.getElementById('answer-message'),
        correctIcon: document.querySelector('.correct-icon'),
        incorrectIcon: document.querySelector('.incorrect-icon'),
        messageText: document.getElementById('message-text'),
        nInput: document.getElementById('nInput')
    };

    function showAnswerMessage(isCorrect) {
        // Сброс предыдущих состояний
        elements.answerMessage.classList.remove('correct', 'incorrect');
        elements.correctIcon.style.display = 'none';
        elements.incorrectIcon.style.display = 'none';

        // Обновление иконки и текста
        elements.messageText.textContent = isCorrect ? 'Верно!' : 'Неверно!';
        elements.answerMessage.classList.add(isCorrect ? 'correct' : 'incorrect');
        elements.answerMessage.classList.add('visible');

        // Автоматическое скрытие через 2 секунды
        setTimeout(() => {
            elements.answerMessage.classList.remove('visible');
        }, 2000);
    }

    function formatBooleanVector(vector) {
        return formatWithSpaces(vector.join(''));
    }

    // Инициализация валидации кнопки
    initValidation(
        'check-btn',
        () => currentVector.length > 0 &&
            document.querySelectorAll('input[type="checkbox"]:checked').length > 0,
        ['input[type="checkbox"]', '#nInput']
    );

    elements.generateBtn.addEventListener('click', () => {
        const n = Math.max(1, parseInt(elements.nInput.value) || 2);
        currentVector = generateRandomFunction(n);
        elements.output.textContent = `f = (${formatBooleanVector(currentVector)})`;

        // Сброс состояний
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
            cb.disabled = false;
            cb.parentElement.classList.remove('correct');
        });

        elements.answerMessage.classList.add('hidden');
        
    });

    elements.checkBtn.addEventListener('click', () => {
        if (!currentVector.length) {
            showToast('Сначала сгенерируйте вектор функции!', true);
            return;
        }

        const selected = Array.from(document.querySelectorAll('input:checked')).map(cb => cb.value);
        const checkFunctions = { checkT0, checkT1, checkS, checkM, checkL };
        const actual = ['T0', 'T1', 'S', 'M', 'L'].filter(cls => checkFunctions[`check${cls}`](currentVector));

        const correct = arraysEqual(selected.sort(), actual.sort());

        // Показ окна ответа
        showAnswerMessage(correct);

        // Обновление окна ответа
        elements.answerMessage.classList.remove('hidden');
        elements.messageText.textContent = correct ? 'Верно!' : 'Неверно!';
        elements.correctIcon.style.display = correct ? 'block' : 'none';
        elements.incorrectIcon.style.display = correct ? 'none' : 'block';

        if (!correct) {
            showToast(`Правильные классы: ${actual.join(', ')}`, true);
        } else {
            actual.forEach(cls => {
                document.getElementById(cls).parentElement.classList.add('correct');
            });
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.disabled = true);
        }
    });
});