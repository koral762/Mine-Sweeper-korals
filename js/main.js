'use struct'

const MINE = '💣';
const FLAG = '🚩';

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBord = [];
var gClickCou;
var gCellI;
var gCellJ;
var gMines = [];
var gLifeCou;
var gTime = 0;
var gGameOn = '';


function init() {
    gTime = 0;
    gGame.shownCount = 0;
    gClickCou = 0;
    gLifeCou = 0;
    gBord = createMat(gLevel.SIZE);
    renderBoard(gBord);
    console.log(gBord);
    clearInterval(gGameOn);
    var elCell = document.querySelector('.buttonTime span');
    elCell.innerText = 0;
    setLife();
}

function startGame(elLevel) {

    var elSmiley = document.querySelector('.buttonSc span');
    elSmiley.innerText = '🙂';

    switch (elLevel.innerText) {

        case 'Beginner':
            gGame.isOn = true,
                gLevel.SIZE = 4
            gLevel.MINES = 2;
            break;

        case 'Medium':
            gGame.isOn = true,
                gLevel.SIZE = 8
            gLevel.MINES = 12;
            break;

        case 'Expert':
            gGame.isOn = true,
                gLevel.SIZE = 12
            gLevel.MINES = 30;
            break;

    }
    var elBombs = document.querySelector('.bombs span');
    elBombs.innerText = gLevel.MINES;

    init();
}

function cellClicked(elCell, cellI, cellJ) {
    gClickCou += 1;

    ++gGame.markedCount;

    gCellI = +elCell.getAttribute('data-i');
    gCellJ = +elCell.getAttribute('data-j');

    if (!gGame.isOn) { return };
    if (gBord[gCellI][gCellJ].isShown) { return };

    if (gClickCou === 1) {
        timer();
        for (var i = 0; i < gLevel.MINES; i++) {

            setMinesNegsCount();
        }
        setNumbersInBoard();
    }
    var location = { i: cellI, j: cellJ };

    if (!gBord[gCellI][gCellJ].isMine) {
        // update the DOM
        gGame.shownCount++;
        var numOfMeins = gBord[gCellI][gCellJ].minesAroundCount;
        renderCell(location, numOfMeins);

    } else {
        ++gLifeCou;
        var elLife = document.getElementById(`${gLifeCou}`);
        elLife.innerText = '';
        renderCell(location, MINE);
        if (gLevel.MINES < 3) {

            if (gLifeCou === 2) { gameOver(); };

        } else {

            if (gLifeCou === 3) { gameOver(); };
        }
        var elBombs = document.querySelector('.bombs span');
        elBombs.innerText = gLevel.MINES - 1;

    }
    gBord[gCellI][gCellJ].isShown = true;

    if (gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES) {
        win();
    }
}

function gameOver() {

    clearInterval(gGameOn);
    gGame.isOn = false;

    var elSmiley = document.querySelector('.buttonSc span');
    elSmiley.innerText = '😭';
    clearInterval(gGameOn);
    console.log('GAME OVER');
    var elMines = document.querySelectorAll('.mine');
    for (var i = 0; i < elMines.length; i++) {
        elMines[i].classList.remove('mine');
    }
}

function win() {

    clearInterval(gGameOn);
    var elSmiley = document.querySelector('.buttonSc span');
    elSmiley.innerText = '😃';
    alert('wwwiiinnnn');
}

function hints(key) {
    
    key.innerText = '🔮';

}

function cellMarked(elCell) {
    

    var iCell = elCell.getAttribute('data-i')
    var jCell = elCell.getAttribute('data-j')
    if (gBord[iCell][jCell].isShown) { return };

    var check = gBord[iCell][jCell].isMarked;

    //update the model 
    gBord[iCell][jCell].isMarked = (check) ? false : true;
    //update the DOM
    if (!check) {

        var location = { i: iCell, j: jCell };
        renderCell(location, FLAG);
    } else if (elCell.innerText === FLAG) {
        alert('yess');
    }
}

function setMinesNegsCount() {

    var meinI = getRandomInt(0, gLevel.SIZE);
    var meinJ = getRandomInt(0, gLevel.SIZE);

    while (gCellI === meinI && gCellJ === meinJ) {
        var meinI = getRandomInt(0, gLevel.SIZE);
        var meinJ = getRandomInt(0, gLevel.SIZE);
    }

    var location = { i: meinI, j: meinJ };

    //check double location
    if (gBord[meinI][meinJ].isMine !== true) {

        //update the model 
        gBord[meinI][meinJ].isMine = true;
        // update the DOM
        var elCell = document.querySelector(`[data-i="${location.i}"][data-j="${location.j}"]`);
        var strHtml = `<td data-i="${meinI}" data-j="${meinJ}" onclick="cellClicked(this,${meinI} , ${meinJ})" oncontextmenu="cellMarked(this)" ><span class="mine">${MINE}</span></td>`
        elCell.innerHTML = strHtml;
        //input to arry
        gMines.push(elCell);

    } else {
        setMinesNegsCount();
    }
}

function setNumbersInBoard() {

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {

            var numOfMeins = neighbors(i, j, gBord);
            if (gBord[i][j].isMine === true) continue;

            //update the model
            gBord[i][j].minesAroundCount = numOfMeins
        }
    }
}

function setLife() {


    for (var i = 3; i < 6; i++) {

        var elHint = document.getElementById(`${i + 1}`)
        elHint.innerHTML = '🔑';
    }

    for (var i = 0; i < gLevel.MINES; i++) {
        if (i === 3) return;

        var elBody = document.getElementById(`${i + 1}`)
        elBody.innerHTML = '💖';
    }

}

