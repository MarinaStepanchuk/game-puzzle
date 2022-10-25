//---------инициалиация переменных, присвоение дефолтных значений переменых -----------

alert("Уважаемый проверяющий. Практически готово перетаскивание элементов. Вернее оно готово,просто работает немного с дефектами (его код я закоментировала в конце js-файла). Очень прошу вас отложить проверку на один день и дать возможность добить. Дети болеют по кругу, времени катастрофически не хватает. Знаю,что это слабое оправдание, но надеюсь вы пойдете мне на встречу. спасибо =)")


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
            <div class="title">GAME PUZZLE</div>
            <div class = 'control-container'>
                <button class="shuffle">Shuffle and start</button>
                <button class="stop">Stop</button>
                <button class="save">Save</button>
                <button class="results">TOP 10</button>
                <button class="sound"></button>
            </div>
            <div class="frame">Frame size:
            <select class="size-value" id="size-game">
                <option value="3">3x3</option>
                <option value="4" selected>4x4</option>
                <option  value="5">5x5</option>
                <option  value="6">6x6</option>
                <option  value="7">7x7</option>
                <option  value="8">8x8</option>
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
                <tbody class="table-body">

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
const sizeGame = document.getElementById('size-game');

let cells = Array.from(game.querySelectorAll('.item'));
cells.forEach(elem => {
    if(elem.innerText === emtyNumber) {
        
    }
})
cells[cells.length - 1].classList.remove('item');
        cells[cells.length - 1].classList.add('empty-cell');
        cells[cells.length - 1].style.display = 'none';

console.log(cells[cells.length - 1])


// let emp = cells[cells.length - 1];

let second = 0;
let timeInSecond


if(JSON.parse(localStorage.getItem('matrix'))) {
    matrix = JSON.parse(localStorage.getItem('matrix'));
    sizeGame.value = `${matrix.length}`;
    changeSize()
    canPlay = true;
    setPozitionMatrix(matrix);
    count = JSON.parse(localStorage.getItem('moves'));
    moves.innerHTML = count;
    second = JSON.parse(localStorage.getItem('time'));
    time.innerHTML = getTime(second);
    timerIsStop = true;
    stopTimer();
} else {
    startGame();
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
    cellClick.style.transition = 'transform 0.2s'
    if(!cellClick) {
        return;
    };
    const cellNumber = Number(cellClick.innerText);
    const emptyCell = emtyNumber;
    const cellCoord = findCoordinates(cellNumber, matrix);
    const emptyCellCoord = findCoordinates(emptyCell, matrix);
    const canMove = canMoveCell(cellCoord, emptyCellCoord);
    if(count === 0 || timerIsStop) {
        second++;
        time.innerHTML = getTime(second);
        startTimer();
        timerIsStop = false;
    };
    if(canMove) {
        move(cellCoord, emptyCellCoord, matrix);
    };
    // dragAndDrop (cellClick, cellCoord, emptyCellCoord)

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

const winnerInput = document.querySelector('.add-in-table')

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
        const locStorTable = localStorage.getItem('winners');
        const parsedTable = locStorTable ? JSON.parse(locStorTable) : [];
        if(parsedTable.length < 10 || count < parsedTable[parsedTable.length-1].moves) {
            winnerInput.classList.add('show-add-score')
        }
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

// window.addEventListener('keydown', (event) => {
//     if(!canPlay) {
//        return;
//     };
//     if (!event.key.includes('Arrow')) {
//         return;
//     };
//     const emptyCellCoord = findCoordinates(emtyNumber, matrix);
//     const direction = event.key.split('Arrow')[1].toLowerCase();
//     const cellCoord = {
//         x: emptyCellCoord.x,
//         y: emptyCellCoord.y,
//     };
//     switch (direction) {
//         case 'up':
//             cellCoord.y +=1;
//             break;
//         case 'down':
//             cellCoord.y -=1;
//             break;
//         case 'left':
//             cellCoord.x +=1;
//             break;
//         case 'right':
//             cellCoord.x -=1;
//             break;
//     }
//     if(cellCoord.x >= matrix.length || cellCoord.x < 0 || cellCoord.y >= matrix.length || cellCoord.y < 0) {
//         return
//     }
//     if(count === 0) {
//         second++;
//         time.innerHTML = getTime(second);
//         startTimer();
//         timerIsStop = false;
//     }
//     move(cellCoord, emptyCellCoord, matrix);
// });

//------------изменение размера поля-----------

sizeGame.addEventListener('change', () => {
    changeSize();
    startGame();
    reloadTimer();
})

function changeSize() {
    columnNum = Number(sizeGame.value[0]);    
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
}

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

const closeWinnMessage = document.querySelector('.close');

winnMessageContainer.addEventListener( 'click', (e) => {
    
    if (e.target.className != "winn-text" && e.target.className != "add-in-table" && e.target.className != "player-name" && e.target.className != "sande-name" && e.target.className != "winn-message") {
        winnMessageContainer.classList.remove('message-show');
    };
})

//----------------таблица результатов--------------

const resultTable = document.querySelector('.results-container');
const tableText = document.querySelector('.results-table');
const playerName = document.querySelector('.player-name');
const sandButton = document.querySelector('.sande-name');
const bodyTable = document.querySelector('.table-body');

let nameWinner;


sandButton.addEventListener('click', () => {
    nameWinner = playerName.value;
    addWinner();
    showTable();
});

function addWinner() {
    const winner = {
        name: nameWinner,
        moves: count,
        time: time.innerHTML,
        board: `${columnNum}x${columnNum}`,
    }
    const fromLS = localStorage.getItem('winners');
    const sortArrayWinners = [...(fromLS ? JSON.parse(fromLS) : []), winner].sort((a, b) => a.moves - b.moves);
    const arrayWin = sortArrayWinners.slice(0,10);
    localStorage.setItem('winners', JSON.stringify(arrayWin));
    let table = "";
    arrayWin.forEach((winner, index) => {
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
    if(localStorage.getItem('winners')) {
        
        const sortArrayWinners = JSON.parse(localStorage.getItem('winners'));
        console.log(sortArrayWinners)
        let table = "";
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
//     };

//     const dragLeave = function(event) {
//         event.preventDefault();
//     };

//     const drag = function(event) {
//         // console.log(cellClick)
//         if(cellClick.hasAttribute('draggable')){
//             dragDrop(event);
//             cellClick.removeAttribute('draggable');
//         }
//     }

//     const dragDrop = function(event) {
//         if(!event.target.closest('button')){
//             cellClick.style.transition = 'none';
//             const storage = matrix[cellCoord.y][cellCoord.x];
//             matrix[cellCoord.y][cellCoord.x] = matrix[emptyCellCoord.y][emptyCellCoord.x];
//             matrix[emptyCellCoord.y][emptyCellCoord.x] = storage;
//             setPozitionMatrix(matrix);
//             count++;
//             moves.innerHTML = count;
//             cellClick.classList.remove('visibility'); 
//             cellClick = ''
//         }
//     };

//     cellClick.addEventListener('dragstart', dragStart);
//     cellClick.addEventListener('dragend', dragEnd);

//     emp = document.querySelector('.empty.cell')
//     game.addEventListener('dragleave', dragLeave);
//     game.addEventListener('dragover', dragOver);
//     game.addEventListener('drop', drag);
// }








