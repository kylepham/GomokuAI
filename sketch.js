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
let ai_states;
let player_states;
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
        // validMoves.sort((aa, bb) => {
        //     let a = aa.tuple, b = bb.tuple; 
        //     board[a[0]][a[1]] = ai;
        //     let heuA = getGameState(getStatesOf(ai, ai_states, a[0], a[1]), getStatesOf(player, player_states, a[0], a[1])); 
        //     board[a[0]][a[1]] = 0;

        //     board[b[0]][b[1]] = ai;
        //     let heuB = getGameState(getStatesOf(ai, ai_states, b[0], b[1]), getStatesOf(player, player_states, b[0], b[1])); 
        //     board[b[0]][b[1]] = 0;
        //     // console.log(`${heuA} and ${heuB}`);
        //     return heuB - heuA;
        // }); 


        validMoves.sort((aa, bb) => {
            let movei = aa.tuple, movej = bb.tuple; 
            let heuA, heuB;
            let newSA = ai_states, newSP = player_states;

            board[movei[0]][movei[1]] = ai;
            newSA = getStatesOf(ai, newSA, movei[0], movei[1]);
            newSP = getStatesOf(player, newSP, movei[0], movei[1]);
            board[movej[0]][movej[1]] = player;
            newSA = getStatesOf(ai, newSA, movej[0], movej[1]);
            newSP = getStatesOf(player, newSP, movej[0], movej[1]);
            heuA = getGameState(newSA, newSP);
            board[movei[0]][movei[1]] = 0; 
            board[movej[0]][movej[1]] = 0;
            
            
            newSA = ai_states, newSP = player_states; 
            board[movej[0]][movej[1]] = ai;
            newSA = getStatesOf(ai, newSA, movej[0], movej[1]);
            newSP = getStatesOf(player, newSP, movej[0], movej[1]);
            board[movei[0]][movei[1]] = player;
            newSA = getStatesOf(ai, newSA, movei[0], movei[1]);
            newSP = getStatesOf(player, newSP, movei[0], movei[1]);
            heuB = getGameState(newSA, newSP);
            board[movei[0]][movei[1]] = 0; 
            board[movej[0]][movej[1]] = 0;

            return heuB - heuA;
        });
        



        // for (let i = 0; i < validMoves.length; i++)
        //     for (let j = i+1; j < validMoves.length; j++)
        //     {
        //         let heuA, heuB;
        //         let movei = validMoves[i].tuple, movej = validMoves[j].tuple;
        //         let newSA = ai_states, newSP = player_states;

        //         board[movei[0]][movei[1]] = ai;
        //         newSA = getStatesOf(ai, newSA, movei[0], movei[1]);
        //         newSP = getStatesOf(player, newSP, movei[0], movei[1]);
        //         board[movej[0]][movej[1]] = player;
        //         newSA = getStatesOf(ai, newSA, movej[0], movej[1]);
        //         newSP = getStatesOf(player, newSP, movej[0], movej[1]);
        //         heuA = getGameState(newSA, newSP);
        //         board[movei[0]][movei[1]] = 0; 
        //         board[movej[0]][movej[1]] = 0;
                
                
        //         newSA = ai_states, newSP = player_states; 
        //         board[movej[0]][movej[1]] = ai;
        //         newSA = getStatesOf(ai, newSA, movej[0], movej[1]);
        //         newSP = getStatesOf(player, newSP, movej[0], movej[1]);
        //         board[movei[0]][movei[1]] = player;
        //         newSA = getStatesOf(ai, newSA, movei[0], movei[1]);
        //         newSP = getStatesOf(player, newSP, movei[0], movei[1]);
        //         heuB = getGameState(newSA, newSP);
        //         board[movei[0]][movei[1]] = 0; 
        //         board[movej[0]][movej[1]] = 0;


        //         if (heuA < heuB)
        //             [validMoves[i], validMoves[j]] = [validMoves[j], validMoves[i]];
        //     }
        // shuffle(validMoves);
        console.log(validMoves);
        console.log(ai_states);
        console.log(player_states);
        checkValidMoves = new Array(validMoves.length + 2).fill(false);
        // console.log(validMoves);
        let [x, y] = ai_move(board);
        if (x !== undefined && y !== undefined)
        {
            board[x][y] = getCurrentPlayer({x: x, y: y});
            ai_states = getStatesOf(ai, ai_states);
            player_states = getStatesOf(player, player_states);
        }

        validMoves = getValidMoves(board);
        if (validMoves.length === 0)
        {
            getButton("Draw! \n Click here to replay")
            noLoop();
            return;
        }
    }

    // winner = findWinner();
    // if (winner)
    // {
    //     getButton("Player " + (winner === 1 ? "X" : "O") + " has won! \n Click here to replay");
    //     noLoop();
    //     return;
    // }
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
        x: Math.trunc(mouseY / cellWidth), 
        y: Math.trunc(mouseX / cellHeight)
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
        x: Math.trunc(cellWidth * j), 
        y: Math.trunc(cellHeight * i)
    };
}

function getCurrentPlayer(coord)
{
    if (coord)
        prevCell = {
            x: coord.x,
            y: coord.y
        };
    currentPlayer = currentPlayer === player ? ai : player;
    return currentPlayer === player ? ai : player;
}

function findWinner()
{
    if (player_states['consecutiveFive'] !== 0)
        return player;
    else if (ai_states['consecutiveFive'] !== 0)
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
    
    board[coord.x][coord.y] = getCurrentPlayer(coord);
    // update/refresh to global states
    player_states = getStatesOf(player, player_states);
    ai_states = getStatesOf(ai, ai_states);
    // console.log(ai_states);
    // console.log(player_states);
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
    ai_states = {
        'openTwo': 0,
        'openThree': 0,
        'cappedThree': 0,
        'openFour': 0,
        'cappedFour': 0,
        'gappedThree': 0,
        'gappedFour': 0,
        'consecutiveFive': 0
    }
    player_states = {
        'openTwo': 0,
        'openThree': 0,
        'cappedThree': 0,
        'openFour': 0,
        'cappedFour': 0,
        'gappedThree': 0,
        'gappedFour': 0,
        'consecutiveFive': 0
    }
    prevCell = null;
    getButton("Replay!");
    loop();
}