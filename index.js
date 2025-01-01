// Get the button element by its ID
const button = document.getElementById("myButton");
const gameBoardContainer = document.getElementById("game-board");

// Add a click event listener to the button
button.addEventListener("click", function() {
    // Print a message to the console when the button is clicked
    console.log("A\nB\n");
    game = 1;
    win = 0;
    startGame();
});

createBoard();

// Cell class
class Cell {
    constructor() {
        this.behind = 0; // Location of bomb: 0 = no bomb, 1 = bomb
        this.hasbeenpressed = 0; // 0 = not pressed, 1 = pressed
        this.numberofbombs = 0; // 0-8 = number of bombs around, 9 = bomb
    }
}

// Generate the game board and add buttons
function createBoard() {
    gameBoardContainer.innerHTML = '';
    for (let row = 0; row < 16; row++) {
        for (let col = 0; col < 30; col++) {
            const button = document.createElement('button');
            button.setAttribute('id', `button-${row}-${col}`);
            button.addEventListener('click', () => handleClick(row, col));
            gameBoardContainer.appendChild(button);
        }
    }
}

// Initialize the game variables
const DIFFICULTY = 99;
let game = 1;
let win = 0;
let board = Array(16).fill().map(() => Array(30).fill().map(() => new Cell()));

// Function to generate the board with bombs
function generateBoard(r, c) {
    board[r - 1][c - 1].hasbeenpressed = 1;

    for (let counter = 0; counter < DIFFICULTY; counter++) {
        let randrow, randcol;

        // Generate random positions for bombs, ensuring it's not the first clicked position
        do {
            randrow = Math.floor(Math.random() * 16);
            randcol = Math.floor(Math.random() * 30);
        } while (board[randrow][randcol].behind === 1 || (randrow === (r - 1) && randcol === (c - 1)));

        board[randrow][randcol].behind = 1;
    }
}

// Function to get edge positions for connected zero
function edge(a, b) {
    let ans = [0, 0, 0, 0];

    ans[0] = (a > 0) ? (a - 1) : a;
    ans[1] = (a < 15) ? (a + 2) : (a + 1);
    ans[2] = (b > 0) ? (b - 1) : b;
    ans[3] = (b < 29) ? (b + 2) : (b + 1);

    return ans;
}

// Function for the connected zero logic
function connectedZero() {
    let yor = 0;
    do {
        for (let a = 0; a < 16; a++) {
            for (let b = 0; b < 30; b++) {
                if (board[a][b].numberofbombs === 0 && board[a][b].hasbeenpressed === 1) {
                    for (let ex = edge(a, b)[0]; ex < edge(a, b)[1]; ex++) {
                        for (let ey = edge(a, b)[2]; ey < edge(a, b)[3]; ey++) {
                            if (board[ex][ey].hasbeenpressed !== 1) yor++;
                            board[ex][ey].hasbeenpressed = 1;
                        }
                    }
                }
            }
        }
        yor -= 1;
    } while (yor > 0);
}

// Function to mark the numbers around bombs
function markNumb() {
    for (let a = 0; a < 16; a++) {
        for (let b = 0; b < 30; b++) {
            if (board[a][b].behind === 0) {
                let howmanybombs = 0;
                for (let ex = edge(a, b)[0]; ex < edge(a, b)[1]; ex++) {
                    for (let ey = edge(a, b)[2]; ey < edge(a, b)[3]; ey++) {
                        if (board[ex][ey].behind === 1) howmanybombs++;
                    }
                }
                board[a][b].numberofbombs = howmanybombs;
            } else {
                board[a][b].numberofbombs = 9;
            }
        }
    }
    connectedZero();
}

// Function to display the game board
function display() {
    let numppp = 1;
    let output = "   1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30\n";
    for (let row = 0; row < 16; row++) {
        output += numppp + " ";
        if (numppp < 10) output += " ";
        numppp++;
        for (let col = 0; col < 30; col++) {
            if (game === 0 && board[row][col].behind === 1)
                board[row][col].hasbeenpressed = 1;

            if (board[row][col].hasbeenpressed === 1) {
                if (board[row][col].numberofbombs === 9) output += "*  ";
                else output += board[row][col].numberofbombs + "  ";
            } else {
                output += "O  ";  // Represent unpressed cell
            }
        }
        output += "\n";
    }
    console.log(output);
}

// Function to handle player input for pressing or marking cells
function changePress(raww, caww, decision) {
    raww--;
    caww--;

    let hbp = 0;
    if (decision === 'e') hbp = 1;
    else if (decision === '!') hbp = 2;
    else if (decision === '?') hbp = 3;
    else console.log("That is not a valid mark.\n");

    board[raww][caww].hasbeenpressed = hbp;

    if (board[raww][caww].behind === 1 && board[raww][caww].hasbeenpressed === 1) {
        console.log("\n\n");
        game = 0;
    }

    connectedZero();
}

// Function to start the game
function startGame() {
    
    // const DIFFICULTY = 99;
    game = 1;
    win = 0;
    board = Array(16).fill().map(() => Array(30).fill().map(() => new Cell()));

    console.log("MINESWEEPER");
    display();

    let roww = prompt("Input row (from 1-16): ");
    let coll = prompt("Input column (from 1-30): ");
    generateBoard(roww, coll);

    markNumb();
    display();

    while (game === 1) {
        let rroww = prompt("Input row (from 1-16): ");
        let ccoll = prompt("Input column (from 1-30): ");
        let ddecc = prompt("What to do with this location?  enter: \n'e' - press this location\n'!' - mark this as bomb\n'?' - mark this as unknown\n");

        changePress(rroww, ccoll, ddecc);
        display();
    }

    if (win === 1) {
        console.log("\nCONGRATULATIONS! YOU WON MINESWEEPER!");
    } else {
        console.log("\nYOU LOST");
    }
}

// Call the start game function
// startGame();

