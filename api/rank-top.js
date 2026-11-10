// 랭킹 상위 20명 + 도전자 수 (band: a·b·c·all). 저장소가 아직 연결되지 않았으면 ok:false
const S = require("./_rank");
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=60");
  if (!S.on) return res.json({ ok: false, off: true });
  const band = ["a", "b", "c", "all"].includes(req.query && req.query.band) ? req.query.band : "all", key = "iq:" + band;
  try {
    const [z, n] = await S.pipe([["ZREVRANGE", key, 0, 19, "WITHSCORES"], ["ZCARD", key]]);
    const ids = z.filter((_, i) => i % 2 === 0);
    const info = ids.length ? (await S.pipe([["HMGET", "iq:info", ...ids]]))[0] : [];
    res.json({ ok: true, total: n, list: ids.map((id, i) => { let o = {}; try { o = JSON.parse(info[i] || "{}"); } catch (e) {} return { r: i + 1, m: o.m || "아●●", b: o.b || "a", v: Math.floor(Number(z[2 * i + 1]) / 100) }; }) });
  } catch (e) { res.json({ ok: false }); }
};
