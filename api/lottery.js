export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=3600');

  const gameMap = {
    superlotto: 'SuperLotto638',
    lotto:      'Lotto649',
    daily539:   'Daily539',
    star3:      'Lotto3',
    star4:      'Lotto4',
  };

  const gameId = req.query.game || 'superlotto';
  const gameCode = gameMap[gameId];

  if (!gameCode) {
    return res.status(400).json({ error: 'Invalid game' });
  }

  try {
    const url = `https://www.pilio.idv.tw/lto/list.asp`;
    const response = await fetch(url);
    const html = await response.text();

    const rows = [];
    const tableRegex = /(\d{2}\/\d{2})\s+26[^|]*\|\s*([\d,\s]+)\|\s*(\d+)/g;
    let match;

    while ((match = tableRegex.exec(html)) !== null) {
      const dateStr = match[1];
      const ballsStr = match[2];
      const special = parseInt(match[3]);
      const balls = ballsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const [month, day] = dateStr.split('/');
      const date = `2026/${month}/${day}`;

      if (balls.length >= 5) {
        rows.push({ date, balls, special });
      }
    }

    if (rows.length === 0) {
      const fallback = await fetch(
        `https://gaze.nta.gov.tw/lottoApiWeb/getLotteryInfo?gameNo=${gameCode}&pageNum=1&pageSize=20`
      );
      const json = await fallback.json();
      const info = json?.body?.info || [];
      const data = info.map(item => ({
        date: (item.issueDate || '').replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3'),
        period: item.issueNo || '',
        balls: [item.no1,item.no2,item.no3,item.no4,item.no5,item.no6]
          .filter(Boolean).map(Number),
        special: item.no7 ? Number(item.no7) : undefined,
      }));
      return res.status(200).json({ success: true, source: 'government', data });
    }

    return res.status(200).json({ success: true, source: 'pilio', data: rows });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
