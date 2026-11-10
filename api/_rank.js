// 랭킹 저장소: Upstash Redis REST (Vercel 스토리지 연동 시 KV_REST_API_* 또는 UPSTASH_REDIS_REST_* 환경변수가 자동으로 들어옴)
const U = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const T = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
exports.on = !!(U && T);
exports.pipe = async (cmds) => {
  const r = await fetch(U.replace(/\/$/, "") + "/pipeline", { method: "POST", headers: { Authorization: "Bearer " + T }, body: JSON.stringify(cmds) });
  if (!r.ok) throw new Error("store " + r.status);
  return (await r.json()).map((x) => { if (x.error) throw new Error(x.error); return x.result; });
};
