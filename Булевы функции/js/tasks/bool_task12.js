import { formatWithSpaces, showToast, hideToast, formulaToMathML, initValidation } from '../common.js';

function getMinimalDNF(vector) {
    const n = Math.log2(vector.length);

    // Проверка на степень двойки
    if (!Number.isInteger(n)) {
        throw new Error('Некорректная длина вектора');
    }

    function toBin(num) {
        return num.toString(2).padStart(n, '0');
    }

    const minterms = [];
    for (let i = 0; i < vector.length; i++) {
        if (vector[i] === 1) minterms.push(i);
    }

    function combinePatterns(p1, p2) {
        let diff = 0, res = '';
        for (let i = 0; i < p1.length; i++) {
            if (p1[i] !== p2[i]) {
                diff++;
                res += '-';
            } else {
                res += p1[i];
            }
            if (diff > 1) return null;
        }
        return res;
    }

    let groups = minterms.map(m => ({ term: toBin(m), covered: new Set([m]), used: false }));

    function combine(groups) {
        const newGroups = [];
        for (let i = 0; i < groups.length; i++) {
            for (let j = i + 1; j < groups.length; j++) {
                const combined = combinePatterns(groups[i].term, groups[j].term);
                if (combined !== null) {
                    groups[i].used = groups[j].used = true;
                    let exists = newGroups.find(g => g.term === combined);
                    if (!exists) {
                        exists = { term: combined, covered: new Set([...groups[i].covered, ...groups[j].covered]), used: false };
                        newGroups.push(exists);
                    } else {
                        for (const x of groups[i].covered) exists.covered.add(x);
                        for (const x of groups[j].covered) exists.covered.add(x);
                    }
                }
            }
        }
        return newGroups;
    }

    let allImplicants = [];
    while (groups.length) {
        for (const g of groups) {
            if (!g.used && !allImplicants.find(imp => imp.term === g.term)) {
                allImplicants.push(g);
            }
        }
        groups = combine(groups);
    }

    function covers(implicant, m) {
        const bin = toBin(m);
        for (let i = 0; i < implicant.term.length; i++) {
            if (implicant.term[i] !== '-' && implicant.term[i] !== bin[i]) return false;
        }
        return true;
    }

    const chart = new Map();
    for (const m of minterms) {
        chart.set(m, []);
        for (const imp of allImplicants) {
            if (covers(imp, m)) chart.get(m).push(imp);
        }
    }

    const essential = new Set();
    const coveredMinterms = new Set();
    for (const [m, imps] of chart.entries()) {
        if (imps.length === 1) essential.add(imps[0]);
    }
    for (const imp of essential) {
        for (const m of imp.covered) coveredMinterms.add(m);
    }

    const remainingMinterms = minterms.filter(m => !coveredMinterms.has(m));
    let additional = new Set();
    if (remainingMinterms.length) {
        const candidates = allImplicants.filter(imp => !essential.has(imp));
        let bestCover = null;
        const total = candidates.length, totalComb = 1 << total;
        for (let mask = 1; mask < totalComb; mask++) {
            const selected = [];
            for (let i = 0; i < total; i++) {
                if (mask & (1 << i)) selected.push(candidates[i]);
            }
            const coverSet = new Set();
            for (const imp of selected) {
                for (const m of imp.covered) coverSet.add(m);
            }
            if (remainingMinterms.every(m => coverSet.has(m))) {
                if (bestCover === null || selected.length < bestCover.length) bestCover = selected;
            }
        }
        if (bestCover) bestCover.forEach(imp => additional.add(imp));
    }

    const finalImplicants = [...essential, ...additional];

    function implicantToString(implicant) {
        return [...implicant]
            .map((c, i) => {
                if (c === '-') return '';
                return c === '1' ? `x${i + 1}` : `!x${i + 1}`;
            })
            .filter(Boolean)
            .join('*') || '1';
    }

    return finalImplicants.map(imp => implicantToString(imp.term)).join(' + ');
}

document.addEventListener('DOMContentLoaded', function () {
    const buildButton = document.getElementById('buildButton');
    const vectorInput = document.getElementById('vectorInput');
    const errorDiv = document.getElementById('error');
    const sdnfFormula = document.getElementById('sdnfFormula');

    // Автоматическое форматирование ввода с пробелами
    vectorInput.addEventListener('input', function (e) {
        const rawValue = e.target.value.replace(/ /g, '');
        e.target.value = formatWithSpaces(rawValue);
    });

    // Валидация в реальном времени для кнопки
    initValidation(
        'buildButton',
        () => {
            const input = vectorInput.value.replace(/ /g, '');
            return (
                input.length > 0 &&
                /^[01]+$/.test(input) &&
                (input.length & (input.length - 1)) === 0 &&
                input.length <= 8 // Добавлено ограничение длины
            );
        },
        ['#vectorInput']
    );

    vectorInput.addEventListener('input', function () {
        const input = vectorInput.value.replace(/ /g, '');

        if (input.length > 8) {
            showToast('Максимальная длина вектора — 8 бит');
            buildButton.disabled = true;
            buildButton.classList.add('disabled');
        } else {
            hideToast();
            // Обновляем состояние кнопки через существующую валидацию
            initValidation(
                'buildButton',
                () => {
                    return (
                        input.length > 0 &&
                        /^[01]+$/.test(input) &&
                        (input.length & (input.length - 1)) === 0 &&
                        input.length <= 8 // Добавляем проверку длины
                    );
                },
                ['#vectorInput']
            );
        }
    });

    buildButton.addEventListener('click', function () {
        errorDiv.style.display = 'none';
        const input = vectorInput.value.replace(/ /g, '').trim();

        // Валидация
        if (!input) {
            showToast('Введите вектор функции');
            return;
        }
        if (!/^[01]+$/.test(input)) {
            showToast('Вектор должен содержать только 0 и 1');
            return;
        }
        if ((input.length & (input.length - 1)) !== 0) {
            showToast('Длина должна быть степенью двойки');
            return;
        }
        if (input.length > 8) {
            showToast('Максимальная длина вектора — 8 бит');
            return;
        }

        try {
            // Добавленный код: преобразование в вектор и получение DNF
            const vector = input.split('').map(Number);
            const dnf = getMinimalDNF(vector);

            let mathML = formulaToMathML(dnf);
            mathML = mathML.replace(/<mo>\∧<\/mo>/g, '');
            // mathML = mathML.replace(/<mo>\(<\/mo>/g, '');
            // mathML = mathML.replace(/<mo>\)<\/mo>/g, '');
            sdnfFormula.innerHTML = mathML;
        } catch (e) {
            showToast(e.message);
        }
    });

    // Обработчик Enter
    vectorInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') buildButton.click();
    });
});