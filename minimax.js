/**
 * @param board A board matrix
 * @returns A list of valid moves to feed the Minimax Algorithm
 */
function getValidMoves(board)
{
    function isValid(x, y)
    {
        if (x < 0 || x >= boardDimension ||  y < 0 || y >= boardDimension || board[x][y] != 0)
            return false;
        return true;
    }

    /**
     * @param x 
     * @param y 
     * @returns A list of 3x3 (possible) moves
     */
    function retrieve(x, y)
    {
        let lis = [];
        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++)
                if (isValid(x + i, y + j))
                    lis.push([x + i, y + j]);
        return lis;
    }

    let check = [];
    let id = 0;
    for (let i = 0; i <= boardDimension; i++)
        check.push(new Array(boardDimension + 1).fill(false));
    let lis = [];
    for (let i = 0; i < boardDimension; i++)
        for (let j = 0; j < boardDimension; j++)
            if (board[i][j] != "")
                retrieve(i, j).forEach(tuple => {
                        if (!check[tuple[0]][tuple[1]])
                        {
                            lis.push({id: ++id, tuple: tuple});
                            check[tuple[0]][tuple[1]] = true;
                        }
                });
    return lis;
}

/* Game Logic From Here */
function checkHorizontal(x, y)
{
    let oppo = 0, prop = 0;
    for (let i = y; i < y + 5; i++)
        if (board[i] !== undefined)
        {
            prop += board[x][i] === ai;
            oppo += board[x][i] === player;
        }
    return [prop, oppo];
}

function checkVertical(x, y)
{
    let oppo = 0, prop = 0;
    for (let i = x; i < x + 5; i++)
        if (board[i] !== undefined)
        {
            // console.log(i + " " + y);
            prop += board[i][y] === ai;
            oppo += board[i][y] === player;
        }
    return [prop, oppo];
}

function checkDiagonal(x, y)
{
    function rightDiagonal()
    {
        let oppo = 0, prop = 0;
        for (let i = 0; i < 5; i++)
            if (board[x+i] !== undefined)
            {
                prop += board[x+i][y+i] === ai;
                oppo += board[x+i][y+i] === player;
            }
        return [prop, oppo];
    }
    
    function leftDiagonal()
    {
        let oppo = 0, prop = 0;
        for (let i = 0; i < 5; i++)
        if (board[x+i] !== undefined)
            {
                prop += board[x+i][y-i] === ai;
                oppo += board[x+i][y-i] === player;
            }
        return [prop, oppo];
    }
    return [leftDiagonal(), rightDiagonal()];
}

function checkThreeFourFive(currentP)
{
    let cnt3 = 0, cnt4 = 0, cnt5 = 0;
    for (let i = 0; i < boardDimension; i++)
        for (let j = 0; j < boardDimension; j++)
        {
            let prop, oppo;
            [prop, oppo] = checkHorizontal(i, j);
            if (currentP === player) 
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && oppo === 1)
                cnt3++;
            if (prop === 3 && oppo === 0)
                cnt3 += 2;
            if (prop === 4 && oppo === 1)
                cnt4++;
            if (prop === 4 && oppo === 0)
                cnt4 += 2;
            if (prop === 5)
                cnt5++;
            [prop, oppo] = checkVertical(i, j);
            if (currentP === player) 
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && oppo === 1)
                cnt3++;
            if (prop === 3 && oppo === 0)
                cnt3 += 2;
            if (prop === 4 && oppo === 1)
                cnt4++;
            if (prop === 4 && oppo === 0)
                cnt4 += 2;
            if (prop === 5)
                cnt5++;
            [left, right] = checkDiagonal(i, j);
            [prop, oppo] = left;
            if (currentP === player) 
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && oppo === 1)
                cnt3++;
            if (prop === 3 && oppo === 0)
                cnt3 += 2;
            if (prop === 4 && oppo === 1)
                cnt4++;
            if (prop === 4 && oppo === 0)
                cnt4 += 2;
            if (prop === 5)
                cnt5++;
            [prop, oppo] = right;
            if (currentP === player) 
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && oppo === 1)
                cnt3++;
            if (prop === 3 && oppo === 0)
                cnt3 += 2;
            if (prop === 4 && oppo === 1)
                cnt4++;
            if (prop === 4 && oppo === 0)
                cnt4 += 2;
            if (prop === 5)
                cnt5++;
        }
    return [cnt3, cnt4, cnt5];
}

