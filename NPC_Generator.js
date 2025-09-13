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

function articleFor(word) {
  return /^[aeiouAEIOU]/.test(word) ? "an" : "a";
}

function generateTraitRole() {
  let trait = randomPick(traits);
  let occupation = randomPick(occupations);
  let article = articleFor(trait); 
  return `, ${article} ${trait} ${occupation}`;
}

function weightedStyle(baseStyle) {
  let weights = {
    openVowels: { openVowels: 0.8, melodic: 0.2 },
    softConsonants: { softConsonants: 0.7, melodic: 0.2, complexClusters: 0.1 },
    melodic: { melodic: 0.7, openVowels: 0.2, softConsonants: 0.1 },
    harshConsonants: { harshConsonants: 0.8, complexClusters: 0.2 },
    complexClusters: { complexClusters: 0.7, harshConsonants: 0.2, softConsonants: 0.1 }
  };

  let table = weights[baseStyle];
  if (!table) return baseStyle;

  let roll = Math.random();
  let cumulative = 0;

  for (let style in table) {
    cumulative += table[style];
    if (roll <= cumulative) return style;
  }

  return baseStyle;
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
      let consonantSyllables = candidateArray.filter(s => !/^[aeiouAEIOU]/.test(s));
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

function generateNPC(phoneticStyle, includeTraitRole = false, surnameType = null, strictPhonetic = true) {
  let firstName = generateName(phoneticStyle);
  let secondaryStyle = strictPhonetic ? phoneticStyle : randomPick(Object.keys(syllableData));
  let fullName = firstName;

  if (surnameType === "fixedFamily") {
    fullName = fixedFamilyName(firstName, phoneticStyle);
  }
  else if (surnameType === "patronymic") {
    fullName = patronymic(firstName, "Drosven", secondaryStyle);
  }
  else if (surnameType === "matronymic") {
    fullName = matronymic(firstName, "Mira", secondaryStyle);
  }
  else if (surnameType === "locative") {
    let place = generateName(secondaryStyle);
    fullName = locative(firstName, place);
  }
  else if (surnameType === "epithet") {
    let trait = randomPick(traits);
    fullName = epithet(firstName, trait, secondaryStyle);
  }
  else if (surnameType === "houseClan") {
    let house = generateName(secondaryStyle);
    fullName = houseClan(firstName, house);
  }
  else if (surnameType === "honorific") {
    fullName = honorific(firstName, "Lightbringer");
  }

  if (includeTraitRole) {
    fullName += generateTraitRole();
  }
  return fullName;
}


function fixedFamilyName(firstName, phoneticStyle) {
  let familyName = generateName(phoneticStyle, 1, 2);
  return `${firstName} ${familyName}`;
}

function patronymic(firstName, fatherName, cultureStyle = "harshConsonants") {
  let suffix = "son";
  if (cultureStyle === "softConsonants" || cultureStyle === "melodic") suffix = "iel";
  if (cultureStyle === "complexClusters") suffix = "sson";
  return `${firstName} ${fatherName}${suffix}`;
}

function matronymic(firstName, motherName, cultureStyle = "softConsonants") {
  let suffix = "dottir";
  if (cultureStyle === "melodic") suffix = "iel";
  if (cultureStyle === "complexClusters") suffix = "dottir";
  return `${firstName} ${motherName}${suffix}`;
}

function locative(firstName, placeName) {
  return `${firstName} of ${placeName}`;
}

function epithet(firstName, trait, cultureStyle = "melodic") {
  let lastPart = generateName(cultureStyle, 1, 2);
  return `${firstName} the ${trait} ${lastPart}`;
}

function houseClan(firstName, houseName) {
  return `${firstName} of House ${houseName}`;
}

function honorific(firstName, title) {
  return `${firstName} the ${title}`;
}


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("generateBtn").addEventListener("click", function () {
    let phoneticStyle = document.getElementById("styleSelect").value;
    document.getElementById("npcText").textContent = generateNPC(phoneticStyle);
  });
});
