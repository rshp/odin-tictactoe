//Board module
DEFAUL_BOARD_SIZE = 3;
const gameBoard = (() => {
	let boardSize = DEFAUL_BOARD_SIZE;
	let board = [];
	let winCondition = null;

	const createBoard = () => {
		board = new Array(boardSize)
			.fill(null)
			.map((element) => Array(boardSize).fill('empty'));
		return board;
	};
	board = createBoard();

	const getBoard = () => {
		return board;
	};

	const getWinCondition = () => {
		return winCondition;
	};

	const setBoardSize = (newSize) => {
		boardSize = newSize;
		board = createBoard();
	};

	const placeMarker = (marker, position) => {
		if (position[0] > boardSize || position[1] > boardSize) {
			console.log('rowIndex out of bounds');
			return 'ERROR';
		}
		if (board[position[0]][position[1]] !== 'empty') {
			console.log('Illegal marker placement');
			return 'ERROR';
		}
		board[position[0]][position[1]] = marker;
		winCondition = checkWinCondition();
		return 'OK';
	};

	const rowWinCondition = (marker, board) => {
		return board.findIndex((row) => {
			return (rowFull = row.every((element) => {
				return element == marker;
			}));
		});
	};

	const columnWinCondition = (marker) => {
		let boardTranspose = board[0].map((x, i) => board.map((x) => x[i]));
		return rowWinCondition(marker, boardTranspose);
	};

	const diagonalWinCondition = (marker) => {
		diagonal1 = [];
		diagonal2 = [];
		for (let i = 0; i < boardSize; i++) {
			diagonal1.push(board[i][i]);
			diagonal2.push(board[i][boardSize - i - 1]);
		}
		let diagonal1Full = diagonal1.every((element) => {
			return element == marker;
		});
		let diagonal2Full = diagonal2.every((element) => {
			return element == marker;
		});
		if (diagonal1Full) return 1;
		if (diagonal2Full) return 2;
		return -1;
	};

	const getMarkersList = () => {
		let markers = new Set();
		board.forEach((row) => {
			row.forEach((value) => {
				if (value != 'empty') markers.add(value);
			});
		});
		return markers;
	};

	const isBoardFull = () => {
		return !board.some((row) => {
			return row.some((element) => {
				return element == 'empty';
			});
		});
	};

	const checkWinCondition = () => {
		if (isBoardFull()) return 'draw';
		let markers = getMarkersList();
		let winCondition = null;
		Array.from(markers).some((marker) => {
			if (rowWinCondition(marker, board) !== -1) {
				winCondition = { marker, row: rowWinCondition(marker, board) };
				return true;
			}
			if (columnWinCondition(marker) !== -1) {
				winCondition = { marker, column: columnWinCondition(marker) };
				return true;
			}
			if (diagonalWinCondition(marker) !== -1) {
				winCondition = {
					marker,
					diagonal: diagonalWinCondition(marker),
				};
				return true;
			}
		});
		return winCondition;
	};

	return {
		getBoard,
		setBoardSize,
		placeMarker,
		getWinCondition,
	};
})();

//Player factory
const Player = (marker) => {
	let playerMarker = marker;
	const makeMove = (i, j) => {
		let actionResult = gameBoard.placeMarker(playerMarker, [i, j]);
		if (actionResult === 'OK') gameProgress.nextPlayer();
	};
	return { playerMarker, makeMove };
};

//Game progress module
DEFAULT_PLAYER_COUNT = 2;
const gameProgress = (() => {
	let playerCount = DEFAULT_PLAYER_COUNT;
	let player = createPlayers();
	let currentTurnPlayer = 0;
	let currentPlayer = player[currentTurnPlayer];

	function setPlayerCount(n) {
		playerCount = n;
		player = createPlayers();
	}

	function createPlayers() {
		let players = [];
		const playerMarkers = ['X', 'O', 'Z', 'Y', 'V'];
		for (let i = 0; i < playerCount; i++) {
			players.push(Player(playerMarkers[i]));
		}
		return players;
	}

	function setCurrentPlayer(playerNumber) {
		currentTurnPlayer = playerNumber;
		currentPlayer = player[playerNumber];
	}

	function getCurrentPlayer() {
		return currentPlayer;
	}

	function getPlayers() {
		return player;
	}

	function initGame(playerCount, boardSize) {
		setPlayerCount(playerCount);
		gameBoard.setBoardSize(boardSize);
		setCurrentPlayer(0);
	}

	function nextPlayer() {
		if (currentTurnPlayer === playerCount - 1) currentTurnPlayer = 0;
		else currentTurnPlayer += 1;
		currentPlayer = player[currentTurnPlayer];
	}

	return { getCurrentPlayer, nextPlayer, initGame, getPlayers };
})();

