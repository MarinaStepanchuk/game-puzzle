const defoultePosition = [
    [1,2,3,4,5],
    [6,7,8,9,10],
    [11,12,13,14,15],
    [16,17,18,19,20],
    [21,22,23,24,0]
];

const defoultewinnCombo =  [
    [1,2,3,4,5],
    [6,7,8,9,10],
    [11,12,13,14,15],
    [16,17,18,19,20],
    [21,22,23,24,0]
];

function getRandom() {
    if (Math.floor(Math.random() * 2) === 0) {
      return true;
    }
}

class Game {
    constructor(context, size, columnNum = 5, position = defoultePosition, winnCombo = defoultewinnCombo) {
        this.position = position;
        this.winnCombo = winnCombo;
        // this.context.fillStyle = "#333030"
        this.context = context;
        this.columnNum = columnNum;
        this.sizeCell = size / columnNum;
        this.clicks = 0;
    };

    getClicks() {
        return this.clicks
    };

    styleCell(x, y) {
        this.context.fillStyle = "#006363";
        this.context.fillRect(x + 1, y + 1, this.sizeCell - 2, this.sizeCell - 2);
        this.context.strokeStyle = '#00BFF5';

    };

    styleNumber() {
        this.context.font = "bold " + (this.sizeCell / 2) +"px Sans";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillStyle = "#FF9640";
    };

    draw() {
        for (let i = 0; i < this.columnNum; i++) {
            for (let j = 0; j < this.columnNum; j++) {
                if(this.position[i][j] > 0) {
                    this.styleCell(j * this.sizeCell, i * this.sizeCell);
                    this.styleNumber();
                    this.context.fillText(this.position[i][j], j * this.sizeCell + this.sizeCell / 2, i * this.sizeCell + this.sizeCell / 2);
                    this.context.fillStyle = "#000000"
                };
            };
        };
    };

    getEmptyCell () {
        for (let i = 0; i < this.columnNum; i++) {
            for (let j = 0; j < this.columnNum; j++) {
                if(this.position[j][i] === 0) {
                    return {x: i, y: j}
                }
            };
        };
    };

    move(x, y) {
        let emptyCell = this.getEmptyCell();
        let canVerticalMove = (x - 1 == emptyCell.x || x + 1 == emptyCell.x) && y == emptyCell.y;
        let canHorizontalMove = (y - 1 == emptyCell.y || y + 1 == emptyCell.y) && x == emptyCell.x;

        // if(canHorizontalMove) {
        //     this.context.clearRect(0, 0, canvas.width, canvas.height);
        //     this.context.fillRect(0, 0, canvas.width, canvas.height);
        //     this.draw(0, 0, 0, 0);
        // }

        if(canHorizontalMove || canVerticalMove) {
            this.position[emptyCell.y][emptyCell.x] = this.position[y][x];
            this.position[y][x] = 0;
            this.clicks++;
        };
    };

    winn() {
        let winnGame = true;
        console.log(this.columnNum)
        for (let i = 0; i < this.columnNum; i++) {
            for (let j = 0; j < this.columnNum; j++) {
                if(this.winnCombo[i][j] != this.position[i][j]) {
                    winnGame = false;
                    break;
                };
            };
        };
        return winnGame;
    };

    mix(count) {
        let x, y;
        for (let i = 0; i < count; i++) {
            let emptyCell = this.getEmptyCell();
            let moveVertical = getRandom();
            let upLeft = getRandom();

            if(moveVertical) {
                x = emptyCell.x;
                if (upLeft) {
                    y = emptyCell.y - 1;
                } else {
                    y = emptyCell.y + 1;
                }
            } else {
                y = emptyCell.y;
                if (upLeft) {
                    x = emptyCell.x - 1;
                } else {
                    x = emptyCell.x + 1;
                }
            }

            if (0 <= x && x <= this.columnNum - 1 && 0 <= y && y <= this.columnNum - 1) {
                this.move(x, y)
            }
        }
        this.clicks = 0;
    }
}

window.addEventListener('load', (event) => {
    let canvas = document.getElementById("canvas");
    // document.body.insertBefore(canvas, document.body.childNodes[0]);
    canvas.width = 620;
    canvas.height = 620;
    let context = canvas.getContext("2d");
    context.fillRect(0, 0, canvas.width, canvas.height);
    let size = canvas.width;
    let game = new Game(context, size);
    game.mix(canvas.width - 20);
    game.draw();

    canvas.onclick = function(e) {
        let x = (e.pageX - canvas.offsetLeft) / game.sizeCell | 0;
        let y = (e.pageY - canvas.offsetTop)  / game.sizeCell | 0;
        let x1 = e.pageY - canvas.offsetTop;
        let y1 = e.pageX - canvas.offsetTop;
        console.log(x1, y1)
        makeStep(x, y, x1, y1); 
    }

    function makeStep(x, y, x1, y1) {
        game.move(x, y);
        context.fillRect(0, 0, canvas.width, canvas.height);
        game.draw();
        if(game.winn()) {
            alert("Собрано за "+game.getClicks()+" касание!");
            game.mix(canvas.width - 20);
            context.fillRect(0, 0, canvas.width, canvas.height);
            game.draw()
        }
    }

    // canvas.addEventListener('dragstart', dragstart)

    // function dragstart(e) {
    //     dragSrcEl = this;
    //     e.dataTransfer.effectAllowed = 'move';
    //     e.dataTransfer.setData('text/html', this.innerHTML);
    // }

})

// document.addEventListener('click', (e) => {
//     console.log(e.target)
// })



// canvas.addEventListener('touchend', (e) => {
//     let x = (e.touches[0].pageX - canvas.offsetLeft) / sizeCell | 0;
//     let y = (e.touches[0].pageY - canvas.offsetTop)  / sizeCell | 0;
//     makeStep(x, y);
// })

