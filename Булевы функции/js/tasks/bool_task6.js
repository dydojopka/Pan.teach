import { initValidation, formatWithSpaces, showToast, hideToast, formulaToMathML } from '../common.js';

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

        // Предварительная обработка скобок
        let processedStr = cleanStr;
        // Удаляем внешние скобки, если они охватывают всё выражение
        if (processedStr.startsWith('(') && processedStr.endsWith(')')) {
            // Проверяем, что это действительно внешние скобки
            let depth = 0;
            let isOuterBrackets = true;
            
            for (let i = 0; i < processedStr.length - 1; i++) {
                if (processedStr[i] === '(') depth++;
                else if (processedStr[i] === ')') depth--;
                
                // Если глубина стала 0 до конца строки, значит это не внешние скобки
                if (depth === 0 && i < processedStr.length - 1) {
                    isOuterBrackets = false;
                    break;
                }
            }
            
            if (isOuterBrackets) {
                processedStr = processedStr.substring(1, processedStr.length - 1).trim();
            }
        }

        const dnf = [];
        const conjunctions = processedStr.split('+').map(c => c.trim()).filter(c => c);

        for (const conj of conjunctions) {
            const literals = [];
            // Обрабатываем скобки внутри конъюнкции
            let processedConj = conj;
            if (processedConj.startsWith('(') && processedConj.endsWith(')')) {
                processedConj = processedConj.substring(1, processedConj.length - 1).trim();
            }
            
            const lits = processedConj.split('*').map(l => l.trim()).filter(l => l);

            for (const lit of lits) {
                let neg = false;
                let varName = lit;

                // Обрабатываем скобки вокруг отрицания
                if (varName.startsWith('(') && varName.endsWith(')')) {
                    varName = varName.substring(1, varName.length - 1).trim();
                }

                if (varName.startsWith('!')) {
                    neg = true;
                    varName = varName.slice(1);
                }

                // Обрабатываем скобки вокруг переменной после отрицания
                if (varName.startsWith('(') && varName.endsWith(')')) {
                    varName = varName.substring(1, varName.length - 1).trim();
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

    // Преобразование ДНФ в строку с использованием MathML
    function dnfToString(dnf) {
        if (dnf.length === 0) return formulaToMathML('0');
        if (dnf[0].length === 0) return formulaToMathML('1');
        // Преобразуем ДНФ в строковый формат
        const formula = dnf.map(term => {
            const literals = term.map(([varIdx, neg]) => 
                `${neg ? '!' : ''}x${varIdx + 1}`
            ).join('*');
            return literals;
        }).join('+');
        
        return formulaToMathML(formula);
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
            // Используем переменную formula вместо dnfInput.value, так как она содержит актуальное значение ввода
            const userDNF = parseDNF(formula, numVars);
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
                showToast(`Неверно!`);
            }
        } catch (e) {
            showToast(`Ошибка: ${e.message}`);
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

    // Логика для клавиатуры
    const keyboardButtons = {
        '(-btn': '(',
        ')-btn': ')',
        'x1-btn': 'x1',
        'x2-btn': 'x2',
        'x3-btn': 'x3',
        'x4-btn': 'x4',
        'x5-btn': 'x5',
        '1-btn': '1',
        '0-btn': '0',
        '¬-btn': '!',
        '∧-btn': '*',
        '∨-btn': '+',
        'backspace-btn': 'backspace',
        'clear-btn': 'clear'
    };

    // Инициализация клавиатуры
    const keyboard = document.querySelector('.keyboard');
    const keyboardOutput = document.getElementById('DNF');
    let formula = '';

    // Функция для преобразования формулы в MathML
    function customFormulaToMathML(formula) {
        if (formula.trim() === '') return '';
        if (formula === '0') return "<math><mn>0</mn></math>";
        if (formula === '1') return "<math><mn>1</mn></math>";
        
        // Заменяем операторы на их MathML представление
        let mathml = "<math>";
        let i = 0;
        
        while (i < formula.length) {
            if (formula[i] === 'x' && i + 1 < formula.length && /[1-5]/.test(formula[i+1])) {
                // Переменная x с индексом
                mathml += `<msub><mi>x</mi><mn>${formula[i+1]}</mn></msub>`;
                i += 2;
            } else if (formula[i] === '!') {
                // Отрицание (следующий символ должен быть x)
                if (i + 1 < formula.length && formula[i+1] === 'x' && i + 2 < formula.length && /[1-5]/.test(formula[i+2])) {
                    mathml += `<mover><msub><mi>x</mi><mn>${formula[i+2]}</mn></msub><mo stretchy="true" style="transform: scale(3, 1.2) translateX(-0.1em) translateY(-0.05em);">‾</mo></mover>`;
                    i += 3;
                } else {
                    mathml += `<mo>¬</mo>`;
                    i++;
                }
            } else if (formula[i] === '*') {
                mathml += `<mo>∧</mo>`;
                i++;
            } else if (formula[i] === '+') {
                mathml += `<mo>∨</mo>`;
                i++;
            } else if (formula[i] === '0' || formula[i] === '1') {
                mathml += `<mn>${formula[i]}</mn>`;
                i++;
            } else {
                // Другие символы
                mathml += `<mo>${formula[i]}</mo>`;
                i++;
            }
        }
        
        mathml += "</math>";
        return mathml;
    }
    
    // Функция для обновления отображения формулы
    function updateFormulaDisplay() {
        if (formula.trim() === '') {
            keyboardOutput.innerHTML = '';
            return;
        }
        
        keyboardOutput.innerHTML = customFormulaToMathML(formula);
    }

    // Обработчик нажатий на кнопки клавиатуры
    Object.keys(keyboardButtons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => {
                const action = keyboardButtons[btnId];
                
                switch (action) {
                    case 'backspace':
                        formula = formula.slice(0, -1);
                        break;
                    case 'clear':
                        formula = '';
                        break;
                    default:
                        formula += action;
                        break;
                }
                
                updateFormulaDisplay();
                // Обновляем значение для проверки валидации
                dnfInput.value = formula;
                // Вызываем событие input для активации валидации
                dnfInput.dispatchEvent(new Event('input'));
            });
        }
    });

    // Ограничение ввода для n и управление состоянием кнопки генерации
    nInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-5]/g, '');
        
        // Управление состоянием кнопки генерации
        const hasValue = this.value.trim() !== '';
        generateBtn.disabled = !hasValue;
        generateBtn.classList.toggle('disabled', !hasValue);
    });
    
    // Инициализация состояния кнопки генерации при загрузке страницы
    generateBtn.disabled = nInput.value.trim() === '';
    generateBtn.classList.toggle('disabled', nInput.value.trim() === '');
});