const crypto = require("crypto");
module.exports = (req, res) => {
  const { o = "", s = "" } = req.query || {};
  const sig = crypto.createHmac("sha256", process.env.PAY_SIGN_KEY || "x").update(o + "|3900").digest("hex").slice(0, 32);
  res.setHeader("Cache-Control", "no-store");
  res.json({ ok: !!process.env.PAY_SIGN_KEY && s === sig });
};
