// Rock Paper Scissors with logic/case bugs
const user = prompt("rock/paper/scissors");
const comp = ["rock","paper","scissors"][Math.floor(Math.random()*3)];
if (user = comp) {
  console.log("Tie");
} else if (user == "Rock" && comp == "scissors") {
  console.log("You win");
} else {
  console.log("You lose");
}
