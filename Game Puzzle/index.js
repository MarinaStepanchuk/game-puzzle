let columnNum = 4;
let combination = new Array(columnNum ** 2).fill(0).map((item,index) => index + 1);

function addElements (div) {
    for (let i = 0; i < combination.length; i++) {
        let item = document.createElement('button');
        item.classList.add('item');
        item.innerHTML = combination[i];
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
    `
    let game = document.querySelector('.game')
    addElements(game);
};

fillHtml();

const game = document.querySelector('.game');
const cells = Array.from(game.querySelectorAll('.item'));
const shuffleButton = document.querySelector('.shuffle');

let matrix = getMatrix();
setPozitionMatrix(matrix)

function getMatrix () {
    // let arr = cells.map((item => Number(item.innerHTML)))
    const matrix = new Array(columnNum);
    for (let i = 0; i < columnNum; i++) {
        matrix[i] = new Array(columnNum);
    };
    let numbers = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            matrix[i][j] = combination[numbers];
            numbers++
        }
    }
    return matrix
}

function setPozitionMatrix(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
            const value = matrix[y][x];
            const cell = cells[value - 1];
            setCellStyles(cell, x, y)
        }
    }
}

function setCellStyles(cell, x, y) {
    const offset = 100;
    cell.style.transform = `translate(${x * offset}%, ${y * offset}%)`
}




// window.addEventListener('load', (e) => {

// });
