// //utils:
'use strict';

//-----------------------------------------------------
function createMat(size) {
    var mat = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            row.push({
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            })
        }
        mat.push(row)
    }
    return mat
}

//-----------------------------------------------------
function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {

            strHtml += `<td data-i="${i}" data-j="${j}" onclick="cellClicked(this,${i} , ${j})" oncontextmenu="cellMarked(this)" ></td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.board');
    elMat.innerHTML = strHtml;
}

//-----------------------------------------------------
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// -----------------------------------------------------
// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`[data-i="${location.i}"][data-j="${location.j}"]`);
    elCell.classList.add('marked');

    if (value === MINE) {

        elCell.classList.add('boom');
        elCell.innerHTML = value;
    } else if (value === 0) {

        elCell.innerHTML = '';
        showNeighbors(location.i, location.j, gBord);

    } else {

        elCell.innerHTML = value;

    }
}
//-----------------------------------------------------
function neighbors(cellI, cellJ, mat) {

    var countMeins = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {

        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (i === cellI && j === cellJ) continue;

            if (j < 0 || j >= mat[0].length) continue;

            if (mat[i][j].isMine === true) {

                countMeins++;
            }

        }
    }
    return countMeins;
}
//-----------------------------------------------------
function showNeighbors(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {

        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (i === cellI && j === cellJ) continue;

            if (j < 0 || j >= mat[0].length) continue;

            var location = { i: i, j: j }
            var value = mat[i][j].minesAroundCount;
            var elCell = document.querySelector(`[data-i="${location.i}"][data-j="${location.j}"]`);
            value = (value === 0) ? '' : value;

            if (!elCell.classList.contains('marked')) {

                elCell.classList.add('marked');
                ++gGame.shownCount;
            } 
            
            elCell.innerText = value;
            gBord[i][j].isShown = true;

        }
    }

}
//-----------------------------------------------------
function timer() {

    gTime = Date.now();

    var elCell = document.querySelector('.buttonTime span');
    elCell.innerText = 0;

    gGameOn = setInterval(function () {

        var time = (Date.now() - gTime)
        time = parseInt(time / 1000)
        elCell.innerText = time;
    }, 1000)

}
