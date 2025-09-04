//StefanLinn2

// I'm designing this because my players keep asking me what 
//my NPC's names are and I am fumbling bad

let firstNames = ["Alaric", "Bryn", "Cedric", "Daria"];
let lastNames = ["Ironfoot", "Silverleaf", "Stormwind"];
let occupations = ["blacksmith", "apothecary", "merchant", "guard"];
let traits = ["grumpy", "cheerful", "secretive", "clumsy"];

function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateNPC() {
  const name = `${randomPick(firstNames)} ${randomPick(lastNames)}`;
  const occupation = randomPick(occupations);
  const trait = randomPick(traits);
  return `${name}, a ${trait} ${occupation}`;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  document.getElementById("output").textContent = generateNPC();
});
