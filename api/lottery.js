export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800');

  const gameId = req.query.game || 'superlotto';

  const hardcodedData = {
    superlotto: [
      { date:"2026/04/02", period:"115000025", balls:[5,15,17,23,25,34], special:6 },
      { date:"2026/03/30", period:"115000024", balls:[2,13,21,22,29,34], special:1 },
      { date:"2026/03/26", period:"115000023", balls:[13,14,22,28,35,38], special:5 },
      { date:"2026/03/23", period:"115000022", balls:[1,9,18,28,33,38], special:5 },
      { date:"2026/03/19", period:"115000021", balls:[9,13,14,18,31,34], special:1 },
      { date:"2026/03/16", period:"115000020", balls:[14,26,28,31,32,34], special:1 },
      { date:"2026/03/12", period:"115000019", balls:[4,9,15,25,27,31], special:8 },
      { date:"2026/03/09", period:"115000018", balls:[1,11,14,17,29,32], special:8 },
      { date:"2026/03/05", period:"115000017", balls:[7,11,14,32,36,38], special:2 },
      { date:"2026/03/02", period:"115000016", balls:[7,9,11,23,25,29], special:5 },
    ],
    lotto: [
      { date:"2026/04/03", period:"115000028", balls:[8,14,19,27,33,45], special:12 },
      { date:"2026/03/31", period:"115000027", balls:[3,11,18,24,36,42], special:29 },
      { date:"2026/03/27", period:"115000026", balls:[6,12,21,28,35,48], special:17 },
    ],
    daily539: [
      { date:"2026/04/04", period:"115000094", balls:[5,11,19,26,33] },
      { date:"2026/04/03", period:"115000093", balls:[2,8,15,22,30] },
      { date:"2026/04/02", period:"115000092", balls:[7,14,21,28,36] },
    ],
    star3: [
      { date:"2026/04/04", period:"115000072", balls:[4,8,2] },
      { date:"2026/04/03", period:"115000071", balls:[7,1,5] },
    ],
    star4: [
      { date:"2026/04/04", period:"115000072", balls:[4,8,2,6] },
      { date:"2026/04/03", period:"115000071", balls:[7,1,5,3] },
    ],
  };

  const data = hardcodedData[gameId] || [];
  return res.status(200).json({
    success: true,
    count: data.length,
    lastUpdated: "2026/04/05",
    data
  });
}