function checkOne(currentP)  
{
    const distance = (x, y) => Math.hypot(x - boardDimension / 2, y - boardDimension / 2);
    let X = [-1, -1, -1, 0, 1, 1, 1, 0];
    let Y = [-1, 0, 1, 1, 1, 0, -1, -1];
    let cnt1 = 0;
    for (let i = 1; i < boardDimension - 1; i++)
        for (let j = 1; j < boardDimension - 1; j++)
            if (board[i][j] === currentP)
                cnt1 += distance(i, j);
    // console.log(cnt1);
    return cnt1;
}

// function sortValidMoves(currentP)
// {
//     let moveScore = Array(boardDimension + 1).fill(0);
//     for (let i = 0; i < validMoves.length; i++)
//     {
//         let move = validMoves[i];
//         board[move.tuple[0]][move.tuple[1]] = currentP;
//         moveScore[move.id] = checkThreeFourFive(currentP).reduce((a, b) => {
//             return a + b;
//         }, 0);
//         board[move.tuple[0]][move.tuple[1]] = 0;
//     }
//     if (currentP === ai)
//         validMoves.sort((a, b) => moveScore[b.id] - moveScore[a.id]);
//     else
//         validMoves.sort((a, b) => moveScore[a.id] - moveScore[b.id]);
// }

function getGameState()
{
    let [ai_checkThree, ai_checkFour, ai_checkFive] = checkThreeFourFive(ai);
    let [player_checkThree, player_checkFour, player_checkFive] = checkThreeFourFive(player);
    let ai_checkOne = checkOne(ai);
    let player_checkOne = checkOne(player);

    return score[3] * ai_checkThree * 3
        + score[4] * ai_checkFour * 4
        + score[5] * ai_checkFive
        // + player_checkOne
        - score[3] * player_checkThree * 3 
        - score[4] * player_checkFour * 4 
        - score[5] * player_checkFive;
}

function ai_move(board)
{
    let best = -1000000000000000;
    let coordinate = [];
    for (let i = 0; i < validMoves.length; i++)
    {
        let move = validMoves[i];
        checkValidMoves[move.id] = true;
        board[move.tuple[0]][move.tuple[1]] = ai;
        let score = minimax(board, false);
        board[move.tuple[0]][move.tuple[1]] = 0;
        checkValidMoves[move.id] = false;
        if (best < score)
        {
            coordinate = move.tuple;
            best = score;
        }
    }
    console.log("choose " + coordinate);
    return coordinate;
}

function minimax(board, isMaximizing, alpha = -10000000000000, beta = 10000000000000, depth = 1)
{
    let winner = findWinner();
    if (winner !== null)
    {
        if (isMaximizing)
        {
            if (winner === 1)
                return 10000000000000;
            else
                return -10000000000000;
        }
        else
        {
            if (winner === 1)
                return -10000000000000;
            else
                return 10000000000000;    
        }
    }
        
    if (depth === 0)
        return getGameState();
    
    let best = isMaximizing ? -10000000000000 : 10000000000000;
    for (let i = 0; i < validMoves.length; i++)
        if (!checkValidMoves[validMoves[i].id])
        {
            let move = validMoves[i];
            checkValidMoves[move.id] = true;
            board[move.tuple[0]][move.tuple[1]] = isMaximizing ? ai : player;
            // let cloneSort = [...validMoves];
            // isMaximizing ? sortValidMoves(ai) : sortValidMoves(player);
            let score = minimax(board, !isMaximizing, alpha, beta, depth - 1);
            // validMoves = [...cloneSort];
            board[move.tuple[0]][move.tuple[1]] = 0;
            checkValidMoves[move.id] = false;
            best = isMaximizing ? max(best, score) : min(best, score);
            if (isMaximizing)
                alpha = max(alpha, best);
            else
                beta = min(beta, best);
            if (beta <= alpha)
                break;
            // console.log(alpha + " " + beta);
        }
    return best;
}
