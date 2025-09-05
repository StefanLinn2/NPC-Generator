// NPC Generator
// StefanLinn2

let occupations = ["blacksmith", "apothecary", "merchant", "guard"];
let traits = ["grumpy", "cheerful", "secretive", "clumsy"];

function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateName(race) {
  let parts = syllableData[race];
  if (!parts) return "Unknown";

  let name = randomPick(parts.prefix);
  if (Math.random() > 0.5) name += randomPick(parts.middle);
  name += randomPick(parts.suffix);

  return name;
}

function generateNPC(race) {
  let name = generateName(race);
  let occupation = randomPick(occupations);
  let trait = randomPick(traits);
  return `${name}, a ${trait} ${occupation}`;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  let race = document.getElementById("styleSelect").value;
  document.getElementById("output").textContent = generateNPC(race);
});
