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
        let gameMode = '';
        let gameMoves = 9;
        return {boardArray, player1, player2, currPlayer, gameDiff,gameMode, gameMoves};
    }) ();

const displayController = ((doc) =>
    {
        const subbtn = doc.getElementById('sub1');
        const subbtn2 = doc.getElementById('sub2');
        const render = function()
        {
            const cells = doc.querySelectorAll(".cell");
                cells.forEach((cell) => {
                    cell.addEventListener("click", (e) => {
                        console.log(e);
                        const targetCell = e.target;
                        if (targetCell.innerHTML === "" && gameControls.gameFinish === 0) {
                            targetCell.innerHTML = gameBoard.currPlayer.symbol;
                            gameBoard.boardArray[Number(targetCell.classList[1])] = gameBoard.currPlayer.symbol;
                            console.log(Number(targetCell.classList[1]));
                            gameBoard.gameMoves -= 1;
                            gameControls.checkWin();
                            if(gameBoard.gameMode == "HvH")
                            {
                                gameControls.switchTurn();
                            }
                            if(gameBoard.gameMode == "AI")
                            {
                                setTimeout(() => {gameControls.playAI();}, 0);
                            }

                        }

                    });
                });
        }
        const startGame = function()
        {
            if(gameBoard.gameMode === '')
            {
                window.alert("Please select a mode");
            }
            else {
                const selectionPage = doc.querySelector("#selection_page");
                const gamePage = doc.querySelector("#gamepage");
                selectionPage.style.display = "none";
                gamePage.style.display = "block";
                /*const cells = doc.querySelectorAll(".cell");
                cells.style.background = "white";*/
                doc.forms['player-form2'].reset();
                doc.forms['player-form1'].reset();
                doc.forms['player-form1'].classList.remove('disabled');
                doc.forms['player-form2'].classList.remove('disabled');
                subbtn.disabled = false;
                subbtn2.disabled = false;
                gameBoard.currPlayer = gameBoard.player1;
                if (gameBoard.gameMode == "AI") {
                    if (gameBoard.player1.symbol === "X")
                        gameBoard.player2 = Player("AI", "O");
                    else
                        gameBoard.player2 = Player("AI", "X");
                }
            }
        }
        const modeSelect = function()
        {
            const radios = doc.getElementsByName('mode-select');
            console.log(radios);
            radios.forEach((radio) =>
            {
                radio.addEventListener('click', (e) =>
                {
                    const targetRadio = e.target;
                    gameBoard.gameMode = targetRadio.value;
                    if(gameBoard.gameMode == "AI")
                    {
                        doc.forms['player-form2'].classList.add('disabled');
                        subbtn2.disabled = true;
                        const diffSelection = doc.getElementById('select');
                        diffSelection.style.display = "block";
                    }
                    else
                    {
                        doc.forms['player-form2'].classList.remove('disabled');
                        subbtn2.disabled = false;
                        const diffSelection = doc.getElementById('select');
                        diffSelection.style.display = "none";
                    }
                });

            });
        }
        const diffSelect = function()
        {
            const radios = doc.getElementsByName('select');
            console.log(radios);
            radios.forEach((radio) => {
                radio.addEventListener('click', (e) =>{
                    const diffVal = e.target;
                    gameBoard.gameDiff = diffVal.value;
                });
            });
        }
        const goBack = function ()
        {
            const selectionPage = doc.querySelector("#selection_page");
            const gamePage = doc.querySelector("#gamepage");
            const cells = doc.querySelectorAll(".cell");
            cells.forEach((cell)=>
            {
                (cell.style.background = "white");
            })
            selectionPage.style.display = "block";
            gamePage.style.display = "none";
            const radios = doc.getElementsByName('mode-select');
            radios.forEach((radio) =>
            {
                radio.checked = false;
            });
            displayController.resetGame();
        }
        const resetGame = function()
        {
            const cells = doc.querySelectorAll(".cell");
            cells.forEach((cell)=>
            {
                (cell.innerHTML = "");
                (cell.style.background = "white");
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
                if(gameBoard.gameMode == '')
                {
                    window.alert("Please select a valid mode");
                }
                else {
                    let name = doc.forms['player-form1']['name'];
                    let symbol = doc.forms['player-form1']['symbol'];
                    gameBoard.player1 = Player(name.value, symbol.value);
                    e.target.disabled = true;
                    doc.forms['player-form1'].classList.add('disabled');
                }
            });
            subbtn2.addEventListener('click', (e) =>
            {
                console.log(e);
                if(gameBoard.gameMode == '')
                {
                    window.alert("Please select a valid mode");
                }
                else
                {
                    if(subbtn.disabled === true)
                    {
                        let name = doc.forms['player-form2']['name'];
                        let symbol = doc.forms['player-form2']['symbol'];
                        if(symbol.value === gameBoard.player1.symbol)
                        {
                            window.alert("Both players cannot have same symbols, choose again");
                            doc.forms['player-form2'].reset();
                            return;
                        }
                        gameBoard.player2 = Player(name.value, symbol.value);
                        e.target.disabled = true;
                        doc.forms['player-form2'].classList.add('disabled');
                    }
                    else
                    {
                        window.alert("Please fill Player 1 details first");
                        doc.forms['player-form2'].reset();
                    }
                }
            });
        }
        return {render, startGame, resetGame, subEntry, goBack, diffSelect, modeSelect};

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
                    const targetCell1 = doc.getElementById('cell'+winCombos[i][0]);
                    const targetCell2 = doc.getElementById('cell'+winCombos[i][1]);
                    const targetCell3 = doc.getElementById('cell'+winCombos[i][2]);
                    targetCell1.style.background = "lightcoral";
                    targetCell2.style.background = "lightcoral";
                    targetCell3.style.background = "lightcoral";
                    gameControls.gameFinish = 1;
                    const result = doc.getElementById('result');
                    result.innerHTML = gameBoard.currPlayer.name+' wins!';
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

        }
        const playAI = function()
        {
            if(gameControls.gameFinish === 0)
            {
                gameBoard.gameMoves -= 1;
                gameBoard.currPlayer = gameBoard.player2;
                let cell = AI.findBest(gameBoard.boardArray, gameBoard.player2, gameBoard.gameDiff);
                let acCell = "#cell" + cell;
                const selectCell = doc.querySelector(acCell);
                console.log(acCell, selectCell);
                selectCell.innerHTML = gameBoard.currPlayer.symbol;
                gameBoard.boardArray[Number(selectCell.classList[1])] = gameBoard.currPlayer.symbol;
                console.log(Number(selectCell.classList[1]));
                gameControls.checkWin();
            }
            gameBoard.currPlayer = gameBoard.player1;
        }
        return {checkWin,gameFinish, switchTurn, playAI};
    })(document);