//View Module
// const gameContainer = document.querySelector('main');

const render = (() => {
	const gameContainer = getGameContainer();
	const domElements = parseDOM(gameContainer);
	function parseDOM(gameContainer) {
		const playerSelector = gameContainer.querySelector('#player-count');
		const boardSelector = gameContainer.querySelector('#board-size');
		const boardContainer = gameContainer.querySelector('.game-board');
		const playersContainer = gameContainer.querySelector('.players');
		return {
			playerSelector,
			boardSelector,
			boardContainer,
			playersContainer,
		};
		//get modal div
	}

	function getGameContainer() {
		const container = document.querySelector('main');
		return container;
	}

	function processGameStart() {
		//on initialize or
		//player count change or board size change
		//do followig:
		// - initialize board
		// - attach event listeners
	}

	function createBoardControlEL() {
		[domElements.playerSelector, domElements.boardSelector].forEach(
			(selector) => {
				selector.addEventListener('change', () => {
					gameProgress.initGame(
						+domElements.playerSelector.value, //convert to number otherwise drawBoard breaks
						+domElements.boardSelector.value
					);
					drawBoard();
					drawPlayers();
				});
			}
		);
	}

	function createBoardEL() {
		domElements.boardContainer.addEventListener('click', (e) => {
			e.target.innerHTML = gameProgress.getCurrentPlayer().playerMarker;
			gameProgress
				.getCurrentPlayer()
				.makeMove(
					e.target.dataset.coord_row,
					e.target.dataset.coord_col
				);

			console.log(gameBoard.getBoard());
		});
	}

	function displayWinCondition(params) {
		//on win condition
		//draw win condition line
		//display modal
	}

	function displayDrawMatch(params) {
		//on draw display 'Draw' modal
	}

	function setGameParams() {
		//player count, board size
	}
	function drawBoard() {
		domElements.boardContainer.innerHTML = '';
		gameBoard.getBoard().forEach((row, i) => {
			row.forEach((element, j) => {
				const cell = document.createElement('div');
				cell.classList.add('board-cell');
				cell.dataset.coord_row = i;
				cell.dataset.coord_col = j;
				domElements.boardContainer.appendChild(cell);
			});
		});
		domElements.boardContainer.style.gridTemplateColumns = `repeat(${
			gameBoard.getBoard().length
		},1fr`;
	}

	function drawPlayers() {
		domElements.playersContainer.innerHTML = '';
		gameProgress.getPlayers().forEach((player, index) => {
			const playerCard = document.createElement('div');
			playerCard.classList.add('player-card');
			playerCard.dataset.playerNum = index;
			playerCard.innerHTML = `Player ${player.playerMarker}`;
			domElements.playersContainer.appendChild(playerCard);
		});
	}

	function updateBoard() {
		//draw marker after each turn
	}

	function updateCurrentPlayer() {
		//highlight current turn player
	}
	return { createBoardControlEL, createBoardEL, drawBoard, drawPlayers };
})();
gameProgress.initGame(2, 3);
render.drawBoard();
render.drawPlayers();
render.createBoardControlEL();
render.createBoardEL();

//gameProgress.getCurrentPlayer().playerMarker;
// gameProgress.getCurrentPlayer().makeMove(0, 0);
// gameProgress.getCurrentPlayer().playerMarker;
// gameProgress.getCurrentPlayer().makeMove(1, 1);
// gameProgress.getCurrentPlayer().playerMarker;
// gameProgress.getCurrentPlayer().makeMove(2, 1);
// gameProgress.getCurrentPlayer().playerMarker;
// gameProgress.getCurrentPlayer().makeMove(2, 1);
// gameProgress.getCurrentPlayer().playerMarker;
// gameProgress.getCurrentPlayer().makeMove(2, 2);
// gameProgress.getCurrentPlayer().makeMove(0, 1);
// gameProgress.getCurrentPlayer().makeMove(0, 2);
// gameProgress.getCurrentPlayer().makeMove(1, 0);
// gameProgress.getCurrentPlayer().makeMove(1, 2);
// gameProgress.getCurrentPlayer().makeMove(2, 0);
// gameProgress.initGame(2, 4);

// console.log(gameBoard.getBoard());

// gameBoard.getBoard()[0]; //?
// gameBoard.getBoard()[1]; //?
// gameBoard.getBoard()[2]; //?
// gameBoard.getWinCondition(); //?

// console.log(gameBoard.getBoard());
// gameProgress.initGame(3, 4);
// console.log(gameProgress.getPlayers());
