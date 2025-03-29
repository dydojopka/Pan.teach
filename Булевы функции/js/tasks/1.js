/**
 * Функция для вычисления минимальной ДНФ по вектору истинности.
 * @param {number[]} vector - Массив 0 и 1, представляющий вектор функции.
 * @returns {string} Минимальная ДНФ в виде строки.
 */
function getMinimalDNF(vector) {
    const n = Math.log2(vector.length);
    if (!Number.isInteger(n)) {
        throw new Error('Длина вектора должна быть степенью двойки');
    }

    // Генерируем список минтермов (индексы, где значение равно 1)
    const minterms = [];
    for (let i = 0; i < vector.length; i++) {
        if (vector[i] === 1) {
            // Представляем индекс в виде n-битной двоичной строки
            minterms.push(i);
        }
    }
    if (minterms.length === 0) return '0'; // Функция всегда ложна
    if (minterms.length === vector.length) return '1'; // Функция всегда истинна

    // Преобразуем число в строку с ведущими нулями
    function toBin(num) {
        return num.toString(2).padStart(n, '0');
    }

    // Объединение двух шаблонов (например, '01-1' и '0111')
    function combinePatterns(p1, p2) {
        let diff = 0;
        let res = '';
        for (let i = 0; i < p1.length; i++) {
            if (p1[i] !== p2[i]) {
                diff++;
                res += '-';
            } else {
                res += p1[i];
            }
            if (diff > 1) return null;
        }
        return diff === 1 ? res : null;
    }

    // Начальная группа импликант: объект { term: строка, covered: Set чисел }
    let groups = [];
    for (const m of minterms) {
        groups.push({ term: toBin(m), covered: new Set([m]), used: false });
    }

    // Функция объединения групп
    function combine(groups) {
        const newGroups = [];
        const usedMap = new Set();
        for (let i = 0; i < groups.length; i++) {
            for (let j = i + 1; j < groups.length; j++) {
                const combined = combinePatterns(groups[i].term, groups[j].term);
                if (combined !== null) {
                    groups[i].used = true;
                    groups[j].used = true;
                    // Проверяем, чтобы не добавить дубликат
                    let exists = newGroups.find(g => g.term === combined);
                    if (!exists) {
                        exists = {
                            term: combined,
                            covered: new Set([...groups[i].covered, ...groups[j].covered]),
                            used: false
                        };
                        newGroups.push(exists);
                    } else {
                        // Объединяем покрытие
                        for (const x of groups[i].covered) exists.covered.add(x);
                        for (const x of groups[j].covered) exists.covered.add(x);
                    }
                }
            }
        }
        return newGroups;
    }

    // Построение списка простых импликант (prime implicants)
    let allImplicants = [];
    while (groups.length > 0) {
        // Сохраняем неиспользованные – они являются простыми импликантами
        for (const g of groups) {
            if (!g.used) {
                // Избегаем дублирования
                if (!allImplicants.find(imp => imp.term === g.term)) {
                    allImplicants.push(g);
                }
            }
        }
        const nextGroups = combine(groups);
        groups = nextGroups;
    }

    // Функция, проверяющая покрывает ли импликанта минтерм
    function covers(implicant, m) {
        const bin = toBin(m);
        for (let i = 0; i < implicant.term.length; i++) {
            if (implicant.term[i] !== '-' && implicant.term[i] !== bin[i]) {
                return false;
            }
        }
        return true;
    }

    // Построение таблицы покрытия: для каждого минтерма – список покрывающих его импликант
    const chart = new Map();
    for (const m of minterms) {
        chart.set(m, []);
        for (const imp of allImplicants) {
            if (covers(imp, m)) {
                chart.get(m).push(imp);
            }
        }
    }

    // Выделение существенных импликант
    const essential = new Set();
    const coveredMinterms = new Set();
    for (const [m, imps] of chart.entries()) {
        if (imps.length === 1) {
            const imp = imps[0];
            essential.add(imp);
        }
    }
    // Покрываем минтермы, которые покрываются существенными импликантами
    for (const imp of essential) {
        for (const m of imp.covered) {
            coveredMinterms.add(m);
        }
    }


    // Для оставшихся минтермов выбираем набор импликант минимально (брутфорс для небольших N)
    const remainingMinterms = minterms.filter(m => !coveredMinterms.has(m));
    let additional = new Set();
    if (remainingMinterms.length > 0) {
        // Получим список всех импликант, кроме уже выбранных существенных
        const candidates = allImplicants.filter(imp => !essential.has(imp));
        // Перебор всех комбинаций кандидатов
        let bestCover = null;
        const total = candidates.length;
        const totalComb = 1 << total;
        for (let mask = 1; mask < totalComb; mask++) {
            const selected = [];
            for (let i = 0; i < total; i++) {
                if (mask & (1 << i)) selected.push(candidates[i]);
            }
            const coverSet = new Set();
            for (const imp of selected) {
                for (const m of imp.covered) coverSet.add(m);
            }
            let ok = true;
            for (const m of remainingMinterms) {
                if (!coverSet.has(m)) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                // Выбираем решение с минимальным числом импликант (и/или с минимальным общим числом «термов»)
                if (bestCover === null || selected.length < bestCover.length) {
                    bestCover = selected;
                }
            }
        }
        if (bestCover) {
            for (const imp of bestCover) {
                additional.add(imp);
            }
        }
    }

    // Объединяем все выбранные импликанты
    const finalImplicants = [...essential, ...additional];

    // Преобразование шаблона в литералы переменных
    function implicantToString(implicant) {
        const parts = [];
        for (let i = 0; i < implicant.length; i++) {
            if (implicant[i] === '-') continue;
            // Назовём переменные через a, b, c,... Если переменных больше 26, можно использовать x0, x1...
            let varName = String.fromCharCode(97 + i); // 97 = 'a'
            if (n > 26) {
                varName = 'x' + i;
            }
            parts.push(implicant[i] === '1' ? varName : '¬' + varName);
        }
        return parts.join('∧') || '1';
    }

    // Формируем строку минимальной ДНФ
    const terms = finalImplicants.map(imp => implicantToString(imp.term));
    return terms.join(' ∨ ');
}

// Пример использования:
const vector = [
    0, 1, 1, 1,
    1, 1, 0, 0
]; // пример для функции с 3 переменными (8 значений) – здесь вектор имеет длину 8, измените при необходимости

console.log(getMinimalDNF(vector));
