// 랭킹 등록: 답안(정답 여부)을 서버가 다시 채점해 저장한다. 공개 정보는 닉네임 첫 글자·나이대·예상 IQ뿐.
// shortcut: 호출 횟수 제한 없음(기기당 1건만 최고점 유지), 트래픽이 늘거나 어뷰징이 보이면 IP 제한 추가
const S = require("./_rank"), { iqItems, iqScore } = require("./_iqcore");
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!S.on) return res.status(503).json({ ok: false, off: true });
  let b = req.body;
  try { if (typeof b === "string") b = JSON.parse(b || "{}"); } catch (e) { return res.status(400).json({ ok: false }); }
  const { rid, band, seed, ans, rt, nick } = b || {};
  if (!/^[A-Za-z0-9]{6,60}$/.test(rid || "") || !["a", "b", "c"].includes(band) || !Number.isInteger(seed) || seed < 0 || seed > 3 ||
      !Array.isArray(ans) || ans.length !== 30 || !ans.every((x) => Number.isInteger(x) && x >= 0 && x < 4))
    return res.status(400).json({ ok: false });
  const its = iqItems(band, seed), ok = its.map((it, i) => (ans[i] === it.a ? 1 : 0));
  const s = iqScore(its, ok, Array.isArray(rt) ? rt : []).sum;
  const m = (String(nick || "").replace(/[^가-힣a-zA-Z0-9]/g, "").slice(0, 1) || "아") + "●●", score = s.v * 100 + s.n;
  try {
    const r = await S.pipe([
      ["ZADD", "iq:" + band, "GT", score, rid], ["ZADD", "iq:all", "GT", score, rid],
      ["HSET", "iq:info", rid, JSON.stringify({ m, b: band })],
      ["ZSCORE", "iq:" + band, rid], ["ZREVRANK", "iq:" + band, rid], ["ZCARD", "iq:" + band],
      ["ZREVRANK", "iq:all", rid], ["ZCARD", "iq:all"]]);
    res.json({ ok: true, v: Math.floor(Number(r[3]) / 100), rank: r[4] + 1, total: r[5], allRank: r[6] + 1, allTotal: r[7] });
  } catch (e) { res.status(500).json({ ok: false }); }
};
