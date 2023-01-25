//Define the scale
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
//random number the length of the scale
let number = Math.floor(Math.random() * 7);
//
function getLetter(letters, number) {
	return letters[number];
}

console.log(getLetter(letters, number));
