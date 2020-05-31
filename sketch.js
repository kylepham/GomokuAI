let boardDimension = 15; // a grid of cellDim * cellDim
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
let newScore = {
    'openTwo': 1000,
    'openThree': 100000,
    'cappedThree': 10000,
    'openFour': 1000000,
    'cappedFour': 100050,
    'gappedThree': 100000,
    'gappedFour': 100050,
    'consecutiveFive': 1000000000
}
let replay;
let prevCell = null;


function setup()
{
    createCanvas(600, 600);
    initialize();
    cellWidth = width / boardDimension;
    cellHeight = height / boardDimension;
}

function draw()
{
    background(230);
    drawEverything();

    let winner = findWinner();
    if (winner)
    {
        getButton("Player " + (winner === 1 ? "X" : "O") + " has won! \n Click here to replay");
        noLoop();
        return;
    }

    if (currentPlayer === ai)
    {
        validMoves = getValidMoves(board);
        shuffle(validMoves);
        // sortValidMoves(ai);
        checkValidMoves = new Array(validMoves.length + 2).fill(false);
        let [x, y] = ai_move(board);
        if (x !== undefined && y !== undefined)
            board[x][y] = getCurrentPlayer({x: x, y: y});

        validMoves = getValidMoves(board);
        if (validMoves.length === 0)
        {
            getButton("Draw! \n Click here to replay")
            noLoop();
            return;
        }
    }

    winner = findWinner();
    if (winner)
    {
        getButton("Player " + (winner === 1 ? "X" : "O") + " has won! \n Click here to replay");
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
    if (gappedFour_consecutiveFive(player)[1])
        return player;
    else if (gappedFour_consecutiveFive(ai)[1])
        return ai;
    return null;
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
    validMoves = getValidMoves(board);
    board[coord.x][coord.y] = getCurrentPlayer(coord);
}

function getButton(message)
{
    if (replay)
        replay.remove();
    replay = createButton(message);
    replay.size(600, 50);
    replay.mousePressed(replayGame);
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
    getButton("Replay!");
    loop();
}