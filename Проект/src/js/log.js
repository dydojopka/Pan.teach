// menu
document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("main-menu");
    const play = document.getElementById("play");
    const settings = document.getElementById("settings");
    const about = document.getElementById("about-game");

    const playButton = document.getElementById("play-button");
    const settingsButton = document.getElementById("settings-button");
    const aboutButton = document.getElementById("about-game-button");

    const menuPlayButton = document.getElementById("to-menu-play");
    const menuSettingsButton = document.getElementById("to-menu-settings");
    const menuAboutButton = document.getElementById("to-menu-about");

    let game=  null;

    playButton.addEventListener("click", function () {
        menu.classList.remove('active');
        setTimeout(() => {
            menu.style.display = 'none';
            play.style.display = 'flex';
            setTimeout(() => {
                play.classList.add('active');
            }, 10);
        }, 50);
        game = new GameField();
    });

    document.querySelector("#play .best-score span").textContent = localStorage.getItem("best-score") || 0;

    settingsButton.addEventListener("click", function () {
        menu.classList.remove('active');
        setTimeout(() => {
            menu.style.display = 'none';
            settings.style.display = 'flex';
            setTimeout(() => {
                settings.classList.add('active');
            }, 10);
        }, 50);
    });

    aboutButton.addEventListener("click", function () {
        menu.classList.remove('active');
        setTimeout(() => {
            menu.style.display = 'none';
            about.style.display = 'flex';
            setTimeout(() => {
                about.classList.add('active');
            }, 10);
        }, 50);
    });

    menuPlayButton.addEventListener("click", function () {
        game.stopGame();
        play.classList.remove('active');
        setTimeout(() => {
            play.style.display = 'none';
            menu.style.display = 'flex';
            document.querySelector("#box-opponent").innerHTML = '';
            document.querySelector("#box-snake").innerHTML = '';
            document.querySelector("#box-apple").innerHTML = '';
            if (document.querySelector(".field p"))
                document.querySelector(".field p").remove();
            if (document.querySelector(".field .pause + p"))
                document.querySelector(".field .pause + p").remove();
            if (document.querySelector(".field .pause"))
                document.querySelector(".field .pause").remove();
            document.querySelector("#play .play-data .score span").textContent = '0';
            document.querySelector("#play .play-data .time span").textContent = '0c';
            setTimeout(() => {
                menu.classList.add('active');
            }, 10);
        }, 50);
    });

    menuSettingsButton.addEventListener("click", function () {
        settings.classList.remove('active');
        setTimeout(() => {
            settings.style.display = 'none';
            menu.style.display = 'flex';
            setTimeout(() => {
                menu.classList.add('active');
            }, 10);
        }, 50);
    });

    menuAboutButton.addEventListener("click", function () {
        about.classList.remove('active');
        setTimeout(() => {
            about.style.display = 'none';
            menu.style.display = 'flex';
            setTimeout(() => {
                menu.classList.add('active');
            }, 10);
        }, 50);
    });

    if (localStorage.getItem("apples-count") == null)
        localStorage.setItem("apples-count", "2");
    if (localStorage.getItem("has-opponent") == null)
        localStorage.setItem("has-opponent", "false");
    if (localStorage.getItem("is-growing") == null)
        localStorage.setItem("is-growing", "false");
    if (localStorage.getItem("is-limitless") == null)
        localStorage.setItem("is-limitless", "false");

    let apples = parseInt(localStorage.getItem("apples-count"));
    document.querySelector(".apples span").textContent = apples;

    document.getElementById("minus-apple").addEventListener('click', function () {
        if (apples === 1)
            return;
        apples--;
        document.querySelector(".apples span").textContent = apples;
        localStorage.setItem("apples-count", apples);
    });

    document.getElementById("plus-apple").addEventListener('click', function () {
        if (apples === 10)
            return;
        apples++;
        document.querySelector(".apples span").textContent = apples;
        localStorage.setItem("apples-count", apples);
    });

    let hasOpponent = localStorage.getItem("has-opponent") === "true";
    document.getElementById("has-opponent").checked = hasOpponent;

    document.getElementById("has-opponent").addEventListener('change', function () {
        hasOpponent = !hasOpponent;
        localStorage.setItem("has-opponent", hasOpponent);
    });

    let isGrowing = localStorage.getItem("is-growing") === "true";
    document.getElementById("is-growing").checked = isGrowing;

    document.getElementById("is-growing").addEventListener('change', function () {
        isGrowing = !isGrowing;
        localStorage.setItem("is-growing", isGrowing);
    });

    let isLimitless = localStorage.getItem("is-limitless") === "true";
    document.getElementById("is-limitless").checked = isLimitless;

    document.getElementById("is-limitless").addEventListener('change', function () {
        isLimitless = !isLimitless;
        localStorage.setItem("is-limitless", isLimitless);
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    class GameField {
        gameField = null;
        timer = null;
        time = 0;
        score = 0;
        isPaused = false;

        boxSnakeArr = document.getElementById("box-snake");
        boxAppleArr = document.getElementById("box-apple");
        boxOpponentArr = document.getElementById("box-opponent");

        constructor() {
            this.mapWidth = 45;
            this.mapHeight = 19;
            this.numOfApple = parseInt(localStorage.getItem("apples-count"));
            this.hasOpponent = localStorage.getItem("has-opponent") === "true";
            this.isGrowing = localStorage.getItem("is-growing") === "true";
            this.isLimitless = localStorage.getItem("is-limitless") === "true";
            this.speed = 1;
            this.box = this.calculateBoxSize();
            this.updateFieldSize();
            this.game();

            document.addEventListener('keydown', this.handleKeyDown.bind(this));
        }

        calculateBoxSize() {
            const vw = window.innerWidth / 100;
            const vh = window.innerHeight / 100;
            return (1.2 * vw) + (1.2 * vh);
        }

        updateFieldSize() {
            const play = document.querySelector("#play");
            const playComputedStyle = getComputedStyle(play);
            const playWidth = parseFloat(playComputedStyle.width);
            const playHeight = parseFloat(playComputedStyle.height);

            const boxSizeW = this.box * this.mapWidth;
            const fieldWidth = `calc(79.6vw - ${(playWidth - boxSizeW)}px)`;
            const boxSizeH = this.box * this.mapHeight;
            const fieldHeight =  `calc(109.6vh - ${(playHeight - boxSizeH)}px)`;

            play.style.width = fieldWidth;
            play.style.height = fieldHeight;
        }

        handleKeyDown(event) {
            // Проверка нажатия комбинации клавиш Shift + P
            if (event.shiftKey && event.key === 'P') {
                if (this.isPaused)
                    this.resumeGame();
                else
                    this.pauseGame();
                this.isPaused = !this.isPaused;
            }
        }

        startTimer() {
            this.timer = setInterval(() => {
                this.time++;
                document.querySelector("#play .time span").textContent = timeToString(this.time);
            }, 1000);
        }

        game() {
            this.startTimer();

            // Создание массива пустых позиций на карте
            this.mapEmpty = [];
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++)
                    this.mapEmpty.push([y, x]);
            
            this.snake = []; this.boxSnake = [];
            this.spanSnake();

            this.opponent = []; this.boxOpponent = [];
            this.spanOpponent();

            this.apple = []; this.boxApple = [];
            this.spanApples();

            this.startGame();
        }

        spanSnake() {
            // Создание змейки (содержит коор-ты каждой ячейки)
            for (let i = 0; i < 4; i++) {
                this.snake[i] = [Math.floor(this.mapHeight / 2), Math.floor(this.mapWidth / 2)];

                this.boxSnakeArr.insertAdjacentHTML('beforeend', '<div class="box-snake" id="box-snake-' + i + '"></div>');
                this.boxSnake[i] = document.getElementById('box-snake-' + i);

                this.mapEmpty.splice(findSubArrayIndex(this.mapEmpty, this.snake[i]), 1);
            }
        }

        spanOpponent() {
            // Создание противника (содержит коор-ты каждой ячейки)
            if (this.hasOpponent) {
                this.opponent = [choice(this.mapEmpty)];
                this.mapEmpty.splice(findSubArrayIndex(this.mapEmpty, this.opponent[0]), 1);
                for (let i = 0; i < 4; i++) {
                    if (i > 0)
                        this.opponent[i] = [this.opponent[0][0], this.opponent[0][1]];

                    this.boxOpponentArr.insertAdjacentHTML('beforeend', '<div class="box-opponent" id="box-opponent-' + i + '"></div>');
                    this.boxOpponent[i] = document.getElementById('box-opponent-' + i);

                    this.mapEmpty.splice(findSubArrayIndex(this.mapEmpty, this.opponent[i]), 1);
                }
            }
        }

        spanApples() {
            // Создания массива яблок (содержит коор-ты каждого яблока)
            for (let i = 0; i < this.numOfApple; i++) {
                this.apple[i] = choice(this.mapEmpty);
                this.mapEmpty.splice(findSubArrayIndex(this.mapEmpty, this.apple[i]), 1);

                this.boxAppleArr.insertAdjacentHTML('beforeend', '<div class="box-apple" id="box-apple-' + i + '"></div>');
                this.boxApple[i] = document.getElementById('box-apple-' + i);

                this.boxApple[i].style.left = this.apple[i][1] * this.box + 'px';
                this.boxApple[i].style.top = this.apple[i][0] * this.box + 'px';
            }
        }

        startGame() {
            this.direction = null; this.directionOpponent = null;
            this.lastPosition; this.lastPositionOpponent;
            this.isGod = true; this.isGodOpponent = true; this.nextDirection;
            this.nearestApple; this.distanceToApple; this.distanceToAppleLast;

            const verticalMovement = () => {
                if ((this.opponent[0][0] < this.nearestApple[0]) && (this.directionOpponent !== "up"))
                    this.directionOpponent = "down";
                else if (this.directionOpponent !== "down")
                    this.directionOpponent = "up";
                else this.directionOpponent = this.directionOpponent;
            }

            const horizontalMovement = () => {
                if ((this.opponent[0][1] < this.nearestApple[1]) && (this.directionOpponent !== "left"))
                    this.directionOpponent = "right";
                else if (this.directionOpponent !== "right")
                    this.directionOpponent = "left";
                else this.directionOpponent = this.directionOpponent;
            }

            // Тело игры
            this.gameField = setInterval(() => {
                if ((this.isGod) && ((this.snake[0][0] !== this.snake[1][0]) || (this.snake[0][1] !== this.snake[1][1])))
                    this.isGod = false;

                if (this.hasOpponent) {
                    if ((this.isGodOpponent) && ((this.opponent[0][0] !== this.opponent[1][0]) || (this.opponent[0][1] !== this.opponent[1][1])))
                        this.isGodOpponent = false;

                    // Поиск ближ. яблока
                    this.nearestApple = this.apple[0]
                    for (let i = 1; i < this.apple.length; i++) {
                        this.distanceToAppleLast = (Math.abs(this.opponent[0][0] - this.nearestApple[0]) + Math.abs(this.opponent[0][1] - this.nearestApple[1]))
                        this.distanceToApple = (Math.abs(this.opponent[0][0] - this.apple[i][0]) + Math.abs(this.opponent[0][1] - this.apple[i][1]))
                        this.nearestApple = this.distanceToApple < this.distanceToAppleLast ? this.apple[i] : this.nearestApple;
                    }

                    // Смена направления противника
                    if (this.opponent[0][0] === this.nearestApple[0])
                        horizontalMovement();
                    else if (this.opponent[0][1] === this.nearestApple[1])
                        verticalMovement();
                    else chance(50, verticalMovement, horizontalMovement)();

                    // Движение противника
                    this.lastPositionOpponent = [this.opponent[0][0], this.opponent[0][1]];
                    if (this.directionOpponent === "up")
                        this.opponent[0][0] -= 1;
                    else if (this.directionOpponent === "left")
                        this.opponent[0][1] -= 1;
                    else if (this.directionOpponent === "down")
                        this.opponent[0][0] += 1;
                    else if (this.directionOpponent === "right")
                        this.opponent[0][1] += 1;

                    for (let i = 1; i < this.opponent.length; i++) {
                        let a = this.opponent[i];
                        this.opponent[i] = this.lastPositionOpponent;
                        this.lastPositionOpponent = a;
                    }

                    this.mapEmpty.push(this.lastPositionOpponent);
                    this.mapEmpty.splice(findSubArrayIndex(this.mapEmpty, this.opponent[0]), 1);
                }

                // Смена направления змейки
                document.addEventListener('keydown', keyPressListener)
                const self = this;
                function keyPressListener(event) {
                    if (event.keyCode === 37 && self.direction !== "right")
                        self.nextDirection = "left";
                    else if (event.keyCode === 38 && self.direction !== "down")
                        self.nextDirection = "up";
                    else if (event.keyCode === 39 && self.direction !== "left")
                        self.nextDirection = "right";
                    else if (event.keyCode === 40 && self.direction !== "up")
                        self.nextDirection = "down";
                }
                this.direction = this.nextDirection;

                // Движение змейки
                this.lastPosition = [this.snake[0][0], this.snake[0][1]];
                if (this.direction === "up")
                    this.snake[0][0] -= 1;
                else if (this.direction === "left")
                    this.snake[0][1] -= 1;
                else if (this.direction === "down")
                    this.snake[0][0] += 1;
                else if (this.direction === "right")
                    this.snake[0][1] += 1;

                for (let i = 1; i < this.snake.length; i++) {
                    let a = this.snake[i];
                    this.snake[i] = this.lastPosition;
                    this.lastPosition = a;
                }

                this.mapEmpty.push(this.lastPosition);
                this.mapEmpty.splice(findSubArrayIndex(this.mapEmpty, this.snake[0]), 1);

                // Телепорт
                if (this.isLimitless) {
                    if (this.snake[0][0] < 0)
                        this.snake[0][0] = this.mapHeight - 1;
                    else if (this.snake[0][0] >= this.mapHeight)
                        this.snake[0][0] = 0;
                    else if (this.snake[0][1] < 0)
                        this.snake[0][1] = this.mapWidth - 1;
                    else if (this.snake[0][1] >= this.mapWidth)
                        this.snake[0][1] = 0;
                }

                // Проверки на столкновение
                if (((!this.isLimitless) && ((this.snake[0][0] < 0) || (this.snake[0][0] >= this.mapHeight)) || ((this.snake[0][1] < 0) || (this.snake[0][1] >= this.mapWidth)))    // Стена
                    || (((findSubArrayIndex(this.snake.slice(1), this.snake[0])) > -1) && !this.isGod) || ((findSubArrayIndex(this.opponent, this.snake[0])) > -1)) {                   // Тело
                    this.gameOver();
                    return;
                }

                // Проверки на столкновение (противник)
                if (this.hasOpponent)
                    if (((this.opponent[0][0] < 0) || (this.opponent[0][0] >= this.mapHeight)) || ((this.opponent[0][1] < 0) || (this.opponent[0][1] >= this.mapWidth))                 // Стена
                        || (((findSubArrayIndex(this.opponent.slice(1), this.opponent[0])) > -1) && !this.isGodOpponent) || ((findSubArrayIndex(this.snake, this.opponent[0])) > -1)) {     // Тело

                        this.mapEmpty = this.mapEmpty.concat(this.opponent)
                        this.boxOpponentArr.innerHTML = ''; this.boxOpponent = [];

                        // Респавн противника
                        this.spanOpponent();
                        this.isGodOpponent = true;
                    }

                // Проверка на съедение яблока
                for (let i = 0; i < this.apple.length; i++) {
                    // Игрок
                    if ((this.snake[0][0] === this.apple[i][0]) && (this.snake[0][1] === this.apple[i][1])) {
                        let a = this.apple[i];
                        this.apple[i] = choice(this.mapEmpty);
                        this.mapEmpty.splice(findSubArrayIndex(this.mapEmpty, this.apple[i]), 1);
                        this.mapEmpty.push(a);

                        this.boxApple[i].style.left = this.apple[i][1] * this.box + 'px';
                        this.boxApple[i].style.top = this.apple[i][0] * this.box + 'px';

                        this.score += 2;
                        document.querySelector("#play .score span").textContent = this.score;

                        // Рост тела
                        if (this.isGrowing) {
                            let j = this.snake.length
                            this.snake[j] = this.lastPosition;
                            this.boxSnakeArr.insertAdjacentHTML('beforeend', '<div class="box-snake" id="box-snake-' + j + '"></div>');
                            this.boxSnake[j] = document.getElementById('box-snake-' + j);
                        }

                        break;
                    }

                    // Противник
                    if (this.hasOpponent)
                        if ((this.opponent[0][0] === this.apple[i][0]) && (this.opponent[0][1] === this.apple[i][1])) {
                            let a = this.apple[i];
                            this.apple[i] = choice(this.mapEmpty);
                            this.mapEmpty.splice(findSubArrayIndex(this.mapEmpty, this.apple[i]), 1);
                            this.mapEmpty.push(a);

                            this.boxApple[i].style.left = this.apple[i][1] * this.box + 'px';
                            this.boxApple[i].style.top = this.apple[i][0] * this.box + 'px';

                            this.score -= 1;
                            document.querySelector("#play .score span").textContent = this.score;

                            // Рост тела
                            if (this.isGrowing) {
                                let j = this.opponent.length
                                this.opponent[j] = this.lastPositionOpponent;
                                this.boxOpponentArr.insertAdjacentHTML('beforeend', '<div class="box-opponent" id="box-opponent-' + j + '"></div>');
                                this.boxOpponent[j] = document.getElementById('box-opponent-' + j);
                            }

                            break;
                        }
                }

                // Отрисовка
                for (let i = 0; i < this.snake.length; i++) {
                    this.boxSnake[i].style.left = this.snake[i][1] * this.box + 'px';
                    this.boxSnake[i].style.top = this.snake[i][0] * this.box + 'px';
                }

                if (this.hasOpponent)
                    for (let i = 0; i < this.opponent.length; i++) {
                        this.boxOpponent[i].style.left = this.opponent[i][1] * this.box + 'px';
                        this.boxOpponent[i].style.top = this.opponent[i][0] * this.box + 'px';
                    }
            }, 120 * this.speed);
        }

        pauseGame() {
            this.stopGame();
            const pause = document.createElement('div');
            pause.classList.add('pause');
            const message = document.createElement('p');
            message.textContent = 'Paused';
            document.querySelector(".field").appendChild(pause);
            document.querySelector(".field").appendChild(message);
        }

        resumeGame() {
            this.startGame();
            document.querySelector('.field .pause + p').remove();
            document.querySelector('.field .pause').remove();
        }

        stopGame() {
            clearInterval(this.timer);
            clearInterval(this.gameField);
        }

        gameOver() {
            this.stopGame();
            menuPlayButton.disabled = true;
            const blink = setInterval(() => {
                document.querySelectorAll(".box-snake").forEach(function (element) {
                    element.classList.toggle('hidden');
                });
            }, 200);
            setTimeout(() => {
                clearInterval(blink);
                document.querySelector("#box-opponent").innerHTML = '';
                document.querySelector("#box-snake").innerHTML = '';
                document.querySelector("#box-apple").innerHTML = '';
                const message = document.createElement('p');
                message.textContent = 'Game Over!';
                document.querySelector(".field").appendChild(message);
                const record = localStorage.getItem("best-score");
                if (record < this.score) {
                    localStorage.setItem("best-score", this.score);
                    document.querySelector("#play .best-score span").textContent = localStorage.getItem("best-score");
                }
                menuPlayButton.disabled = false;
                document.removeEventListener('keydown', this.handleKeyDown);
            }, 2000);
        }
    }

    function timeToString(seconds) {
        hours = 0; minutes = 0;
        minutes = Math.floor(seconds / 60);
        hours = Math.floor(minutes / 60);
        seconds = seconds % 60;
        return ((hours > 0 ? hours + "ч " : "") + (minutes > 0 ? minutes + "мин " : "") + (seconds + "с"))
    }

    function chance(percent, win, lose) {
        return (randInt(0, 99) < percent) ? win : lose;
    }

    function choice(array) {
        return array[Math.floor(Math.random() * array.length)]
    }

    function randInt(min, max) {
        return Math.floor(min + (Math.random() * max - min + 1))
    }

    function findSubArrayIndex(arr, subArray) {
        for (let i = 0; i < arr.length; i++)
            if (Array.isArray(arr[i]) && arraysEqual(arr[i], subArray))
                return i;
        return -1;
    }

    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length)
            return false;
        for (let i = 0; i < arr1.length; i++)
            if (arr1[i] !== arr2[i])
                return false;
        return true;
    }
});