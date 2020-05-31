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
     * @returns A list of 3x3 (possible) moves from the center cell
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

/**
 * @param {*} x row-th
 * @param {*} y column-th
 * @param {*} next number of moves to be checked forward
 * @returns An array of 2 elements representing number of proponents and opponents
 */
function checkHorizontal(x, y, next)
{
    let oppo = 0, prop = 0;
    for (let i = y; i < y + next; i++)
        if (board[x][i] !== undefined)
        {
            prop += board[x][i] === ai;
            oppo += board[x][i] === player;
        }
    return [prop, oppo];
}

/**
 * @param {*} x row-th
 * @param {*} y column-th
 * @param {*} next number of moves to be checked forward
 * @returns An array of 2 elements representing number of proponents and opponents
 */
function checkVertical(x, y, next)
{
    let oppo = 0, prop = 0;
    for (let i = x; i < x + next; i++)
        if (board[i] !== undefined)
        {
            prop += board[i][y] === ai;
            oppo += board[i][y] === player;
        }
    return [prop, oppo];
}

/**
 * @param {*} x row-th
 * @param {*} y column-th
 * @param {*} next number of moves to be checked forward
 * @returns An array of 2 elements representing the number of proponents and opponents
 */
function checkDiagonal(x, y, next)
{
    function rightDiagonal()
    {
        let oppo = 0, prop = 0;
        for (let i = 0; i < next; i++)
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
        for (let i = 0; i < next; i++)
        if (board[x+i] !== undefined)
            {
                prop += board[x+i][y-i] === ai;
                oppo += board[x+i][y-i] === player;
            }
        return [prop, oppo];
    }
    return [leftDiagonal(), rightDiagonal()];
}

/**
 * 
 * @param {*} currentP The player that open-2 patterns respect to
 * @returns The number of open-2 patterns with respect to 'currentP'
 */
function openTwo(currentP)
{
    let res = 0
    for (let i = 0; i < boardDimension; i++)
        for (let j = 0; j < boardDimension; j++)
        {
            let [prop, oppo] = checkHorizontal(i, j, 2);
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 2 && board[i][j-1] === 0 &&  board[i][j+2] === 0)
                res++;
            
            [prop, oppo] = checkVertical(i, j, 2);
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 2 && board[i-1] && board[i+2] && board[i-1][j] === 0 && board[i+2][j] === 0)
                res++;
            
            [left, right] = checkDiagonal(i, j, 2);
            [prop, oppo] = left;
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 2 && board[i-1] && board[i+2] && board[i-1][j+1] === 0 && board[i+2][j-2] === 0)
                res++;
            [prop, oppo] = right;
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 2 && board[i-1] && board[i+2] && board[i-1][j-1] === 0 && board[i+2][j+2] === 0)
                res++;
        }
    return res;
}

/**
 * 
 * @param {*} currentP The player that open-3 and capped-3 patterns respect to
 * @returns An array representing the number of open-3 and capped-3 patterns with respect to 'currentP'
 */
function open_capped_Three(currentP)
{
    let reso3 = 0, resc3 = 0;
    for (let i = 0; i < boardDimension; i++)
        for (let j = 0; j < boardDimension; j++)
        {
            let [prop, oppo] = checkHorizontal(i, j, 3);
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && board[i][j-1] === 0 && board[i][j+3] === 0)
                reso3++;
            if (prop === 3 && board[i][j-1] + board[i][j+3] === -1 * currentP)
                resc3++;
            
            [prop, oppo] = checkVertical(i, j, 3);
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && board[i-1] && board[i+3] && board[i-1][j] === 0 && board[i+3][j] === 0)
                reso3++;
            if (prop === 3 && board[i-1] && board[i+3] && board[i-1][j] + board[i+3][j] === -1 * currentP)
                resc3++;
            
            [left, right] = checkDiagonal(i, j, 3);
            [prop, oppo] = left;
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && board[i-1] && board[i+3] && board[i-1][j+1] === 0 && board[i+3][j-3] === 0)
                reso3++;
            if (prop === 3 && board[i-1] && board[i+3] && board[i-1][j+1] + board[i+3][j-3] === -1 * currentP)
                resc3++;
            [prop, oppo] = right;
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && board[i-1] && board[i+3] && board[i-1][j-1] === 0 && board[i+3][j+3] === 0)
                reso3++;
            if (prop === 3 && board[i-1] && board[i+3] && board[i-1][j-1] + board[i+3][j+3] === -1 * currentP)
                resc3++;
        }
    return [reso3, resc3];
}

