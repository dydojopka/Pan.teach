class Graph {
    constructor(size) {
        this.size = size;
        this.adjMatrix = Array(size).fill().map(() => Array(size).fill(0));
        this.canvas = null;
        this.ctx = null;
        this.nodes = [];
        this.initializeNodes();
    }
    
    setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.calculateNodePositions();
    }
    
    initializeNodes() {
        for (let i = 0; i < this.size; i++) {
            this.nodes.push({
                x: 0,
                y: 0,
                color: '#3b82f6'
            });
        }
    }
    
    calculateNodePositions() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        
        for (let i = 0; i < this.size; i++) {
            const angle = (i * 2 * Math.PI / this.size) - Math.PI/2;
            this.nodes[i].x = centerX + radius * Math.cos(angle);
            this.nodes[i].y = centerY + radius * Math.sin(angle);
        }
    }
    
    loadFromAdjacencyMatrix(matrix) {
        this.adjMatrix = matrix;
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw edges first
        for (let i = 0; i < this.size; i++) {
            for (let j = i+1; j < this.size; j++) {
                if (this.adjMatrix[i][j] === 1) {
                    this.drawEdge(i, j);
                }
            }
        }
        
        // Then draw nodes
        for (let i = 0; i < this.size; i++) {
            this.drawNode(i, this.nodes[i].color);
        }
    }
    
    drawEdge(from, to) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.nodes[from].x, this.nodes[from].y);
        this.ctx.lineTo(this.nodes[to].x, this.nodes[to].y);
        this.ctx.strokeStyle = '#94a3b8';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawNode(index, color) {
        this.nodes[index].color = color;
        
        this.ctx.beginPath();
        this.ctx.arc(this.nodes[index].x, this.nodes[index].y, 20, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw node number
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillText(index + 1, this.nodes[index].x, this.nodes[index].y);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Элементы управления
    const matrixSizeInput = document.getElementById('matrix-size');
    const generateMatrixBtn = document.getElementById('generate-matrix');
    const resetMatrixBtn = document.getElementById('reset-matrix');
    const loadExampleBtn = document.getElementById('load-example');
    const colorGraphBtn = document.getElementById('color-graph');
    const matrixContainer = document.getElementById('matrix-container');
    const resultsContainer = document.getElementById('results-container');
    const graphCanvas = document.getElementById('graph-canvas');

    // Элементы раскраски
    const startColoringBtn = document.getElementById('start-coloring');
    const stepColoringBtn = document.getElementById('step-coloring');
    const restartColoringBtn = document.getElementById('restart-coloring');
    const animationSpeedInput = document.getElementById('animation-speed');
    const currentStepEl = document.getElementById('current-step');
    const currentVertexEl = document.getElementById('current-vertex');
    const currentColorEl = document.getElementById('current-color');

    // Состояние
    let graph = null;
    let matrixSize = 5;
    let matrixData = [];
    let coloringInterval = null;
    let animationSpeed = 5;
    let coloringState = {
        colors: [],
        currentVertex: null,
        step: 0,
        isRunning: false,
        complete: false
    };

    // Палитра цветов
    const colorPalette = [
        { name: 'Красный', hex: '#ef4444' },
        { name: 'Синий', hex: '#3b82f6' },
        { name: 'Зелёный', hex: '#10b981' },
        { name: 'Жёлтый', hex: '#eab308' },
        { name: 'Фиолетовый', hex: '#8b5cf6' },
        { name: 'Оранжевый', hex: '#f97316' },
        { name: 'Розовый', hex: '#ec4899' },
        { name: 'Голубой', hex: '#06b6d4' }
    ];

    // Инициализация графа
    function initGraph() {
        graph = new Graph(matrixSize);
        graph.setCanvas(graphCanvas);
    }

    // Создание матрицы смежности
    function createMatrixInput() {
        matrixContainer.innerHTML = '';
        matrixData = [];
        
        const table = document.createElement('table');
        table.className = 'matrix-table';
        
        // Заголовок
        const headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('th'));
        
        for (let i = 0; i < matrixSize; i++) {
            const th = document.createElement('th');
            th.textContent = i + 1;
            headerRow.appendChild(th);
        }
        
        table.appendChild(headerRow);
        
        // Строки матрицы
        for (let i = 0; i < matrixSize; i++) {
            const row = document.createElement('tr');
            const th = document.createElement('th');
            th.textContent = i + 1;
            row.appendChild(th);
            
            for (let j = 0; j < matrixSize; j++) {
                const td = document.createElement('td');
                const input = document.createElement('button');
                input.className = 'matrix-cell';
                input.textContent = '0';
                input.dataset.row = i;
                input.dataset.col = j;
                
                input.addEventListener('click', function() {
                    const r = parseInt(this.dataset.row);
                    const c = parseInt(this.dataset.col);
                    
                    if (matrixData[r][c] === 0) {
                        matrixData[r][c] = 1;
                        matrixData[c][r] = 1;
                        this.textContent = '1';
                        this.classList.add('active');
                        
                        if (r !== c) {
                            const symmetricCell = document.querySelector(`.matrix-cell[data-row="${c}"][data-col="${r}"]`);
                            if (symmetricCell) {
                                symmetricCell.textContent = '1';
                                symmetricCell.classList.add('active');
                            }
                        }
                    } else {
                        matrixData[r][c] = 0;
                        matrixData[c][r] = 0;
                        this.textContent = '0';
                        this.classList.remove('active');
                        
                        if (r !== c) {
                            const symmetricCell = document.querySelector(`.matrix-cell[data-row="${c}"][data-col="${r}"]`);
                            if (symmetricCell) {
                                symmetricCell.textContent = '0';
                                symmetricCell.classList.remove('active');
                            }
                        }
                    }
                });
                
                td.appendChild(input);
                row.appendChild(td);
            }
            
            table.appendChild(row);
        }
        
        matrixContainer.appendChild(table);
        matrixData = Array(matrixSize).fill().map(() => Array(matrixSize).fill(0));
        
        resetMatrixBtn.disabled = false;
        colorGraphBtn.disabled = false;
    }

    // Загрузка примера
    function loadExample() {
        matrixSize = 5;
        matrixSizeInput.value = matrixSize;
        createMatrixInput();
        
        const exampleEdges = [
            [0, 1], [0, 2], [1, 2], [1, 3],
            [2, 3], [3, 4]
        ];
        
        for (const [i, j] of exampleEdges) {
            matrixData[i][j] = 1;
            matrixData[j][i] = 1;
            
            const cell = document.querySelector(`.matrix-cell[data-row="${i}"][data-col="${j}"]`);
            if (cell) {
                cell.textContent = '1';
                cell.classList.add('active');
            }
            
            const symmetricCell = document.querySelector(`.matrix-cell[data-row="${j}"][data-col="${i}"]`);
            if (symmetricCell) {
                symmetricCell.textContent = '1';
                symmetricCell.classList.add('active');
            }
        }
    }

    // Сброс матрицы
    function resetMatrix() {
        matrixContainer.innerHTML = '';
        matrixData = [];
        createMatrixInput();
    }

    // Раскраска графа
    function colorGraph() {
        initGraph();
        graph.loadFromAdjacencyMatrix(matrixData);
        resultsContainer.classList.remove('hidden');
        resetColoringState();
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Сброс состояния раскраски
    function resetColoringState() {
        clearInterval(coloringInterval);
        
        coloringState = {
            colors: Array(matrixSize).fill(-1),
            currentVertex: 0,
            step: 0,
            isRunning: false,
            complete: false
        };
        
        currentStepEl.textContent = '0';
        currentVertexEl.textContent = '-';
        currentColorEl.textContent = '-';
        startColoringBtn.textContent = 'Начать';
        
        drawColoringState();
    }

    // Отрисовка состояния
    function drawColoringState() {
        graph.draw();
        const ctx = graph.ctx;
        
        for (let i = 0; i < matrixSize; i++) {
            let nodeColor = '#3b82f6'; // Синий по умолчанию
            
            if (i === coloringState.currentVertex) {
                nodeColor = '#f97316'; // Оранжевый для текущей
            } else if (coloringState.colors[i] !== -1) {
                nodeColor = colorPalette[coloringState.colors[i]].hex;
            }
            
            graph.drawNode(i, nodeColor);
        }
    }

    // Поиск доступного цвета
    function findAvailableColor(vertex) {
        const used = new Set();
        
        for (let i = 0; i < matrixSize; i++) {
            if (matrixData[vertex][i] === 1 && coloringState.colors[i] !== -1) {
                used.add(coloringState.colors[i]);
            }
        }
        
        for (let color = 0; color < colorPalette.length; color++) {
            if (!used.has(color)) {
                return color;
            }
        }
        
        return -1;
    }

    // Шаг раскраски
    function stepColoring() {
        if (coloringState.complete) return false;
        
        coloringState.step++;
        currentStepEl.textContent = coloringState.step;
        
        if (coloringState.currentVertex < matrixSize) {
            currentVertexEl.textContent = coloringState.currentVertex + 1;
            
            const color = findAvailableColor(coloringState.currentVertex);
            coloringState.colors[coloringState.currentVertex] = color;
            currentColorEl.textContent = colorPalette[color].name;
            
            coloringState.currentVertex++;
        }
        
        if (coloringState.currentVertex === matrixSize) {
            coloringState.complete = true;
            currentVertexEl.textContent = 'Готово';
            currentColorEl.textContent = '-';
        }
        
        drawColoringState();
        return !coloringState.complete;
    }

    // Автоматическая раскраска
    function startColoring() {
        if (coloringState.isRunning) {
            stopColoring();
            return;
        }
        
        if (coloringState.complete) {
            resetColoringState();
        }
        
        coloringState.isRunning = true;
        startColoringBtn.textContent = 'Пауза';
        
        const interval = 1100 - (animationSpeed * 100);
        
        coloringInterval = setInterval(() => {
            if (!stepColoring()) {
                stopColoring();
            }
        }, interval);
    }

    // Остановка раскраски
    function stopColoring() {
        clearInterval(coloringInterval);
        coloringState.isRunning = false;
        startColoringBtn.textContent = 'Продолжить';
    }

    // Обработчики событий
    generateMatrixBtn.addEventListener('click', function() {
        matrixSize = parseInt(matrixSizeInput.value);
        createMatrixInput();
    });
    
    resetMatrixBtn.addEventListener('click', resetMatrix);
    loadExampleBtn.addEventListener('click', loadExample);
    colorGraphBtn.addEventListener('click', colorGraph);
    
    startColoringBtn.addEventListener('click', startColoring);
    stepColoringBtn.addEventListener('click', function() {
        stopColoring();
        stepColoring();
    });
    restartColoringBtn.addEventListener('click', resetColoringState);
    
    animationSpeedInput.addEventListener('input', function() {
        animationSpeed = parseInt(this.value);
        if (coloringState.isRunning) {
            stopColoring();
            startColoring();
        }
    });
    
    // Инициализация
    matrixSize = parseInt(matrixSizeInput.value);
    initGraph();
});