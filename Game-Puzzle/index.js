//---------инициалиация переменных, присвоение дефолтных значений переменых -----------

let matrix;
let columnNum = 4;
let emtyNumber;
let combination;
let winnCombination;
let count;
let canPlay = true;

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
                    <div class="close"></div>
                    <div class="winn-text"></div>
                    <div class="add-in-table">
                        <input type="text" class="player-name" name="player-name" id="name" placeholder="enter your name">
                        <button class="sande-name">Add</button>
                    </div>
                </div>
            </div>
            <div class="results-container">
        <div class="results-table">
        <div class="close-table"></div>
            <table>
                <thead>
                    <tr>
                        <td>Score</td>
                        <td>Name</td>
                        <td>Moves</td>
                        <td>Time</td>
                        <td>Board</td>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
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
const results = document.querySelector('.results');

let cells = Array.from(game.querySelectorAll('.item'));
cells[cells.length - 1].style.visibility = 'hidden';

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
    canPlay = true;
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
    
    if(columnNum % 2 === 0) {
        sum = sum + emptyCellCoord.y + 1;
    }
    let canSolveCombination = (sum % 2 === 0) ? true : false;
    sum = sum + emptyCellCoord.y + 1;
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
    if(!canPlay) {
        return;
    };
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
        canPlay = false;
        showWinnMessage();

            //-----если попадает в скор

    
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
    if(!canPlay) {
       return;
    };
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

const winnMessageContainer = document.querySelector('.winn-message-container');
const winnText = document.querySelector('.winn-text');
const winnMessage = document.querySelector('.winn-message');


function showWinnMessage() {
    winnMessageContainer.classList.add('message-show');
    winnText.innerHTML = `Congratulations! You solved the puzzle in ${time.innerHTML} and ${moves.innerHTML} moves!`;
    stopTimer();
    timerIsStop = true;
};

// winnMessageContainer.addEventListener( 'click', (e) => {
//     if (e.target.className != "winn-message") {
//         winnMessageContainer.classList.remove('message-show');
//     };
// })

// const closeWinnMessage = document.querySelector('.close');

// closeWinnMessage.addEventListener( 'click', (e) => {
//     if (e.target.className != "winn-message") {
//         winnMessage.classList.remove('message-show')
//     };
// })

//----------------таблица результатов--------------

// class NewWinner {
//     constructor(score,name, moves, time, bord) {
//         this.score = score;
//         this.name = name;
//         this.moves = moves;
//         this.time = time;
//         this.bord = bord;
//     }
// }

const resultTable = document.querySelector('.results-container');
const tableText = document.querySelector('.results-table');
const playerName = document.querySelector('.player-name');
const sandButton = document.querySelector('.sande-name');
const bodyTable = document.getElementsByTagName('tbody');

let nameWinner;


sandButton.addEventListener('click', () => {
    nameWinner = playerName.value;
    addWinner();
    showTable();
});

function getPositionInScore (move, time) {

}

function addWinner() {
    const arrayWinners = []
    const winner = {
        name: nameWinner,
        moves: count,
        time: time.innerHTML,
        board: `${columnNum}x${columnNum}`,
    }
    
    console.log(winner)
    arrayWinners.push(1);
    console.log(arrayWinners)
    const sortArrayWinners = arrayWinners.sort((a, b) => a.moves - b.moves);
    sortArrayWinners.pop();
    const table = "";
    sortArrayWinners.forEach((winner, index) => {
        table += `<tr>
                    <td>${index + 1}</td>
                    <td>${winner.name}</td>
                    <td>${winner.moves}</td>
                    <td>${winner.time}</td>
                    <td>${winner.board}</td>
                </tr> `
    })

    bodyTable.innerHTML = table;
}

results.addEventListener( 'click', (e) => {
    showTable();
});

function showTable() {
    winnMessageContainer.classList.remove('message-show');
    resultTable.classList.add('table-show');
};



resultTable.addEventListener( 'click', (e) => {
    if (e.target.className != "results-table") {
        resultTable.classList.remove('table-show')
    };
})

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
    time.innerHTML = getTime(second);
    timerIsStop = false;
    startTimer();
}

//-----------перетаскивание ячеек-------------------

// game.addEventListener('mousedown', (event) => {
//     const cellClick = event.target.closest('button');
//     if(!cellClick) {
//         return;
//     };
//     const cellNumber = Number(cellClick.innerText);
//     const emptyCell = emtyNumber;
//     const cellCoord = findCoordinates(cellNumber, matrix);
//     const emptyCellCoord = findCoordinates(emptyCell, matrix);
//     const canMove = canMoveCell(cellCoord, emptyCellCoord);
//     if(canMove) {
//         dragAndDrop (cellClick, cellCoord, emptyCellCoord);
//     };
//     // cellClick.removeAttribute('draggable');
// })


// function dragAndDrop (cellClick, cellCoord, emptyCellCoord) {
//     cellClick.setAttribute('draggable', 'true');
//     const cells = document.querySelectorAll('.item');

//     const dragStart = function() {
//         setTimeout(() => {
//             this.classList.add('visibility');
//         }, 0);
//     };

//     const dragEnd = function() {
//         this.classList.remove('visibility');
//     };

//     const dragOver = function(event) {
//         event.preventDefault();
//         console.log(1)
//     };

//     const dragLeave = function(event) {
//         event.preventDefault();
//     };

//     const drag = function(event) {
//         dragDrop(event);
//         cellClick.removeAttribute('draggable');
//     }
// console.log(777)
//     const dragDrop = function(event) {
//         if(!event.target.closest('button')){
//             console.log(1)
//             cellClick.style.transition = 'none';
//             const storage = matrix[cellCoord.y][cellCoord.x];
//             matrix[cellCoord.y][cellCoord.x] = matrix[emptyCellCoord.y][emptyCellCoord.x];
//             matrix[emptyCellCoord.y][emptyCellCoord.x] = storage;
//             setPozitionMatrix(matrix);
//             count++;
//             moves.innerHTML = count;
//             cellClick.classList.remove('visibility');  
//             // cellClick.style.transition = 'transform 0.2s'
//         }
//     };

//     cellClick.addEventListener('dragstart', dragStart);
//     cellClick.addEventListener('dragend', dragEnd);

//     let empty;

//     cells.forEach(item => {
//         if(Number(item.textContent) === emtyNumber) {
//             empty = item;
//         }
//         console.log(empty)
//     })

//     // game.addEventListener('dragleave', dragLeave);
//     game.addEventListener('dragover', dragOver);
//     game.addEventListener('drop', drag);
// }

// game.addEventListener('mouseup', () => {
//     game.removeEventListener('drop', drag);
// })






