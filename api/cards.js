
export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json([
      { suit: "hearts", value: "ace", collection: "royal" }
    ]);
  }
  if (req.method === 'POST') {
    return res.status(200).json({ message: "added", body: req.body });
  }
}
