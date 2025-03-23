document.getElementById('nInput').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
    if(parseInt(this.value) > 5) this.value = '5';
    if(parseInt(this.value) < 1) this.value = '1';
});

document.addEventListener('DOMContentLoaded', function() {
    function generateRandomFunction(n) {
        const length = Math.pow(2, n);
        return Array.from({length}, () => Math.floor(Math.random() * 2));
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
        resultText: document.getElementById('result'),
        nInput: document.getElementById('nInput')
    };

    function formatBooleanVector(vector) {
        return vector.join('').replace(/(.{4})(?!$)/g, '$1 ');
    }

    elements.generateBtn.addEventListener('click', () => {
        const n = Math.max(1, parseInt(elements.nInput.value) || 2);
        currentVector = generateRandomFunction(n);
        elements.output.textContent = `f = (${formatBooleanVector(currentVector)})`;
        elements.resultText.textContent = '';
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    });

    elements.checkBtn.addEventListener('click', () => {
        if (!currentVector.length) {
            elements.resultText.textContent = 'Сгенерируйте вектор функции!';
            return;
        }

        const selected = Array.from(document.querySelectorAll('input:checked')).map(cb => cb.value);
        const checkFunctions = {
            checkT0,
            checkT1,
            checkS,
            checkM,
            checkL
        };
        const actual = ['T0', 'T1', 'S', 'M', 'L'].filter(cls => checkFunctions[`check${cls}`](currentVector));
        
        const correct = arraysEqual(selected.sort(), actual.sort());
        elements.resultText.textContent = `${correct ? '✓' : '✗'} Правильные классы: ${actual.join(', ')}`;
        elements.resultText.style.color = correct ? '#2ecc71' : '#e74c3c';
    });
});