export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=1800');

  const gameMap = {
    superlotto: 'SuperLotto638',
    lotto:      'Lotto649',
    daily539:   'Daily539',
    star3:      'Lotto3',
    star4:      'Lotto4',
  };

  const gameId = req.query.game || 'superlotto';
  const gameCode = gameMap[gameId];
  if (!gameCode) return res.status(400).json({ error: 'Invalid game' });

  try {
    const url = `https://gaze.nta.gov.tw/lottoApiWeb/getLotteryInfo?gameNo=${gameCode}&issueDate=&startIssue=&endIssue=&pageNum=1&pageSize=30`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const json = await response.json();
    const info = json?.body?.info || [];

    const data = info.map(item => ({
      date: (item.issueDate || '').replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3'),
      period: String(item.issueNo || ''),
      balls: [item.no1, item.no2, item.no3, item.no4, item.no5, item.no6]
        .filter(Boolean).map(Number),
      special: item.no7 ? Number(item.no7) : undefined,
    }));

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
