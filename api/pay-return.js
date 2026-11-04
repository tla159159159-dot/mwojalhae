// 나이스페이 결제 인증 후 서버 승인 → 서명 발급. 환경변수: NICEPAY_CLIENT_ID, NICEPAY_SECRET, PAY_SIGN_KEY
const crypto = require("crypto");
const PRICE = 3900;
module.exports = async (req, res) => {
  const b = req.body || {}, back = q => { res.statusCode = 302; res.setHeader("Location", "/?" + q); res.end(); };
  try {
    if (b.authResultCode !== "0000" || +b.amount !== PRICE || !/^[\w-]{1,64}$/.test(b.orderId || "")) return back("payfail=1");
    const auth = Buffer.from(process.env.NICEPAY_CLIENT_ID + ":" + process.env.NICEPAY_SECRET).toString("base64");
    const r = await fetch("https://api.nicepay.co.kr/v1/payments/" + encodeURIComponent(b.tid), { method: "POST", headers: { Authorization: "Basic " + auth, "Content-Type": "application/json" }, body: JSON.stringify({ amount: PRICE }) });
    const j = await r.json();
    if (j.resultCode !== "0000") return back("payfail=1");
    const sig = crypto.createHmac("sha256", process.env.PAY_SIGN_KEY).update(b.orderId + "|" + PRICE).digest("hex").slice(0, 32);
    back("paid=" + encodeURIComponent(b.orderId) + "&sig=" + sig);
  } catch (e) { back("payfail=1"); }
};
