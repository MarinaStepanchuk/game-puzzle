//---------инициалиация переменных, дефолтные значения -----------

let matrix;
let columnNum = 4;
let emtyNumber = columnNum ** 2;
let combination = new Array(columnNum ** 2).fill(0).map((item,index) => index + 1);
let winnCombination =  new Array(columnNum ** 2).fill(0).map((item,index) => index + 1);
let count = 0;

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
            <select id="size-game">
                <option>3x3</option>
                <option selected>4x4</option>
                <option>5x5</option>
                <option>6x6</option>
                <option>7x7</option>
                <option>8x8</option>
            </select>
            <div class="info">
                <span class="moves-title">Moves: <span class="moves">0</span></span>
                <span class="time-tittle">Time: <time class="time"></time></span>
            </div>
            <div class="game">
            <div class="winn-message-container">
                <div class="winn-message">
                    <div class="close"></div>
                    «Congratulations! You solved the puzzle in ##:## and N moves!»
                </div>
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
const cells = Array.from(game.querySelectorAll('.item'));
const shuffleButton = document.querySelector('.shuffle');
const sizeGame = document.getElementById('size-game');

cells[cells.length - 1].style.display = 'none';

startGame()

function startGame() {
    shuffleGame(combination);
    matrix = getMatrix();
    setPozitionMatrix(matrix);
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
    // if(!canSolve(matrix)) {
    //     shuffleGame(array);
    // } else {
    //     console.log(2)
    // } 
    return matrix;
};

function canSolve(array) {
    const matrix = getMatrix ();
    const emptyCell = emtyNumber;
    const emptyCellCoord = findCoordinates(emptyCell, matrix);
    // const arrayMatrix = matrix.flat();
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
    
    for (let x = 0; x < matrix.length; x++) {
        console.log(matrix[emptyCellCoord.y][x])
        if(matrix[emptyCellCoord.y][x] !== emtyNumber) {
            sum += matrix[emptyCellCoord.y][x];
        }
    }
    let canSolveCombination
    if(columnNum % 2 === 0) {
        canSolveCombination = (sum % 2 === 0) ? true : false;
    } else {
        canSolveCombination = (sum % 2 === 0) ? false : true;
    }
    return canSolveCombination
}

function setPozitionMatrix(matrix) {
    let y1 = 0;
    for (let y = 0; y < matrix.length; y++) {
        let x1 = 0;
        for (let x = 0; x < matrix.length; x++) {
            const value = matrix[y][x];
            const cell = cells[value - 1];
            setCellStyles(cell, x, y, x1, y1)
            x1 += 0.015;
        }
        y1 += 0.015;
    }
}

function setCellStyles(cell, x, y, x1, y1) {
    const offset = 100;
    cell.style.transform = `translate(${(x + x1) * offset}%, ${(y + y1) * offset}%)`;
}

//----------перемешивание------------

document.querySelector('.shuffle').addEventListener('click', () => {
    startGame();
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
    } 
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

    if(winn(matrix)) {
        showWinnMessage()
    }
};

//-------------смещение позиции по нажатию на клавиатуру----------

window.addEventListener('keydown', (event) => {

    if (!event.key.includes('Arrow')) {
        return;
    };

    const emptyCellCoord = findCoordinates(emtyNumber, matrix);

    const cellCoord = {
        x: emptyCellCoord.x,
        y: emptyCellCoord.y,
    };

    const direction = event.key.split('Arrow')[1].toLowerCase();

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

    move(cellCoord, emptyCellCoord, matrix);

});

//-----------выигрыш-----------

function winn(matrix) {
    const arrayMatrix = matrix.flat();
    for (let i = 0; i < arrayMatrix.length; i++) {
        if(arrayMatrix[i] !== winnCombination[i]) {
            return false;
        };
    };

    return true;
}

const winnMessage = document.querySelector('.winn-message-container');
const winnText = document.querySelector('.winn-message');
const closeWinnMessage = document.querySelector('.close');

function showWinnMessage() {
    winnMessage.classList.add('message-show');
    game.classList.add('winn-numbers');
};

winnMessage.addEventListener( 'click', (e) => {
    if (e.target.className != "winn-message") {
        winnMessage.classList.remove('message-show')
    };
})

closeWinnMessage.addEventListener( 'click', (e) => {
    if (e.target.className != "winn-message") {
        winnMessage.classList.remove('message-show')
    };
})