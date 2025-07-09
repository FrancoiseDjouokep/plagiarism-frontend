export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Méthode ${req.method} non autorisée` });
  }

  try {
    const backendResponse = await fetch('http://192.99.42.107:8090/api/connexion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await backendResponse.json();
    res.status(backendResponse.status).json(data);
    
  } catch (error) {
    console.error("Erreur proxy:", error);
    res.status(500).json({ message: 'Erreur côté proxy', error: error.toString() });
  }
}

