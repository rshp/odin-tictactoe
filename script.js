//Board module
DEFAUL_BOARD_SIZE = 3;
const gameBoard = (() => {
	let boardSize = DEFAUL_BOARD_SIZE;
	let board = [];
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

	const setBoardSize = (newSize) => {
		boardSize = newSize;
		board = createBoard();
	};

	const placeMarker = (marker, position) => {
		if (position[0] > boardSize || position[1] > boardSize) {
			console.log('Index out of bounds');
			return;
		}
		board[position[0]][position[1]] = marker;
	};

	const hasWinCondition = () => {
		//enum all different markers on board (with exeption of 'empty')
		//for each marker check all horizontals verticals and diagonals
		//if any found full mark that this marker has win condition
		//return all markers that have win condition
		//for graphic representation return the type of condition met: horizontal#/vertical#/diagonal# (total of 4 diagonals)
	};

	return { createBoard, getBoard, setBoardSize, placeMarker };
})();
// gameBoard.createBoard();
gameBoard.placeMarker('X', [1, 1]);
