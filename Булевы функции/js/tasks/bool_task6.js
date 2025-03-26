import { initValidation, formatWithSpaces, showToast, hideToast } from '../common.js';

document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generate');
    const checkBtn = document.getElementById('check-btn');
    const functionOutput = document.getElementById('functionVector');
    const nInput = document.getElementById('nInput');
    const dnfInput = document.getElementById('DNF');
    const answerMessage = document.getElementById('answer-message');
    const messageText = document.getElementById('message-text');

    let numVars = 0;
    let functionVector = [];
    let correctDNF = [];

    // Функция для показа сообщения
    function showMessage(isCorrect) {
        answerMessage.querySelectorAll('svg').forEach(icon => icon.style.display = 'none');
        const iconClass = isCorrect ? 'correct-icon' : 'incorrect-icon';
        answerMessage.querySelector(`.${iconClass}`).style.display = 'inline-block';
        answerMessage.className = `answer ${isCorrect ? 'correct' : 'incorrect'} visible`;
        messageText.textContent = isCorrect ? 'Верно!' : 'Неверно!';
    }

    // Блокировка/разблокировка элементов ввода
    function toggleInputState(disabled) {
        nInput.disabled = disabled;
        dnfInput.disabled = disabled;
        checkBtn.disabled = disabled;
        // Добавляем/удаляем класс disabled
        checkBtn.classList.toggle('disabled', disabled);
        dnfInput.style.borderColor = disabled
            ? 'var(--color-green)'
            : 'var(--border-color)';
    }


    // Генерация случайного вектора
    function generateRandomFunction(numVars) {
        const length = 2 ** numVars;
        return Array.from({ length }, () => Math.floor(Math.random() * 2));
    }

    // Преобразование вектора в СДНФ
    function vectorToDNF(functionVector, numVars) {
        const dnf = [];
        // Если все значения 0 - возвращаем пустой массив (константа 0)
        if (!functionVector.includes(1)) return [];

        for (let i = 0; i < functionVector.length; i++) {
            if (functionVector[i] === 1) {
                const conj = [];
                for (let j = 0; j < numVars; j++) {
                    const varVal = (i >> (numVars - 1 - j)) & 1;
                    conj.push([j, !varVal]);
                }
                dnf.push(conj);
            }
        }
        return dnf;
    }

    // Парсинг ДНФ из строки
    function parseDNF(dnfStr, numVars) {
        // Обработка констант 0 и 1
        const cleanStr = dnfStr.trim().toLowerCase();
        if (cleanStr === '0') return [];
        if (cleanStr === '1') return [[]];

        const dnf = [];
        const conjunctions = dnfStr.split('+').map(c => c.trim()).filter(c => c);

        for (const conj of conjunctions) {
            const literals = [];
            const lits = conj.split('*').map(l => l.trim()).filter(l => l);

            for (const lit of lits) {
                let neg = false;
                let varName = lit;

                if (lit.startsWith('!')) {
                    neg = true;
                    varName = lit.slice(1);
                }

                const varNum = parseInt(varName.replace(/x/gi, '')) - 1;
                if (isNaN(varNum) || varNum < 0 || varNum >= numVars) {
                    throw new Error(`Некорректная переменная: ${varName}`);
                }
                literals.push([varNum, neg]);
            }
            dnf.push(literals);
        }
        return dnf;
    }

    // Вычисление значений ДНФ
    function evaluateDNF(dnf, numVars) {
        const results = [];
        const total = 2 ** numVars;

        for (let i = 0; i < total; i++) {
            let result = false;
            const input = Array.from({ length: numVars }, (_, j) => (i >> (numVars - 1 - j)) & 1);

            for (const conj of dnf) {
                let conjResult = true;
                for (const [varIdx, neg] of conj) {
                    const val = input[varIdx];
                    conjResult &= neg ? !val : val;
                    if (!conjResult) break;
                }
                result ||= conjResult;
                if (result) break;
            }
            results.push(result ? 1 : 0);
        }
        return results;
    }

    // Преобразование ДНФ в строку
    function dnfToString(dnf) {
        if (dnf.length === 0) return "0";
        if (dnf[0]?.length === 0) return "1"; // Константа 1
        return dnf.map(conj =>
            conj.map(([v, n]) => `${n ? '!' : ''}x${v + 1}`).join('*')
        ).join(' + ');
    }

    // Генерация новой функции
    function generateNewFunction() {
        numVars = parseInt(nInput.value);
        if (numVars < 1 || numVars > 5) {
            showToast('Количество переменных должно быть от 1 до 5');
            hideToast();
            return;
        }

        functionVector = generateRandomFunction(numVars);
        correctDNF = vectorToDNF(functionVector, numVars);

        const formatted = formatWithSpaces(functionVector.join(''));
        functionOutput.innerHTML = `<span>f = (${formatted})</span>`;
        dnfInput.value = '';
        hideToast();

        toggleInputState(false); // Разблокируем поля
        dnfInput.style.borderColor = 'var(--border-color)'; // Сброс цвета
        answerMessage.className = 'answer hidden'; // Скрываем сообщение
    }

    // Проверка ответа
    function checkAnswer() {
        try {
            const userDNF = parseDNF(dnfInput.value, numVars);
            const computed = evaluateDNF(userDNF, numVars);

            if (computed.join('') === functionVector.join('')) {
                // Сбрасываем стили перед показом
                answerMessage.className = 'answer hidden';
                // Принудительный reflow
                void answerMessage.offsetWidth;

                showMessage(true);
                toggleInputState(true);
                hideToast();
            } else {
                showMessage(false);
                const correct = dnfToString(correctDNF);
                showToast(`Неверно! Правильная ДНФ: ${correct}`);
                // Убрали setTimeout
            }
        } catch (e) {
            showToast(`Ошибка: ${e.message}`);
            // Убрали setTimeout
        }
    }

    // В обработчике ввода ДНФ
    dnfInput.addEventListener('input', () => {
        hideToast(); // Скрываем toast при любом изменении ввода
    });

    // Инициализация валидации
    initValidation('check-btn', () => {
        return nInput.value >= 1 && nInput.value <= 5 &&
            functionVector.length > 0 &&
            dnfInput.value.trim() !== '';
    }, ['#nInput', '#DNF']);

    // Обработчики событий
    generateBtn.addEventListener('click', generateNewFunction);
    checkBtn.addEventListener('click', checkAnswer);

    // Ограничение ввода для n
    nInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-5]/g, '');
        if (this.value > 5) this.value = 5;
        if (this.value < 1) this.value = 1;
    });
});