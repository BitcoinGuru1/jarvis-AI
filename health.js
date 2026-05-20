module.exports = async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    service: "jarvis-content-agent",
    timestamp: new Date().toISOString()
  });
};
