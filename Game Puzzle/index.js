let columnNum = 4;
let matrix = new Array(columnNum ** 2).fill(0).map((item,index) => index + 1);

function addElements (div) {
    for (let i = 0; i < matrix.length; i++) {
        let item = document.createElement('button');
        item.classList.add('item');
        item.innerHTML = matrix[i];
        div.appendChild(item);
    }
}

function fillHtml() {
    let div = document.createElement('div');
    div.classList.add("game");
    document.body.appendChild(div);
    addElements(div);
}

window.addEventListener('load', (e) => {
    fillHtml()
})