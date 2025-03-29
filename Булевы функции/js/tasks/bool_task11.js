import { initValidation, formatWithSpaces, showToast } from '../common.js';

const elements = {
    answerMessage: document.getElementById('answer-message'),
    correctIcon: document.querySelector('.correct-icon'),
    incorrectIcon: document.querySelector('.incorrect-icon'),
    messageText: document.getElementById('message-text'),
    checkBtn: document.querySelector('.check-btn')
};

function setupInputRestrictions() {
    const funcInput = document.getElementById('funcCount');
    const varInput = document.getElementById('varCount');

    const validateInput = (input) => {
        if (input.value === '') return;
        input.value = input.value.replace(/[^0-9]/g, '');
        const value = parseInt(input.value);
        if (value < 1) input.value = '1';
        if (value > 5) input.value = '5';
    };

    [funcInput, varInput].forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
            document.querySelector('#generate-btn').dispatchEvent(new Event('input'));
        });

        input.addEventListener('blur', () => {
            if (input.value === '') return;
            validateInput(input);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupInputRestrictions();

    let currentFunctions = [];
    let variablesCount = 0;

    const generateBtn = document.querySelector('.generate-btn');
    const outputGroup = document.querySelector('.output-group');
    const funcInput = document.getElementById('funcCount');
    const varInput = document.getElementById('varCount');

    // Инициализация кнопки генерации
    initValidation('generate-btn',
        () => {
            const funcValue = parseInt(funcInput.value);
            const varValue = parseInt(varInput.value);
            return !isNaN(funcValue) && funcValue >= 1 && funcValue <= 5 &&
                !isNaN(varValue) && varValue >= 1 && varValue <= 5;
        },
        ['#funcCount', '#varCount']
    );

    generateBtn.addEventListener('click', () => {
        const numFunctions = parseInt(funcInput.value) || 0;
        variablesCount = parseInt(varInput.value) || 0;
    
        if (numFunctions < 1 || variablesCount < 1) {
            showToast('Введите корректные значения (1-5)');
            return;
        }
    
        // Сброс состояний
        outputGroup.innerHTML = '';
        currentFunctions = [];
        elements.answerMessage.classList.remove('visible', 'correct', 'incorrect');
        elements.answerMessage.classList.add('hidden');
        
        // Разблокировка и сброс стилей
        document.querySelectorAll('.preferred-classes input, .radio-group input').forEach(el => {
            el.disabled = false;
            el.checked = false;
            el.parentElement.classList.remove('correct', 'incorrect', 'correct-answer');
        });
        
        // Сброс радио-кнопок
        document.getElementById('residual-0').checked = true;
        
        elements.checkBtn.disabled = false;
        elements.checkBtn.classList.remove('disabled');

        // Генерация функций
        for (let i = 0; i < numFunctions; i++) {
            const vector = Array.from({ length: 2 ** variablesCount },
                () => Math.floor(Math.random() * 2));

            const outputDiv = document.createElement('div');
            outputDiv.className = 'function-output';
            outputDiv.innerHTML = `f<sub>${i + 1}</sub> = (${formatWithSpaces(vector.join(''))})`;
            outputGroup.appendChild(outputDiv);
            currentFunctions.push({ vector, variables: variablesCount });
        }
    });

    // Инициализация кнопки проверки
    const checkBtn = document.querySelector('.check-btn');
    initValidation('check-btn',
        () => document.querySelectorAll('.function-output').length > 0,
        ['.output-group']
    );

    checkBtn.addEventListener('click', () => {
        const userComplete = document.getElementById('residual-1').checked;
        const userClasses = Array.from(document.querySelectorAll('.preferred-classes input:checked'))
            .map(c => c.value);

        const systemStatus = checkSystemCompleteness(currentFunctions, variablesCount);
        const isCorrect = validateAnswer(
            systemStatus,
            userComplete,
            userClasses.sort() // Сортировка для единообразия
        );

        showResult(isCorrect, systemStatus, userClasses);
    });

    // Управление видимостью классов
    const updateClassVisibility = () => {
        const isComplete = document.getElementById('residual-1').checked;
        document.querySelector('.preferred-classes').style.display = isComplete ? 'none' : 'grid';
    };
    document.getElementById('residual-0').addEventListener('change', updateClassVisibility);
    document.getElementById('residual-1').addEventListener('change', updateClassVisibility);
    updateClassVisibility();

    // Обработчики для скрытия toast при изменении чекбоксов
    document.querySelectorAll('.preferred-classes input').forEach(cb => {
        cb.addEventListener('change', () => {
            const toast = document.querySelector('.custom-toast');
            if (toast) toast.classList.remove('active');
        });
    });
});