/**
 * 
 * @param {*} currentP The player that open-4 and capped-4 patterns respect to
 * @returns An array representing the number of open-4 and capped-4 patterns with respect to 'currentP'
 */
function open_capped_Four(currentP)
{
    let reso4 = 0, resc4 = 0;
    for (let i = 0; i < boardDimension; i++)
        for (let j = 0; j < boardDimension; j++)
        {
            let [prop, oppo] = checkHorizontal(i, j, 4);
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 4 && board[i][j-1] === 0 && board[i][j+4] === 0)
                reso4++;
            if (prop === 4 && board[i][j-1] + board[i][j+4] === -1 * currentP)
                resc4++;
            
            [prop, oppo] = checkVertical(i, j, 4);
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 4 && board[i-1] && board[i+4] && board[i-1][j] === 0 && board[i+4][j] === 0)
                reso4++;
            if (prop === 4 && board[i-1] && board[i+4] && board[i-1][j] + board[i+4][j] === -1 * currentP)
                resc4++;
            
            [left, right] = checkDiagonal(i, j, 4);
            [prop, oppo] = left;
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 4 && board[i-1] && board[i+4] && board[i-1][j+1] === 0 && board[i+4][j-4] === 0)
                reso4++;
            if (prop === 4 && board[i-1] && board[i+4] && board[i-1][j+1] + board[i+4][j-4] === -1 * currentP)
                resc4++;
            [prop, oppo] = right;
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 4 && board[i-1] && board[i+4] && board[i-1][j-1] === 0 && board[i+4][j+4] === 0)
                reso4++;
            if (prop === 4 && board[i-1] && board[i+4] && board[i-1][j-1] + board[i+4][j+4] === -1 * currentP)
                resc4++;
        }
    return [reso4, resc4];
}

/**
 * 
 * @param {*} currentP The player that gapped-3 patterns respect to
 * @returns An array representing the number of gapped-3 patterns with respect to 'currentP'
 */
function gappedThree(currentP)
{
    let res = 0;
    for (let i = 0; i < boardDimension; i++)
        for (let j = 0; j < boardDimension; j++)
        {
            let [prop, oppo] = checkHorizontal(i, j, 4);
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && oppo === 0 && board[i][j] === currentP && board[i][j+3] === currentP && board[i][j-1] === 0 && board[i][j+4] === 0)
                res++;
            
            [prop, oppo] = checkVertical(i, j, 4);
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && oppo === 0 && board[i-1] && board[i+4] && board[i][j] === currentP && board[i+3][j] === currentP && board[i-1][j] === 0 && board[i+4][j] === 0)
                res++;
            
            [left, right] = checkDiagonal(i, j, 4);
            [prop, oppo] = left;
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && oppo === 0 && board[i-1] && board[i+4] && board[i][j] === currentP && board[i+3][j-3] === currentP && board[i-1][j+1] === 0 && board[i+4][j-4] === 0)
                res++;
            [prop, oppo] = right;
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 3 && oppo === 0 && board[i-1] && board[i+4] && board[i][j] === currentP && board[i+3][j+3] === currentP && board[i-1][j-1] === 0 && board[i+4][j+4] === 0)
                res++;
        }
    return res;
}

/**
 * 
 * @param {*} currentP The player that gapped-4 and consecutive-5 patterns respect to
 * @returns An array representing the number of  gapped-4 and consecutive-5 patterns with respect to 'currentP'
 */
