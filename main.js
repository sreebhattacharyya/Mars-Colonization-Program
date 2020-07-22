const Player = (name, symbol) =>
{
    let wins = 0;
    return {name,symbol,wins};
}
const gameBoard = (() =>
    {
        let boardArray = Array(9).fill("");
        let player1 = Player("Player 1", "X");
        let player2 = Player("Player 2", "O");
        let gameDiff = 5;
        let currPlayer;
        let gameMoves = 9;
        return {boardArray, player1, player2, currPlayer, gameDiff,gameMoves};
    }) ();

const displayController = ((doc) =>
    {
        const subbtn = doc.getElementById('sub');
        const render = function()
        {
                const cells = doc.querySelectorAll(".cell");
                cells.forEach((cell) => {
                    cell.addEventListener("click", (e) => {
                        console.log(e);
                        if (e.target.innerHTML === "" && gameControls.gameFinish === 0) {
                            e.target.innerHTML = gameBoard.currPlayer.symbol;
                            gameBoard.boardArray[Number(e.target.classList[1])] = gameBoard.currPlayer.symbol;
                            console.log(Number(e.target.classList[1]));
                            gameBoard.gameMoves -= 1;
                            gameControls.checkWin();
                            setTimeout(() => {
                                gameControls.playAI();
                            }, 500);
                        }

                    });
                });
        }
        const startGame = function()
        {
            const selectionPage = doc.querySelector("#selection_page");
            const gamePage = doc.querySelector("#gamepage");
            selectionPage.style.display = "none";
            gamePage.style.display = "block";
            doc.forms['player-form'].reset();
            doc.forms['player-form'].classList.remove('disabled');
            subbtn.disabled = false;
            gameBoard.currPlayer = gameBoard.player1;
            alert("Current player is "+gameBoard.currPlayer.name+" with symbol "+gameBoard.currPlayer.symbol);
            if(gameBoard.currPlayer.name === "AI")
                setTimeout(() => { gameControls.playAI();}, 500);
            else
                setTimeout(() => { displayController.render();}, 0);
        }
        const diffSelect = function()
        {
            const radios = doc.getElementsByName('select');
            console.log(radios);
            radios.forEach((radio) => {
                radio.addEventListener('click', (e) =>{
                    gameBoard.gameDiff = e.target.value;

                });
            });
        }
        const goBack = function ()
        {
            const selectionPage = doc.querySelector("#selection_page");
            const gamePage = doc.querySelector("#gamepage");
            selectionPage.style.display = "block";
            gamePage.style.display = "none";
            displayController.resetGame();
        }
        const resetGame = function()
        {
            const cells = doc.querySelectorAll(".cell");
            cells.forEach((cell)=>
            {
                (cell.innerHTML = "");
            })
            gameControls.gameFinish = 0;
            gameBoard.boardArray = Array(9).fill("");
            const result = doc.getElementById('result');
            result.innerHTML = "";
            gameBoard.gameMoves = 9;
        }
        const subEntry = function()
        {
            subbtn.addEventListener('click', (e) =>
            {
                console.log(e);
                let symbol = doc.forms['player-form']['symbol'];
                alert("Symbol chosen is:"+symbol.value);
                if(symbol.value === "X")
                {
                    gameBoard.player1 = Player("Human", symbol.value);
                    gameBoard.player2 = Player("AI","O");
                }
                else
                {
                    gameBoard.player1 = Player("AI","X");
                    gameBoard.player2 = Player("Human", symbol.value)
                }
                alert("First turn is of"+ gameBoard.player1.name);
                e.target.disabled = true;
                doc.forms['player-form'].classList.add('disabled');
            });
        }
        return {render, startGame, resetGame, subEntry, goBack, diffSelect};

    })(document);

const gameControls = ((doc) =>
    {
        let gameFinish = 0;
        const checkWin = function()
        {
            const winCombos = [['0','1','2'],['3','4','5'],['6','7','8'],['0','3','6'],['1','4','7'],['2','5','8'],['0','4','8'],['2','4','6']];
            for( let i = 0; i < winCombos.length; i++)
            {
                if(gameBoard.boardArray[winCombos[i][0]] === gameBoard.currPlayer.symbol && gameBoard.boardArray[winCombos[i][1]] === gameBoard.currPlayer.symbol && gameBoard.boardArray[winCombos[i][2]] === gameBoard.currPlayer.symbol)
                {
                    gameControls.gameFinish = 1;
                    const result = doc.getElementById('result');
                    result.innerHTML = '${gameBoard.currPlayer.name} wins!';
                    return;
                }
            }
            if(gameBoard.gameMoves === 0)
            {
                const result = doc.getElementById('result');
                result.innerHTML = 'It is a draw!';
                gameControls.gameFinish = 1;
            }
        }
        const switchTurn = function()
        {
            gameBoard.currPlayer = (gameBoard.currPlayer === gameBoard.player1) ? gameBoard.player2 : gameBoard.player1;
            console.log('switched');
            alert("Turn of "+gameBoard.currPlayer.name);
            setTimeout(() => { playAI();}, 500);
        }
        const playAI = function()
        {
            while(gameControls.gameFinish === 0){
            if(gameControls.gameFinish === 0) {
                let newBoard = [...gameBoard.boardArray];
                gameBoard.gameMoves -= 1;
                if (gameBoard.currPlayer.name === "AI") {
                    let cell = AI.findBest(newBoard, gameBoard.currPlayer, gameBoard.gameDiff);
                    alert("cell no. returned = "+cell);
                    let acCell = "#cell" + cell;
                    const selectCell = doc.querySelector(acCell);
                    console.log(acCell, selectCell);
                    selectCell.innerHTML = gameBoard.currPlayer.symbol;
                    gameBoard.boardArray[Number(selectCell.classList[1])] = gameBoard.currPlayer.symbol;
                    console.log(Number(selectCell.classList[1]));
                }
                else if (gameBoard.currPlayer.name === "Human") {
                    const cells = doc.querySelectorAll(".cell");
                    cells.forEach((cell) => {
                        cell.addEventListener("click", (e) => {
                            console.log(e);
                            if (e.target.innerHTML === "" && gameControls.gameFinish === 0) {
                                e.target.innerHTML = gameBoard.currPlayer.symbol;
                                gameBoard.boardArray[Number(e.target.classList[1])] = gameBoard.currPlayer.symbol;
                                console.log(Number(e.target.classList[1]));
                                gameBoard.gameMoves -= 1;
                            }
                        });
                    });
                }
                checkWin();
                switchTurn();
            }
            }

        }
        return {checkWin,gameFinish, switchTurn, playAI};
    })(document);

