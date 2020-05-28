let boardDimension = 20; // a grid of cellDim * cellDim
let board = [];
let player = 1;
let ai = -1;
let playerWin = 5;
let aiWin = -5;
let currentPlayer;
let cellWidth, cellHeight;
let validMoves = [];
let checkValidMoves = [];
let score = [0, 10, 200, 10000, 10005000, 10000000000];
let prevCell = null;


function setup()
{
    createCanvas(600, 600);
    initialize();
    cellWidth = width / boardDimension;
    cellHeight = height / boardDimension;
    let replay = createButton("Replay!");
    replay.size(600, 50);
    replay.mousePressed(replayGame);
}

function draw()
{
    background(230);
    drawEverything();

    let winner = findWinner();
    if (winner)
    {
        console.log(winner);
        noLoop();
        return;
    }

    if (currentPlayer === ai)
    {
        validMoves = getValidMoves(board);
        // sortValidMoves(ai);
        checkValidMoves = new Array(validMoves.length + 2).fill(false);
        let [x, y] = ai_move(board);
        if (!x && !y)
        {
            console.log("Game hoa`");
            noLoop();
            return;
        }
        console.log(x + " " + y);
        board[x][y] = getCurrentPlayer({x: x, y: y});
    }

    winner = findWinner();
    if (winner)
    {
        console.log(winner);
        noLoop();
        return;
    }
    
}

function drawEverything()
{
    drawBoard();
    drawGrid();
    drawMouseHover();
}

function drawGrid()
{
    strokeWeight(1);
    stroke(0, 0, 0, 30);
    fill(100);
    for (let i = 0; i <= boardDimension; i++)
    {
        line(cellWidth * i, 0, cellWidth * i, height);
        line(0, cellHeight * i, width, cellHeight * i);
    }
}

function drawMouseHover()
{
    let coord = getCoordinatorOnCell();

    fill(255, 127);
    strokeWeight(1);
    stroke(0, 0, 0, 30);
    rect(coord.x, coord.y, cellWidth, cellHeight);
}

function drawBoard()
{
    strokeWeight(4);
    let cell;
    if (prevCell) 
    {
        cell = getCoordinatorOnCellFromBoard(prevCell.x, prevCell.y);
        fill(219, 240, 109);
        strokeWeight(1);
        rect(cell.x, cell.y, cellWidth, cellHeight);
    }
    for (let i = 0; i < boardDimension; i++)
    {
        for (let j = 0; j < boardDimension; j++)
        {
            cell = getCoordinatorOnCellFromBoard(i, j);
            cell.x += cellWidth / 2;
            cell.y += cellHeight / 2;
            switch (board[i][j])
            {
                case 1: 
                    stroke(255, 0, 0);
                    strokeWeight(4);
                    let len = cellWidth / 4;
                    line(cell.x - len, cell.y - len, cell.x + len, cell.y + len);
                    line(cell.x + len, cell.y - len, cell.x - len, cell.y + len);
                    break;
                case -1:
                    stroke(0, 255, 20);
                    noFill();
                    strokeWeight(4);
                    ellipse(cell.x, cell.y, cellWidth / 2, cellHeight / 2);
            }
        }  
    } 
}

function getCoordinatorOnBoard()
{
    return {
        x: Math.trunc(mouseX / cellWidth), 
        y: Math.trunc(mouseY / cellHeight)
    };
}

function getCoordinatorOnCell()
{
    return {
        x: (Math.trunc(mouseX / cellWidth) * cellWidth), 
        y: (Math.trunc(mouseY / cellHeight) * cellHeight)
    };
}

function getCoordinatorOnCellFromBoard(i, j)
{
    return {
        x: Math.trunc(cellWidth * i), 
        y: Math.trunc(cellHeight * j)
    };
}

function getCurrentPlayer(coord)
{
    if (coord)
        prevCell = {
            x: coord.x,
            y: coord.y
        };
    currentPlayer = currentPlayer == player ? ai : player;
    return currentPlayer == player ? ai : player;
}

function findWinner()
{
    function checkHorizontal(x, y)
    {
        if (y + 4 >= boardDimension)
            return null;
        let s = 0;
        for (let i = y; i < y + 5; i++)
            if (board[x] != undefined)
                s += board[x][i];
        if (s === playerWin)
            return player;
        else if (s === aiWin)
            return ai;
        return null;
    }

    function checkVertical(x, y)
    {
        let s = 0;
        for (let i = x; i < x + 5; i++)
            if (board[x+i] != undefined)
                s += board[i][y];
        if (s === playerWin)
            return player;
        else if (s === aiWin)
            return ai;
        return null;
    }

    function checkDiagonal(x, y)
    {
        let s = 0;
        for (let i = 0; i < 5; i++)
            if (board[x+i] != undefined)
                s += board[x+i][y+i];
        if (s === playerWin)
            return player;
        else if (s === aiWin)
            return ai;
        s = 0;
        for (let i = 0; i < 5; i++)
            if (board[x+i] != undefined)
                s += board[x+i][y-i];
        if (s === playerWin)
            return player;
        else if (s === aiWin)
            return ai;
        return null;
    }
    let winner = null;
    for (let i = 0; i < boardDimension; i++)
    {
        for (let j = 0; j < boardDimension; j++)
        {
            winner = checkHorizontal(i, j);
            if (winner)
                return winner;
            winner = checkVertical(i, j);
            if (winner)
                return winner;
            winner = checkDiagonal(i, j); 
            if (winner)
                return winner;
        }
        if (winner)
            break;
    }
    return winner;
}

function replayGame()
{
    initialize();
}

function mousePressed()
{   
    let coord = getCoordinatorOnBoard();

    if (coord.x >= boardDimension || coord.y >= boardDimension || board[coord.x][coord.y] != 0)
        return;

    board[coord.x][coord.y] = getCurrentPlayer(coord);
}

function initialize()
{
    currentPlayer = player;
    board = [];
    for (let i = 0; i < boardDimension; i++)
    {
        board.push([]);
        for (let j = 0; j < boardDimension; j++)
            board[i].push(0);
    }
    prevCell = null;
    loop();
}