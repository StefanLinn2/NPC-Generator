// NPC Generator
// StefanLinn2

let traits = [
  "grumpy", "cheerful", "secretive", "clumsy", "stern", "cunning",
  "brave", "cowardly", "arrogant", "loyal", "greedy", "curious",
  "eccentric", "quiet", "talkative", "mischievous", "patient", "reckless",
  "gentle", "moody", "shy", "proud", "superstitious", "methodical"
];

let occupations = [
  "blacksmith", "apothecary", "merchant", "guard", "bard", "scholar",
  "farmer", "hunter", "healer", "tailor", "innkeeper", "sailor",
  "alchemist", "scribe", "ranger", "gladiator", "artisan", "potioneer",
  "noble", "courier", "storyteller", "mapmaker", "clockmaker", "artifact collector"
];

function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateName(phoneticStyle, minSyllables = 1, maxSyllables = 3) {
  let parts = syllableData[phoneticStyle];
  if (!parts) return "Unknown";

  let hyphenChance = 0.25;
  let suffixHyphenChance = 0.8;

  if (phoneticStyle === "openVowels") {
    hyphenChance = 0.5;
    suffixHyphenChance = 0.25;
    maxSyllables -= 1; 
  } 
  if (phoneticStyle === 'softConsonants') {
    hyphenChance = 0.1;
    suffixHyphenChance = 0.1;
  }
  if (phoneticStyle === 'melodic') {
    hyphenChance = 0.1;
    suffixHyphenChance = 0.25;
  }
  if (phoneticStyle === 'harshConsonants') {
    minSyllables += 1;
    maxSyllables += 1;
  }
  if (phoneticStyle === 'complexClusters') {
    minSyllables += 1;
    maxSyllables += 1;
  }

  let syllableCount = Math.floor(Math.random() * (maxSyllables - minSyllables + 1)) + minSyllables;
  let name = "";
  let lastWasVowel = false;

  let first = randomPick(parts.prefix) || "";
  name += first;
  lastWasVowel = /[aeiouAEIOU]$/.test(first);

  for (let i = 1; i < syllableCount - 1; i++) {
    let candidateArray = parts.middle.slice();
    if (candidateArray.length === 0) candidateArray = [""];

    let syllable = randomPick(candidateArray) || "";

    if (lastWasVowel && /^[aeiouAEIOU]/.test(syllable)) {
      let consonantSyllables = [];
      for (let j = 0; j < candidateArray.length; j++) {
        if (!/^[aeiouAEIOU]/.test(candidateArray[j])) {
          consonantSyllables.push(candidateArray[j]);
        }
      }
      if (consonantSyllables.length > 0) syllable = randomPick(consonantSyllables);
    }

    if (Math.random() < hyphenChance) {
      name += "-";
      syllable = syllable.charAt(0).toUpperCase() + syllable.slice(1);
    }

    name += syllable;
    lastWasVowel = /[aeiouAEIOU]$/.test(syllable);
  }

  let last = randomPick(parts.suffix) || "";
  if (lastWasVowel && Math.random() < suffixHyphenChance) {
    name += "-";
    last = last.charAt(0).toUpperCase() + last.slice(1);
  }
  name += last;

  return name;
}


function generateNPC(phoneticStyle) {
  let name = generateName(phoneticStyle);
  let occupation = randomPick(occupations);
  let trait = randomPick(traits);
  return `${name}, a ${trait} ${occupation}`;
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("generateBtn").addEventListener("click", function () {
    let phoneticStyle = document.getElementById("styleSelect").value;
    document.getElementById("output").textContent = generateNPC(phoneticStyle);
  });
});

