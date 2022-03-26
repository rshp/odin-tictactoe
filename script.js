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
	const playerMarkers = ['X', 'O', 'Z'];

	let player = createPlayers();

	function setPlayerCount(n) {
		playerCount = n;
		player = createPlayers();
	}

	function createPlayers() {
		let players = [];
		playerMarkers.forEach((mark) => {
			players.push(Player(mark));
		});
		return players;
	}

	let currentTurnPlayer = 0;
	let currentPlayerValue = player[currentTurnPlayer];

	function currentPlayer() {
		return currentPlayerValue;
	}

	function nextPlayer() {
		if (currentTurnPlayer === playerCount - 1) currentTurnPlayer = 0;
		else currentTurnPlayer += 1;
		currentPlayerValue = player[currentTurnPlayer];
	}

	return { setPlayerCount, currentPlayer, nextPlayer };
})();
gameProgress.setPlayerCount(3);
gameProgress.currentPlayer().playerMarker; //?
gameProgress.currentPlayer().makeMove(0, 0);
gameProgress.currentPlayer().playerMarker; //?
gameProgress.currentPlayer().makeMove(1, 1);
gameProgress.currentPlayer().playerMarker; //?
gameProgress.currentPlayer().makeMove(2, 1);
gameProgress.currentPlayer().playerMarker; //?
gameProgress.currentPlayer().makeMove(2, 1);
gameProgress.currentPlayer().playerMarker; //?
gameProgress.currentPlayer().makeMove(2, 2);
gameProgress.currentPlayer().makeMove(0, 1);
gameProgress.currentPlayer().makeMove(0, 2);
gameProgress.currentPlayer().makeMove(1, 0);
gameProgress.currentPlayer().makeMove(1, 2);
gameProgress.currentPlayer().makeMove(2, 0);

gameBoard.getBoard()[0]; //?
gameBoard.getBoard()[1]; //?
gameBoard.getBoard()[2]; //?
gameBoard.getWinCondition(); //?
