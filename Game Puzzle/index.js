let columnNum = 4;
let matrix = new Array(columnNum ** 2).fill(0).map((item,index) => index + 1);

function addElements (div) {
    for (let i = 0; i < matrix.length; i++) {
        let item = document.createElement('button');
        item.classList.add('item');
        item.innerHTML = matrix[i];
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
const cells = Array.from(game.querySelectorAll('.item'))

// window.addEventListener('load', (e) => {

// });
