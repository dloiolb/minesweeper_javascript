const BOMB = "rgb(244, 10, 10)";   // Red color for bombs
const RESET = "rgb(255, 255, 255)";   // Reset color to default
const BOLDYELLOW = "rgb(210, 218, 90)"; // Bold yellow
const BLUE = "rgb(54, 35, 196)";   // Blue color
const GREEN = "rgb(139, 213, 144)";  // Green color
const RED = "rgb(196, 35, 35)";    // Light red color
const PURPLE = "rgb(159, 35, 196)"; // Purple color
const YELLOW = "rgb(223, 217, 103)"; // Yellow color
const TURQ = "rgb(35, 193, 196)";   // Turquoise (light blue)
const SEVEN = "rgb(164, 155, 172)";  // Light gray
const EIGHT = "rgb(105, 92, 92)";  // Dark gray

// Initialize the game variables
const DIFFICULTY = 99;

let game = 1; //while game === 1, keep playing, game === 0 is game over (win or lose)
let win = 0; // game === 0 and win === 0 means lose, game === 0 and win === 1 means win
let firstpress = true;

// Cell class
class Cell {
    constructor() {
        this.behind = 0; // Location of bomb: 0 = no bomb, 1 = bomb
        this.hasbeenpressed = 0; // 0 = not pressed, 1 = pressed
        this.numberofbombs = 0; // 0-8 = number of bombs around, 9 = bomb
    }
}

let board = Array(16).fill().map(() => Array(30).fill().map(() => new Cell()));

// Create the game board and add buttons
function createBoard() {
    gameBoardContainer.innerHTML = '';
    for (let row = 0; row < 16; row++) {
        for (let col = 0; col < 30; col++) {
            const button = document.createElement('button');
            button.setAttribute('id', `button-${row}-${col}`);
            button.textContent = `${row+1}.${col+1}`;

            button.addEventListener('click', () => handleClick(row, col));

            button.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                handleRightClick(row, col)
            });

            // button.addEventListener('mouseover', (event) => {
            //     if (game){
            //         button.style.boxShadow = '5px 5px 15px rgba(0, 0, 0, 0.5)';  //shadow on hover
            //     }
            // });

            gameBoardContainer.appendChild(button);
        }
    }
}

/* generateboard(): called once
this generates the bombs for board[16][30].behind...
takes in account player's initial touch of some location a,b, so board[a][b].behind does not contain bomb
*/
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

// Get the button element by its ID
const startButton = document.getElementById("myButton");
const gameBoardContainer = document.getElementById("game-board");

// Add a click event listener to the button
startButton.addEventListener("click", function() {
    // Print a message to the console when the button is clicked
    console.log("Game Start\n");
    game = 1;
    win = 0;
    startGame2();
});

// Handle click on a button
function handleClick(row, col) {
    if (firstpress) {

        // let roww = prompt("Input row (from 1-16): ");
        // let coll = prompt("Input column (from 1-30): ");
        generateBoard(row+1, col+1); //the board is generated so that the first press is not a bomb

        markNumb();
        display();
        firstpress = false;
    }

    if (!game || board[row][col].hasbeenpressed) return;

    const button = document.getElementById(`button-${row}-${col}`);
    board[row][col].hasbeenpressed = true;
    changePress(row+1, col+1, 'e');
    display();
    
}

function handleRightClick(row, col) {
    if (!game || board[row][col].hasbeenpressed === 1) return;
    if (!game || board[row][col].hasbeenpressed === 2){
        const button = document.getElementById(`button-${row}-${col}`);
        // board[row][col].hasbeenpressed = 2;
        changePress(row+1, col+1, '0');
        display();
    }
    else{
        const button = document.getElementById(`button-${row}-${col}`);
        // board[row][col].hasbeenpressed = 2;
        changePress(row+1, col+1, '!');
        display();
    }
}


// Function to get edge positions for connected zero
//used in connectedzero() and marknumb()
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

function which_color(x)
{
	switch (x) {
	case 0: return BOLDYELLOW;
	case 1: return BLUE;
	case 2: return GREEN;
	case 3: return RED;
	case 4: return PURPLE;
	case 5: return YELLOW;
	case 6: return TURQ;
	case 7: return SEVEN;
	case 8: return EIGHT;
    default: return RESET; // Optional default return in case no match
	}
}

// Function to handle player input for pressing or marking cells
function changePress(raww, caww, decision) {
    raww--;
    caww--;

    let hbp = 0;
    if (decision === 'e') hbp = 1;
    else if (decision === '!') hbp = 2;
    else if (decision === '?') hbp = 3;
    else if (decision === '0') hbp = 0;
    else console.log("That is not a valid mark.\n");

    board[raww][caww].hasbeenpressed = hbp;

    if (board[raww][caww].behind === 1 && board[raww][caww].hasbeenpressed === 1) {
        const button = document.getElementById(`button-${raww}-${caww}`);
        button.style.backgroundColor = '#d9534f'; 
        button.style.borderTop = '2px solid #9e3d32';
        button.style.borderLeft = '2px solid #9e3d32';
        button.style.borderBottom = '2px solid #f5b0a6';
        button.style.borderRight = '2px solid #f5b0a6';  
        button.style.boxShadow = 'inset 4px 4px 8px rgba(0, 0, 0, 0.3)';
        button.style.cursor = 'pointer';
        console.log("\n\n");
        game = 0;
    }

    connectedZero();
}

// Function to display the game board on console and on screen
function display() {
    let numppp = 1;
    let output = "   1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30\n";
    for (let row = 0; row < 16; row++) {
        output += numppp + " ";
        if (numppp < 10) output += " ";
        numppp++;
        for (let col = 0; col < 30; col++) {
            const button = document.getElementById(`button-${row}-${col}`);

            if (game === 0 && board[row][col].behind === 1)
                board[row][col].hasbeenpressed = 1;

            if (board[row][col].hasbeenpressed === 1) {
                if (board[row][col].numberofbombs === 9) {
                    output += "*  ";
                    button.textContent = '*';
                    button.style.color = RED;
                }
                else {
                    output += board[row][col].numberofbombs + "  ";
                    button.textContent = `${board[row][col].numberofbombs}`;
                    button.style.color = which_color(board[row][col].numberofbombs);
                    // button.style.backgroundColor = '#8b908b';  // Light gray

                    button.style.backgroundColor = '#a0a0a0';  // Darker background color
                    button.style.borderTop = '2px solid #6b6b6b';  
                    button.style.borderLeft = '2px solid #6b6b6b';  
                    button.style.borderBottom = '2px solid #c1c1c1'; 
                    button.style.borderRight = '2px solid #c1c1c1'; 
                    button.style.boxShadow = 'inset 4px 4px 8px rgba(0, 0, 0, 0.3)';
                    button.style.cursor = 'pointer';
                }
            } 
            else if (board[row][col].hasbeenpressed === 2) {
                output += "!  ";  // Represent unpressed cell
                button.textContent = `!`;
            } 
            else {
                output += "O  ";  // Represent unpressed cell
                button.textContent = ` `;
            }
        }
        output += "\n";
    }
    console.log(output);
}

// Function to start the game on console
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

function startGame2() {
    // const DIFFICULTY = 99;
    game = 1;
    win = 0;
    firstpress = true;
    board = Array(16).fill().map(() => Array(30).fill().map(() => new Cell()));
    createBoard();
    display();
}

startGame2();