const AI = (() =>
    {
        const findBest = function(board, player, difficulty)
        {
            let bestVal = -1000;
            let best_move = -1;
            let alternate_move;
            for(let i = 0; i<board.length; i++)
            {
                if(board[i] === "")
                {
                    board[i] = player.symbol;
                    let newVal = minimax(board, gameBoard.player1, 0, -1000, 1000, difficulty);
                    if(newVal > bestVal)
                    {
                        bestVal = newVal;
                        best_move = i;
                    }
                    else
                        alternate_move = i;

                    board[i] = "";
                }
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

            if(diff == 1 && depth>1)
                return -99;
            else if(diff == 2 && depth>2)
                return -99;
            else if(diff == 3 && depth>3)
                return -99;
            else if(diff == 4 && depth>4)
                return -99;

            if(checkWin(board,gameBoard.player1))
                 return (-10 + depth);
            else if(checkWin(board,gameBoard.player2))
                 return (10 - depth);
            else if(isEnd(board) === true)
                 return 0;

             let best_score;
             if(player === gameBoard.player1)
             {
                 //minimizer
                 best_score = 1000;
                 for(let i = 0; i<board.length; i++)
                 {
                     if (board[i] === "")
                     {
                         board[i] = player.symbol;
                         let obtain_score = minimax(board, gameBoard.player2, (depth+1), alpha, beta, diff);
                         if (obtain_score !== -99)
                         {
                             best_score = Math.min(best_score, obtain_score);
                             beta = Math.min(beta, best_score);
                             if (beta <= alpha)
                             {
                                 board[i] = "";
                                 break;
                             }
                         }
                         board[i] = "";


                     }
                 }
             }

             if(player === gameBoard.player2)
             {
                 //maximizer
                 best_score = -1000;
                 for(let i = 0; i<board.length; i++)
                 {
                     if(board[i] === "")
                     {
                         board[i] = player.symbol;
                         let obtain_score = minimax(board, gameBoard.player1, depth + 1, alpha, beta, diff);
                         if (obtain_score !== -99)
                         {
                            best_score = Math.max(best_score, obtain_score);
                            alpha = Math.max(alpha, best_score);
                            if (beta <= alpha)
                            {
                                board[i] = "";
                                break;
                            }
                         }
                         board[i] = "";
                     }
                 }
             }

             return best_score;
        }
        /*const findEmpty = function(playBoard)
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
        }*/
        const isEnd = function(board)
        {
            for(let i = 0; i<board.length; i++)
            {
                if(board[i] === "")
                    return false;
            }
            return true;
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
        return {findBest};

    })();

    displayController.render();
    displayController.subEntry();
    displayController.modeSelect();
    displayController.diffSelect();

