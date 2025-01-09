#include <SFML/Graphics.hpp>
#include <iostream>
#include <random>

#define BOMB    "\033[31m"   //bomb (red) 
#define RESET   "\033[0m"    //white
#define BOLDYELLOW  "\033[1m\033[33m" // zero
#define BLUE    "\033[34m"   //1
#define GREEN   "\033[32m"   //2 
#define RED     "\033[91m"   //3
#define PURPLE  "\033[35m"   //4
#define YELLOW  "\033[33m"   //5
#define TURQ    "\033[94m"   //6
#define SEVEN   "\033[37m"   //7 (light gray)
#define EIGHT   "\033[90m"   //8 (dark gray)

#define DIFFICULTY	99

using std::cin;
using std::cout;

int game = 1; //while game == 1, keep playing, game==0 is game over (win or lose)
int win = 0;

typedef class Cell {
public:
	int behind; //location of bombs: 0 no bomb, 1 bomb
	int hasbeenpressed; //if player has pressed a location yet: 0 not pressed, 1 pressed
	int numberofbombs; //number 0-8 or 9 (bomb) depending on bomb location
} Cell_t; //[row][col]

Cell_t board[16][30]; 


//what is displayed to player: 
			   //white zero unknown, colored numbers 0-8 number of bombs, x bomb, ! and ?


/* generateboard(): called once
this generates the bombs for board[16][30].behind...
takes in account player's initial touch of some location a,b, so board[a][b].behind does not contain bomb
*/
void generateboard(int r, int c) {

	board[r - 1][c - 1].hasbeenpressed = 1;

	for (int counter = 0; counter < DIFFICULTY; counter++) { // https://stackoverflow.com/a/19728404
	reset:
		std::random_device rd;
		std::mt19937 rng(rd());
		std::uniform_int_distribution<int> unir(0, 15);
		std::uniform_int_distribution<int> unic(0, 29);

		int randrow = unir(rng);
		int randcol = unic(rng);

		if ((board[randrow][randcol].behind == 1) || ((randrow == (r - 1)) && (randcol == (c - 1))))
			goto reset; //the first box that you click will never have a mine

		board[randrow][randcol].behind = 1;
	}

}

//used in connectedzero() and marknumb()
int* edge(int a, int b) {
	int ans[4] = { 0 };

	ans[0] = (a > 0) ? (a - 1) : (a); //row (range for edges: 0 and 15)
	ans[1] = (a < 15) ? (a + 2) : (a + 1);
	ans[2] = (b > 0) ? (b - 1) : (b); //col (range for edges o and 29)
	ans[3] = (b < 29) ? (b + 2) : (b + 1);

	return ans;
}

/* connectedzero(): if number of bombs in location == 0 and is connected to location that hasbeenpressed, marks as hasbeenpressed
*/
void connectedzero() {
	int yor = 0;
	do {

		for (int a = 0; a < 16; a++) {
			for (int b = 0; b < 30; b++) {

				if ((board[a][b].numberofbombs == 0) && (board[a][b].hasbeenpressed == 1)) {

					for (int ex = edge(a,b)[0]; ex < edge(a,b)[1]; ex++) {
						for (int ey = edge(a,b)[2]; ey < edge(a,b)[3]; ey++) {

							if (board[ex][ey].hasbeenpressed != 1) 
								yor += 1;
							board[ex][ey].hasbeenpressed = 1;
						}
					}

				}

			}
		}

		yor -= 1;

	} while (yor > 0);
}

/* marknumb(): called once
 board[a][b].numberofbombs = 0-8 -> number of bombs around point a,b:
	0 0 0
	0 x 0
	0 0 0
board[a][b].numberofbombs = 9 -> this point a,b is a bomb
*/
void marknumb() {
	for (int a = 0; a < 16; a++) {
		for (int b = 0; b < 30; b++) {

			if (board[a][b].behind == 0) { //not a bomb

				int howmanybombs = 0;

				for (int ex = edge(a, b)[0]; ex < edge(a, b)[1]; ex++)
					for (int ey = edge(a, b)[2]; ey < edge(a, b)[3]; ey++)
						if (board[ex][ey].behind == 1) 
							howmanybombs += 1;

				board[a][b].numberofbombs = howmanybombs;

			}
			else { //bomb here
				board[a][b].numberofbombs = 9;
			}

		}
	}
	connectedzero();
}

//used in display():
std::string which_color(int x)
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
	}
}

//used in display():
std::string input_choice(int x)
{
	switch (x) {
	case 0: return "O";
	case 2: return "!";
	case 3: return "?";
	}
}

/* display(): called every time player inputs a location until game end (game == 0)
prints all 16 rows of 30 depending on board.hasbeenpressed and board.numberofbombs
*/
void display() {
	int numppp = 1;
	cout << "   1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30\n";
	for (int row = 0; row < 16; row++) {
		cout << numppp << " ";
		if (numppp < 10) cout << " ";
		numppp += 1;
		for (int col = 0; col < 30; col++) {

			if ((game == 0)&&(board[row][col].behind == 1))
					board[row][col].hasbeenpressed = 1;

			if (board[row][col].hasbeenpressed == 1) {
				if (board[row][col].numberofbombs == 9) std::cout << BOMB << "*" << RESET << "  ";
				else cout << which_color(board[row][col].numberofbombs) << board[row][col].numberofbombs << RESET << "  ";
			}
			else cout << input_choice(board[row][col].hasbeenpressed) << "  ";

		}
		cout << "\n";
	}
}

// changepress(int raww, int caww, char decision): marks locations that have been pressed by player, changes hasbeenpressed
void changepress(int raww, int caww, char decision) {
	raww--;
	caww--;

	int hbp = 0;
	if (decision == 'e') 
		hbp = 1;
	else if (decision == '!') 
		hbp = 2;
	else if (decision == '?') 
		hbp = 3;
	else 
		cout << "That is not a valid mark.\n\n";
	board[raww][caww].hasbeenpressed = hbp;

	if ((board[raww][caww].behind == 1) && (board[raww][caww].hasbeenpressed == 1)) {//which means player pressed bomb
		cout << "\n\n";
		game = 0;
	}

	connectedzero();

}

int main() {

	std::cout << "MINESWEEPER \n";
	display();

	int roww;
	int coll;
	cout << "\nInput row (from 1-16): ";
	cin >> roww;
	cout << "Input column (from 1-30): ";
	cin >> coll;
	cout << "\n";
	generateboard(roww, coll); //called once, generates bombs

	marknumb(); //called once, marks number of bombs around each location

	display();

	int rroww;
	int ccoll;
	char ddecc;
	while (game == 1) {
		cout << "\nInput row (from 1-16): ";
		cin >> rroww;
		cout << "Input column (from 1-30): ";
		cin >> ccoll;
		cout << "What to do with this location?  enter: \n'e' - press this location\n'!' - mark this as bomb\n'?' - mark this as unknown\n";
		cin >> ddecc;

		cout << "\n";
		changepress(rroww, ccoll, ddecc);

		display();
	}

	if (win == 1) {
		cout << "\nCONGRATULATIONS! YOU WON MINESWEEPER!\n";
	}
	else {
		cout << "\nYOU LOST\n";
	}

}