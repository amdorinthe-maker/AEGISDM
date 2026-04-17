export const processTrelloLore = (rawData: any) => {
  const listMap: Record<string, string> = {};
  rawData.lists.forEach((list: any) => {
    listMap[list.id] = list.name;
  });

  return rawData.cards
    .map((card: any) => ({
      name: card.name,
      category: listMap[card.idList],
      description: card.desc,
      lastUpdated: card.dateLastActivity,
      labels: card.labels.map((l: any) => l.name)
    }))
    .filter((entry: any) => entry.description.trim() !== "");
};