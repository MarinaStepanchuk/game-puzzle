const defoultePosition = [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,0]
];

const defoultewinnCombo =  [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,0]
];

function getRandom() {
    if (Math.floor(Math.random() * 2) === 0) {
      return true;
    }
  }

class Game {
    constructor(context, size, columnNum = 4, position = defoultePosition, winnCombo = defoultewinnCombo) {
        this.position = position;
        this.winnCombo = winnCombo;
        this.color = "#000000";
        this.context = context;
        this.columnNum = columnNum
        this.sizeCell = size / columnNum;
        this.clicks = 0;
    };

    getClicks() {
        return this.clicks
    };

    styleCell(x, y) {
        this.context.fillStyle = "#09873c";
        this.context.fillRect(x + 1, y + 1, this.sizeCell - 2, this.sizeCell - 2);
    };

    styleNumber() {
        this.context.font = "bold " + (this.sizeCell / 2) +"px Sans";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillStyle = "#ebf2ee";
    };

    draw() {
        for (let i = 0; i < this.columnNum; i++) {
            for (let j = 0; j < this.columnNum; j++) {
                if(this.position[i][j] > 0) {
                    this.styleCell(j * this.sizeCell, i * this.sizeCell);
                    this.styleNumber();
                    this.context.fillText(this.position[i][j], j * this.sizeCell + this.sizeCell / 2, i * this.sizeCell + this.sizeCell / 2)
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

        if(canHorizontalMove || canVerticalMove) {
            this.position[emptyCell.y][emptyCell.x] = this.position[y][x];
            this.position[y][x] = 0;
            this.clicks++;
        };
    };

    win() {
        let result = true;
        for (let i = 0; i < this.columnNum; i++) {
            for (let j = 0; j < this.columnNum; j++) {
                if(this.winnCombo[i][j] != this.position[i][j]) {
                    return result = false;
                };
            };
        };
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