// Проверка классов системы
const checkSystemCompleteness = (functions, varCount) => {
    const checkSome = (checker) => functions.some(checker);

    const classes = {
        T0: checkSome(f => f.vector[0] === 0),
        T1: checkSome(f => f.vector[f.vector.length - 1] === 1),
        S: checkSome(f => isSelfDual(f.vector)),
        M: checkSome(f => isMonotonic(f.vector, f.variables)),
        L: checkSome(f => isLinear(f.vector))
    };

    const activeClasses = Object.entries(classes)
        .filter(([_, v]) => v)
        .map(([k]) => k);

    return {
        isComplete: activeClasses.length === 0, // Система полна, если не принадлежит ни к одному классу
        classes: activeClasses
    };
};

const isSelfDual = (vector) =>
    vector.every((v, i) => v !== vector[vector.length - 1 - i]);

const isMonotonic = (vector, variables) => {
    const size = 2 ** variables;
    for (let i = 0; i < size; i++) {
        for (let j = i; j < size; j++) {
            if ((i & j) === i && vector[i] > vector[j]) return false;
        }
    }
    return true;
};

function isLinear(f) {
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

// const isLinear = (vector, varCount) =>
//     buildZhegalkinCoefficients(vector)
//         .slice(2 ** varCount)
//         .every(v => v === 0);

// const buildZhegalkinCoefficients = (vector) => {
//     const coeffs = [...vector];
//     for (let i = 0; i < vector.length; i++) {
//         const step = 1 << i;
//         for (let j = 0; j < vector.length; j += 2 * step) {
//             for (let k = j; k < j + step; k++) {
//                 if (k + step < vector.length) {
//                     coeffs[k + step] ^= coeffs[k];
//                 }
//             }
//         }
//     }
//     return coeffs;
// };

const arraysEqual = (a, b) =>
    a.length === b.length && a.every((val, idx) => val === b[idx]);

const validateAnswer = ({ isComplete, classes }, userComplete, userClasses) =>
    isComplete === userComplete &&
    (isComplete || arraysEqual(classes.sort(), userClasses.sort())); // Сортировка перед сравнением

const showResult = (isCorrect, { isComplete, classes }, userClasses) => {
    // Сбрасываем стили
    elements.answerMessage.querySelectorAll('svg').forEach(icon => icon.style.display = 'none');
    elements.answerMessage.className = 'answer visible'; // Убедиться, что есть 'visible'
    elements.answerMessage.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Устанавливаем соответствующие иконки
    const icon = isCorrect ? elements.correctIcon : elements.incorrectIcon;
    icon.style.display = 'inline-block'; // Было 'block'

    // Устанавливаем текст сообщения
    elements.messageText.textContent = isCorrect ? 'Верно!' : 'Неверно!';

    // Автоматическое скрытие через 2 секунды (как в bool_task10.js)
    setTimeout(() => {
        elements.answerMessage.classList.remove('visible');
        elements.answerMessage.classList.add('hidden');
    }, 2000);

    // Добавляем классы стилизации
    elements.answerMessage.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Автоматическое скрытие через 2 секунды
    setTimeout(() => {
        elements.answerMessage.className = 'answer hidden';
    }, 2000);

    document.querySelectorAll('.checkbox-wrapper').forEach(wrapper => {
        wrapper.classList.remove('correct', 'incorrect');
    });

    if (isCorrect) {
        // Подсветка верно выбранных чекбоксов
        userClasses.forEach(cls => {
            document.getElementById(cls).parentElement.classList.add('correct');
        });
        
        // Блокируем все элементы управления
        document.querySelectorAll('.preferred-classes input, [name="residual"]').forEach(el => {
            el.disabled = true;
        });
        elements.checkBtn.disabled = true;
        elements.checkBtn.classList.add('disabled');
    } else {
        userClasses.forEach(cls => {
            if (!classes.includes(cls)) {
                document.getElementById(cls).parentElement.classList.add('incorrect');
            }
        });
        classes.forEach(cls => {
            document.getElementById(cls).parentElement.classList.add('correct-answer');
        });
        showToast(`Правильные классы: ${classes.join(', ') || 'отсутствуют'}`, true); // Добавлен вызов
    }

};

document.querySelector('.generate-btn').addEventListener('click', () => {
    const toast = document.querySelector('.custom-toast');
    if (toast) toast.classList.remove('active');
});