// NPC Generator
// StefanLinn2

let traits = ["grumpy", "cheerful", "secretive", "clumsy", "stern", "cunning"];
let occupations = ["blacksmith", "apothecary", "merchant", "guard", "bard", "scholar"];

function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateName(phoneticStyle, minSyllables = 1, maxSyllables = 4) {
  let parts = syllableData[phoneticStyle];
  if (!parts) return "Unknown";

  let syllableCount = Math.floor(Math.random() * (maxSyllables - minSyllables + 1)) + minSyllables;
  let name = "";
  let lastWasVowel = false;

  let first = randomPick(parts.prefix);
  name += first;
  lastWasVowel = /[aeiouAEIOU]$/.test(first);

  for (let i = 1; i < syllableCount - 1; i++) {
    let candidateArray;

    if (lastWasVowel) {
      candidateArray = [];
      for (let j = 0; j < parts.middle.length; j++) {
        let syll = parts.middle[j];
        if (!/^[aeiouAEIOU]/.test(syll)) {
          candidateArray.push(syll);
        }
      }
      if (candidateArray.length === 0) candidateArray = parts.middle;
    } else {
      candidateArray = parts.middle;
    }

    let syllable = randomPick(candidateArray);
    if (i > 1 && Math.random() < 0.15) {
      name += "-";
      capitalizeNext = true;
    }

    if (capitalizeNext) {
      syllable = syllable.charAt(0).toUpperCase() + syllable.slice(1);
      capitalizeNext = false;
    }
    name += syllable;
    lastWasVowel = /[aeiouAEIOU]$/.test(syllable);
  }

  let last = randomPick(parts.suffix);
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

