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
		return gameBoard.placeMarker(playerMarker, [i, j]);
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

	function currentPlayerMove(i, j) {
		let actionResult = currentPlayer.makeMove(i, j);
		if (actionResult !== 'OK') return;
		if (gameBoard.getWinCondition() !== null) {
			render.drawWinCondition(gameBoard.getWinCondition());
			return;
		}
		gameProgress.nextPlayer();
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
		render.drawBoard();
		render.drawPlayers();
	}

	function nextPlayer() {
		if (currentTurnPlayer === playerCount - 1) currentTurnPlayer = 0;
		else currentTurnPlayer += 1;
		currentPlayer = player[currentTurnPlayer];
	}

	return {
		getCurrentPlayer,
		nextPlayer,
		initGame,
		getPlayers,
		currentPlayerMove,
	};
})();

//View Module
const render = (() => {
	const gameContainer = getGameContainer();
	const domElements = parseDOM(gameContainer);
	function parseDOM(gameContainer) {
		const playerSelector = gameContainer.querySelector('#player-count');
		const boardSelector = gameContainer.querySelector('#board-size');
		const boardContainer = gameContainer.querySelector('.game-board');
		const playersContainer = gameContainer.querySelector('.players');
		const modalWrapper = gameContainer.querySelector('.modal-wrapper');
		const modalContent = gameContainer.querySelector('.modal-content');
		const resetButton = gameContainer.querySelector('.reset-button');
		return {
			playerSelector,
			boardSelector,
			boardContainer,
			playersContainer,
			modalWrapper,
			modalContent,
			resetButton,
		};
	}

	function getGameContainer() {
		const container = document.querySelector('main');
		return container;
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
		domElements.resetButton.addEventListener('click', () => {
			gameProgress.initGame(
				+domElements.playerSelector.value,
				+domElements.boardSelector.value
			);
		});
	}

	function createModalEL() {
		domElements.modalWrapper.addEventListener('click', (e) => {
			domElements.modalWrapper.classList.toggle('modal-show');
			gameProgress.initGame(
				+domElements.playerSelector.value,
				+domElements.boardSelector.value
			);
		});
	}

	function createBoardEL() {
		domElements.boardContainer.addEventListener('click', (e) => {
			if (!e.target.classList.contains('board-cell')) return;
			gameProgress.currentPlayerMove(
				e.target.dataset.coord_row,
				e.target.dataset.coord_col
			);
			e.target.innerHTML =
				gameBoard.getBoard()[e.target.dataset.coord_row][
					e.target.dataset.coord_col
				];
		});
	}

	function drawWinCondition(winCondition) {
		if (winCondition == 'draw') {
			displayModal(winCondition);
			console.log('Its a draw');
			return;
		}
		let winConditionCells = Array.from(
			domElements.boardContainer.childNodes
		).filter((element) => {
			if ('row' in winCondition)
				return element.dataset.coord_row == winCondition.row;
			if ('column' in winCondition)
				return element.dataset.coord_col == winCondition.column;
			if ('diagonal' in winCondition && winCondition.diagonal == 1)
				return element.dataset.coord_row == element.dataset.coord_col;
			if ('diagonal' in winCondition && winCondition.diagonal == 2)
				return (
					element.dataset.coord_col ==
					-element.dataset.coord_row + gameBoard.getBoard().length - 1
				);
		});
		winConditionCells.forEach((element) => {
			element.classList.add('board-cell-highlight');
		});
		displayModal(winCondition);
	}

	function modalMessage(winCondition) {
		if (winCondition === `draw`) return `It's a draw`;
		if ('marker' in winCondition)
			return `Player ${winCondition.marker} won`;
	}

	function displayModal(winCondition) {
		domElements.modalContent.innerHTML = modalMessage(winCondition);
		domElements.modalWrapper.classList.toggle('modal-show');
	}

	function drawBoard() {
		while (domElements.boardContainer.firstChild) {
			domElements.boardContainer.removeChild(
				domElements.boardContainer.firstChild
			);
		}
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
		domElements.boardContainer.style.gridTemplateRows = `repeat(${
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

	function updateCurrentPlayer() {
		//highlight current turn player
	}
	return {
		createBoardControlEL,
		createBoardEL,
		createModalEL,
		drawBoard,
		drawPlayers,
		drawWinCondition,
		displayModal,
	};
})();

gameProgress.initGame(2, 3);
render.createBoardControlEL();
render.createBoardEL();
render.createModalEL();
