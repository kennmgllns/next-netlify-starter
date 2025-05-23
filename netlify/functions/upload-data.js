// pages/api/upload-data.js

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { lat, lng, sensor } = req.body;

  const response = await fetch('https://api.jsonbin.io/v3/b/6830547e8561e97a501a7a54', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': '$2a$10$IXRMbunUtndT4UBf7rbRveIFEc3UJuey0nbl/8ADpZUKoGJeKEibC', // Get from JSONBin
      'X-Bin-Versioning': 'false'
    },
    body: JSON.stringify({ lat, lng, sensor })
  });

  if (!response.ok) {
    return res.status(500).json({ message: 'Failed to update JSONBin' });
  }

  res.status(200).json({ message: 'Data updated' });
}