const AI = (() =>
    {
        const findBest = function(board, player, difficulty)
        {
            let moves = [];
            let emptySpots = findEmpty(board);
            let bestVal = -1000;

            let best_move = -1;
            let alternate_move = -1;
            for(let i = 0; i<emptySpots.length; i++)
            {
                let currMove = {};
                currMove.index = emptySpots[i];
                board[emptySpots[i]] = player.symbol;

                let newVal = minimax(board, player, 0, -1000, 1000, difficulty);

                if(newVal > bestVal)
                {
                    bestVal = newVal;
                    best_move = i;
                }
                else
                    alternate_move = i;

                board[emptySpots[i]] = '';
            }
            if(best_move === -1)
            {
                return alternate_move;
            }
            else
                return best_move;

        }
        const minimax = function(board, player, depth, alpha,beta, diff)
        {
            let emptySpots = findEmpty(board);
            let best_score;
            if((diff === 1 && depth > 1) || (diff === 2 && depth > 2) || (diff === 3 && depth > 3) || (diff === 4 && depth > 4))
                return -99;

             let eval_score = checkWin(board,player);
             if(eval_score && player.name === 'Human')
                 return (-10 + depth);
             else if(eval_score && player.name === 'AI')
                 return (10 - depth);
             else if(emptySpots.length === 0)
                 return 0;

             if(player.name === "Human")
             {
                 //minimizer
                 let best_score = 1000; let obtain_score = 0;
                 for(let i = 0; i<emptySpots.length; i++)
                 {
                     board[emptySpots[i]] = player.symbol;
                    if (player === gameBoard.player1)
                         obtain_score = minimax(board, gameBoard.player2, depth + 1, alpha, beta, diff);
                     else
                         obtain_score = minimax(board, gameBoard.player1, depth + 1, alpha, beta, diff);
                     if(obtain_score !== -99)
                     {
                         best_score = Math.min(best_score,obtain_score);
                         alpha = Math.min(alpha, best_score);
                         if(beta <= alpha)
                         {
                             board[emptySpots[i]] = "";
                             break;
                         }
                         board[emptySpots[i]] = "";
                     }
                 }
             }
             else if(player.name === "AI")
             {
                 let best_score = -1000; let obtain_score = 0;
                 for(let i = 0; i<emptySpots.length; i++)
                 {
                     board[emptySpots[i]] = player.symbol;
                     if (player === gameBoard.player1)
                         obtain_score = minimax(board, gameBoard.player2, depth + 1, alpha, beta, diff);
                     else
                         obtain_score = minimax(board, gameBoard.player1, depth + 1, alpha, beta, diff);
                     if (obtain_score !== -99) {
                         best_score = Math.max(best_score, obtain_score);
                         alpha = Math.max(alpha, best_score);
                         if (beta <= alpha) {
                             board[emptySpots[i]] = "";
                             break;
                         }
                     }
                     board[emptySpots[i]] = "";
                 }

             }
             return best_score;
        }
        const findEmpty = function(playBoard)
        {
            let empty = [];
            for(let i = 0; i < playBoard.length; i++)
            {
                if(playBoard[i] === '')
                {
                    empty.push(i);
                }
            }
            return empty;
        }
        const checkWin = function(board,player)
        {
            return (board[0] === player.symbol && board[1] === player.symbol && board[2] === player.symbol) ||
                (board[3] === player.symbol && board[4] === player.symbol && board[5] === player.symbol) ||
                (board[6] === player.symbol && board[7] === player.symbol && board[8] === player.symbol) ||
                (board[0] === player.symbol && board[3] === player.symbol && board[6] === player.symbol) ||
                (board[1] === player.symbol && board[4] === player.symbol && board[7] === player.symbol) ||
                (board[2] === player.symbol && board[5] === player.symbol && board[8] === player.symbol) ||
                (board[0] === player.symbol && board[4] === player.symbol && board[8] === player.symbol) ||
                (board[2] === player.symbol && board[4] === player.symbol && board[6] === player.symbol);
        }
        return {findBest, minimax, findEmpty, checkWin};

    })();

    displayController.render();
    displayController.subEntry();
    displayController.diffSelect();
