//---------инициалиация переменных, присвоение дефолтных значений переменых -----------

let matrix;
let columnNum = 4;
let emtyNumber;
let combination;
let winnCombination;
let count;

function destinationConstante(num) {
    emtyNumber = num ** 2;
    combination = new Array(num ** 2).fill(0).map((item,index) => index + 1);
    winnCombination =  new Array(num ** 2).fill(0).map((item,index) => index + 1);
    count = 0;  
}

destinationConstante(columnNum);

//-----заполнение html-------------

function fillHtml() {
    let gameWrapper = document.createElement('div');
    gameWrapper.classList.add("game-wrapper");
    document.body.appendChild(gameWrapper);
    gameWrapper.innerHTML = `
        <div class="game-wrapper">
            <div class = 'control-container'>
                <button class="shuffle">Shuffle and start</button>
                <button class="stop">Stop</button>
                <button class="save">Save</button>
                <button class="results">Results</button>
                <button class="sound"></button>
            </div>
            <div>Frame size:
            <select id="size-game">
                <option>3x3</option>
                <option selected>4x4</option>
                <option>5x5</option>
                <option>6x6</option>
                <option>7x7</option>
                <option>8x8</option>
            </select>
            </div>
            <div class="info">
                <span class="moves-title">Moves: <span class="moves">0</span></span>
                <span class="time-tittle">Time: <time class="time"></time></span>
            </div>
            <div class="game">
            </div>
            <div class="winn-message-container">
            <div class="winn-message">
                
            </div>
            </div>
            </div>
    `;
    let game = document.querySelector('.game');
    addElements(game);
};

function addElements (div) {
    for (let i = 0; i < combination.length; i++) {
        let item = document.createElement('button');
        item.classList.add('item');
        item.innerHTML = `<span class="value">${combination[i]}</span>`;
        div.appendChild(item);
    };
};

fillHtml();

//-----------инициализация (определение матрицы, расстановка элементов) -------------------

const game = document.querySelector('.game');
const shuffleButton = document.querySelector('.shuffle');
const moves = document.querySelector('.moves');
const time = document.querySelector('.time');
const stopTime = document.querySelector('.stop');
const sound = document.querySelector('.sound');
const save = document.querySelector('.save');

let cells = Array.from(game.querySelectorAll('.item'));
cells[cells.length - 1].style.display = 'none';

let second = 0;
let timeInSecond


if(JSON.parse(localStorage.getItem('matrix'))) {
    getLocalStorage();
} else {
    startGame()
    second = 0;
    time.innerHTML = getTime(second);
}


function startGame() {
    shuffleGame(combination);
    matrix = getMatrix();
    setPozitionMatrix(matrix);
    count = 0;
    moves.innerHTML = count;
}

//----------перемешивание------------

document.querySelector('.shuffle').addEventListener('click', () => {
    startGame();
    reloadTimer();
});

function shuffleGame(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    if(!canSolve(array)) {
        shuffleGame(array);

    } else {
        return array;
    };
};

function canSolve(array) {
    const matrix = getMatrix ();
    const emptyCell = emtyNumber;
    const emptyCellCoord = findCoordinates(emptyCell, matrix);
    let sum = 0;
    let i = 0;
    while(i < array.length) {
        for (let j = i+1; j < array.length; j++) {
            if(array[i] !== emtyNumber) {
                if(array[i] > array[j]) {
                    sum += 1;
                }
            }
        }
        i++;
    }
    console.log(emptyCell.y)
    sum = sum + emptyCellCoord.y + 1;
    console.log(emptyCellCoord.y)
    console.log(sum)
    let canSolveCombination = (sum % 2 === 0) ? true : false;;
    // if(columnNum % 2 === 0) {
    //     canSolveCombination = (sum % 2 === 0) ? true : false;
    // } else {
    //     canSolveCombination = (sum % 2 === 0) ? false : true;
    //     // console.log(sum % 2)
    // }
    return canSolveCombination;
}

function getMatrix () {
    const matrix = new Array(columnNum);
    for (let i = 0; i < columnNum; i++) {
        matrix[i] = new Array(columnNum);
    };
    let numbers = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            matrix[i][j] = combination[numbers];
            numbers++;
        };
    };
    return matrix;
};

function setPozitionMatrix(matrix) {
    let y1 = 0;
    for (let y = 0; y < matrix.length; y++) {
        let x1 = 0;
        for (let x = 0; x < matrix.length; x++) {
            const value = matrix[y][x];
            const cell = cells[value - 1];
            setCellStyles(cell, x, y, x1, y1)
            x1 += 0.015;
        };
        y1 += 0.015;
    };
};

function setCellStyles(cell, x, y, x1, y1) {
    const offset = 100;
    cell.style.transform = `translate(${(x + x1) * offset}%, ${(y + y1) * offset}%)`;
};

//----------смещение элемента по клику------------

game.addEventListener('click', (event) => {
    const cellClick = event.target.closest('button');
    if(!cellClick) {
        return;
    };
    const cellNumber = Number(cellClick.innerText);
    const emptyCell = emtyNumber;
    const cellCoord = findCoordinates(cellNumber, matrix);
    const emptyCellCoord = findCoordinates(emptyCell, matrix);
    const canMove = canMoveCell(cellCoord, emptyCellCoord);
    if(count === 0) {
        second++;
        time.innerHTML = getTime(second);
        startTimer();
        timerIsStop = false;
    };
    if(canMove) {
        move(cellCoord, emptyCellCoord, matrix);
    };

});

function findCoordinates(number, matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
            if(matrix[y][x] === number) {
                return {x, y};
            };
        };
    };
    return null;
};

function canMoveCell(coord1, coord2) {
    return ((Math.abs(coord1.x - coord2.x) === 1 && coord1.y === coord2.y || Math.abs(coord1.y - coord2.y) === 1 && coord1.x === coord2.x)) ? true : false;
}

