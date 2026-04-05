const fs = require('fs');

async function fetchSuperlotto() {
  try {
    const res = await fetch('https://www.pilio.idv.tw/lto/list.asp', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html',
      }
    });
    const html = await res.text();
    const rows = [];

    const dateRegex = /date-cell[^>]*>([\d\/]+)<br>/g;
    const numRegex = /number-cell[^>]*>\s*([\d,&nbsp;\s]+?)\s*<\/td>/g;
    const bonusRegex = /bonus-cell[^>]*>([\d]+)<\/td>/g;

    const dates = [];
    const nums = [];
    const bonuses = [];

    let m;
    while ((m = dateRegex.exec(html)) !== null) dates.push(m[1]);
    while ((m = numRegex.exec(html)) !== null) nums.push(m[1]);
    while ((m = bonusRegex.exec(html)) !== null) bonuses.push(m[1]);

    for (let i = 0; i < dates.length; i++) {
      const dateStr = dates[i];
      const [monthDay] = dateStr.split('\n');
      const [month, day] = monthDay.trim().split('/');
      const balls = (nums[i] || '').replace(/&nbsp;/g, '').split(',')
        .map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
      const special = parseInt(bonuses[i] || '0');

      if (balls.length === 6 && special >= 1 && special <= 8) {
        rows.push({
          date: `2026/${month.trim().padStart(2,'0')}/${day.trim().padStart(2,'0')}`,
          balls,
          special
        });
      }
    }

    console.log('威力彩找到', rows.length, '筆');
    if (rows.length > 0) console.log('最新:', JSON.stringify(rows[0]));
    return rows;
  } catch(e) {
    console.log('Error:', e.message);
    return [];
  }
}

async function main() {
  console.log('開始抓取...');
  const superlotto = await fetchSuperlotto();

  const result = {
    superlotto,
    lotto: [],
    daily539: [],
    star3: [],
    star4: [],
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync('api/data.json', JSON.stringify(result, null, 2));
  console.log('✅ 完成！');
}

main();
