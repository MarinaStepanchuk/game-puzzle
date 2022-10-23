let columnNum = 4;
let emtyNumber = columnNum ** 2;
let combination = new Array(columnNum ** 2).fill(0).map((item,index) => index + 1);
let winnCombination =  new Array(columnNum ** 2).fill(0).map((item,index) => index + 1);
let count = 0;

//-----заполнение html-------------

function addElements (div) {
    for (let i = 0; i < combination.length; i++) {
        let item = document.createElement('button');
        item.classList.add('item');
        item.innerHTML = `<span class="value">${combination[i]}</span>`;
        div.appendChild(item);
    };
};

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
            <div class="game"></div>
            </div>
    `;
    let game = document.querySelector('.game');
    addElements(game);
};

fillHtml();

//-----------инициализация (определение матрицы, расстановка элементов) -------------------

const game = document.querySelector('.game');
const cells = Array.from(game.querySelectorAll('.item'));
const shuffleButton = document.querySelector('.shuffle');

cells[cells.length - 1].style.display = 'none';

let matrix = getMatrix();
setPozitionMatrix(matrix);

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
    const shuffleArray = shuffleGame(combination);
    matrix = getMatrix(shuffleArray);
    setPozitionMatrix(matrix);
});

function shuffleGame(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    return array;
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
        count++;
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
    count++;
});


// window.addEventListener('load', (e) => {

// });