function move(coord1, coord2, matrix) {
    const storage = matrix[coord1.y][coord1.x];
    matrix[coord1.y][coord1.x] = matrix[coord2.y][coord2.x];
    matrix[coord2.y][coord2.x] = storage;
    setPozitionMatrix(matrix);
    count++;
    moves.innerHTML = count;
    soundMove()

    if(winn(matrix)) {
        showWinnMessage();
    };
};

//-----------таймер-----------

function countTime() {
    second++;
    time.innerHTML = getTime(second);
};

function getTime(second) {
    if(second < 10) {
        return `00:0${second}`;
    }
    let min = (Math.floor(second / 60) < 10)? '0'+Math.floor(second / 60): Math.floor(second / 60);
    let sec = (second % 60 < 10) ? '0'+(second % 60): second % 60;
    return `${min}:${sec}`;
}

stopTime.addEventListener('click', () => {
    if(timerIsStop) {
        startTimer();
        timerIsStop = false;
    } else {
        stopTimer();
        timerIsStop = true;
    };
});

function startTimer() {
    timeInSecond = setInterval("countTime()",1000);
};

function stopTimer() {
    clearInterval(timeInSecond)
};

function reloadTimer() {
    second = 0;
    time.innerHTML = getTime(second);
    stopTimer();
    timerIsStop = true;
}

//-------------смещение позиции по нажатию на клавиатуру----------

window.addEventListener('keydown', (event) => {
    if (!event.key.includes('Arrow')) {
        return;
    };
    const emptyCellCoord = findCoordinates(emtyNumber, matrix);
    const direction = event.key.split('Arrow')[1].toLowerCase();
    const cellCoord = {
        x: emptyCellCoord.x,
        y: emptyCellCoord.y,
    };
    switch (direction) {
        case 'up':
            cellCoord.y +=1;
            break;
        case 'down':
            cellCoord.y -=1;
            break;
        case 'left':
            cellCoord.x +=1;
            break;
        case 'right':
            cellCoord.x -=1;
            break;
    }
    if(cellCoord.x >= matrix.length || cellCoord.x < 0 || cellCoord.y >= matrix.length || cellCoord.y < 0) {
        return
    }
    if(count === 0) {
        second++;
        time.innerHTML = getTime(second);
        startTimer();
        timerIsStop = false;
    }
    move(cellCoord, emptyCellCoord, matrix);
});

//------------изменение размера поля-----------

const sizeGame = document.getElementById('size-game');

sizeGame.addEventListener('change', () => {
    columnNum = Number(sizeGame.value[0]);    game.classList.add('winn-numbers');
    destinationConstante(columnNum);
    game.innerHTML = '';
    addElements(game);
    cells = Array.from(game.querySelectorAll('.item'));
    cells[cells.length - 1].style.display = 'none';
    switch(columnNum) {
        case 3:
            getStyleCells(cells, "32.6%", "1.5em")
            break;
        case 4:
            getStyleCells(cells, "24.5%", "1em")
            break;
        case 5:
            getStyleCells(cells, "19.6%", "1em")
            break;
        case 6:
            getStyleCells(cells, "16.3%", "0.7em")
            break;
        case 7:
            getStyleCells(cells, "13.95%", "0.5em")
            break;
        case 8:
            getStyleCells(cells, "12.2%", "0.5em")
            break;
    }
    startGame();
    reloadTimer();
})

function getStyleCells(array, widthCell, fontSize) {
    array.forEach(value => {
        value.style.width = widthCell;
        value.style.height = widthCell;
        value.style.fontSize = fontSize;
    })
}

//-----------выигрыш-----------

function winn(matrix) {
    const arrayMatrix = matrix.flat();
    for (let i = 0; i < arrayMatrix.length; i++) {
        if(arrayMatrix[i] !== winnCombination[i]) {
            return false;
        };
    };
    return true;
};

const winnMessage = document.querySelector('.winn-message-container');
const winnText = document.querySelector('.winn-message');


function showWinnMessage() {
    winnMessage.classList.add('message-show');
    winnText.innerHTML = `<div class="close"></div>«Congratulations! You solved the puzzle in ${time.innerHTML} and ${moves.innerHTML} moves!»`;
    second = 0;
};

winnMessage.addEventListener( 'click', (e) => {
    if (e.target.className != "winn-message") {
        winnMessage.classList.remove('message-show')
    };
})

// const closeWinnMessage = document.querySelector('.close');

// closeWinnMessage.addEventListener( 'click', (e) => {
//     if (e.target.className != "winn-message") {
//         winnMessage.classList.remove('message-show')
//     };
// })

//------------звук по клику------------
let soundOn = true;

sound.addEventListener('click', () => {
    if(soundOn) {
        sound.classList.add('sound-off');
    } else {
        sound.classList.remove('sound-off');
    }
    soundOn = !soundOn;
});

function soundMove() {
    if(soundOn) {
        let audio = new Audio;
        audio.src = "./assets/sound.mp3";
        audio.autoplay = true;
    }
}

//-----------сохранение результатов------------

save.addEventListener('click', () =>{
    localStorage.setItem('matrix', JSON.stringify(matrix));
    localStorage.setItem('moves', JSON.stringify(count));
    localStorage.setItem('time', JSON.stringify(second));
})

function getLocalStorage() {
    matrix = JSON.parse(localStorage.getItem('matrix'));
    setPozitionMatrix(matrix);
    count = JSON.parse(localStorage.getItem('moves'));
    moves.innerHTML = count;
    second = JSON.parse(localStorage.getItem('time'));
    console.log(second)
    time.innerHTML = getTime(second);
    timerIsStop = false;
    startTimer();
}