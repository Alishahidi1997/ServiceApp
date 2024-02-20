export default (f) => (async (req, res) => {
  try {
    const result = await f(req);
    setTimeout(() => { res.status(200).send(result); }, 800);
  } catch (err) {
    setTimeout(() => { res.status(500).send(err && err.message); }, 800);
  }
});
