const fs = require('fs');

// Load your Chalebast JSON
const data = JSON.parse(fs.readFileSync('chalebast.json', 'utf8'));

// 1. Map List IDs to Names (e.g., "67a7cf..." -> "Upper City")
const listMap = {};
data.lists.forEach(list => {
  listMap[list.id] = list.name;
});

// 2. Extract the Juice
const loreLibrary = data.cards.map(card => ({
  name: card.name,
  category: listMap[card.idList],
  description: card.desc,
  lastUpdated: card.dateLastActivity,
  labels: card.labels.map(l => l.name)
})).filter(entry => entry.description.trim() !== ""); // Ignore empty cards

// 3. Save the Clean Version
fs.writeFileSync('chalebast_lore_clean.json', JSON.stringify(loreLibrary, null, 2));

console.log(`Processed ${loreLibrary.length} lore entries!`);