function gappedFour_consecutiveFive(currentP)
{
    let resg4 = 0, resc5 = 0;
    for (let i = 0; i < boardDimension; i++)
        for (let j = 0; j < boardDimension; j++)
        {
            let [prop, oppo] = checkHorizontal(i, j, 5);
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 4 && oppo === 0 && board[i][j] === currentP && board[i][j+4] === currentP && board[i][j-1] + board[i][j+5] !== -2 * currentP)
                resg4++;
            if (prop === 5 && board[i][j-1] + board[i][j+5] !== -2 * currentP)
                resc5++;
            
            [prop, oppo] = checkVertical(i, j, 5);
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 4 && oppo === 0 && board[i-1] && board[i+5] && board[i][j] === currentP && board[i+4][j] === currentP && board[i-1][j] + board[i+5][j] !== -2 * currentP)
                resg4++;
            if (prop === 5 && board[i-1] && board[i+5] && board[i-1][j] + board[i+5][j] !== -2 * currentP)
                resc5++;
            
            [left, right] = checkDiagonal(i, j, 5);
            [prop, oppo] = left;
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 4 && oppo === 0 && board[i-1] && board[i+5] && board[i][j] === currentP && board[i+4][j-4] === currentP && board[i-1][j+1] + board[i+5][j-5] !== -2 * currentP)
                resg4++;
            if (prop === 5 && board[i-1] && board[i+5] && board[i-1][j+1] + board[i+5][j-5] !== -2 * currentP)
                resc5++;
            [prop, oppo] = right;
            if (currentP === player)
                [prop, oppo] = [oppo, prop];
            if (prop === 4 && oppo === 0 && board[i-1] && board[i+5] && board[i][j] === currentP && board[i+4][j+4] === currentP && board[i-1][j-1] + board[i+5][j+5] !== -2 * currentP)
                resg4++;
            if (prop === 5 && board[i-1] && board[i+5] && board[i-1][j-1] + board[i+5][j+5] !== -2 * currentP)
                resc5++;
        }
    return [resg4, resc5];
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

function getGameState(option=1)
{
    let ai_checkOne = checkOne(ai);
    let player_checkOne = checkOne(player);

    if (option === 1) // more precise
    {
        let [o2_ai, [o3_ai, c3_ai], g3_ai, [o4_ai, c4_ai], [g4_ai, c5_ai]] = [openTwo(ai), open_capped_Three(ai), gappedThree(ai), open_capped_Four(ai), gappedFour_consecutiveFive(ai)];
        let [o2_player, [o3_player, c3_player], g3_player, [o4_player, c4_player], [g4_player, c5_player]] = [openTwo(player), open_capped_Three(player), gappedThree(player), open_capped_Four(player), gappedFour_consecutiveFive(player)];
        
        return newScore['openTwo'] * (o2_ai - o2_player)
            + newScore['openThree'] * (o3_ai - o3_player)
            + newScore['gappedThree'] * (g3_ai - g3_player)
            + newScore['cappedThree'] * (c3_ai - c3_player)
            + newScore['openFour'] * (o4_ai - o4_player)
            + newScore['gappedFour'] * (g4_ai - g4_player)
            + newScore['cappedFour'] * (c4_ai - c4_player)
            + newScore['consecutiveFive'] * (c5_ai - c5_player)
            + ai_checkOne - player_checkOne;
    }
    else if (option === 2) // less precise
    {
        let [ai_checkThree, ai_checkFour, ai_checkFive] = checkThreeFourFive(ai);
        let [player_checkThree, player_checkFour, player_checkFive] = checkThreeFourFive(player);

        return score[3] * ai_checkThree * 3
            + score[4] * ai_checkFour * 4
            + score[5] * ai_checkFive
            - score[3] * player_checkThree * 3 
            - score[4] * player_checkFour * 4 
            - score[5] * player_checkFive
            + ai_checkOne - player_checkOne;
    }
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
    // console.log("choose " + coordinate);
    return coordinate;
}

function minimax(board, isMaximizing, alpha = -10000000000000, beta = 10000000000000, depth = 1)
{       
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
        }
    return best;
}
