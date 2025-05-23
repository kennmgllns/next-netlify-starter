export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { lat, lng, sensor } = req.body;

  // Access environment variables
  const binId = process.env.JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY;

  // Call JSONBin API to update the data
  const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey,
      'X-Bin-Versioning': 'false',
    },
    body: JSON.stringify({ lat, lng, sensor }),
  });

  if (!response.ok) {
    return res.status(500).json({ message: 'Failed to update JSONBin' });
  }

  res.status(200).json({ message: 'Coordinates updated successfully' });
}
