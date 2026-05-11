const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800');

  const gameId = req.query.game || 'superlotto';

  try {
    const dataPath = path.join(process.cwd(), 'api/data.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const allData = JSON.parse(raw);
    const data = allData[gameId] || [];
    
    return res.status(200).json({
      success: true,
      count: data.length,
      lastUpdated: allData.lastUpdated || new Date().toISOString(),
      data
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
