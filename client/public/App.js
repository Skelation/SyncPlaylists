const express = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const clientId = 'your-google-client-id'; // Replace with your actual Google Client ID
const client = new OAuth2Client(clientId);

app.post('/handleAuth', async (req, res) => {
  const idToken = req.body.credential;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    const userId = payload.sub;

    // Process user information, create/update account, etc.
    // Your implementation here...

    console.log('User ID:', userId);
    console.log('User Email:', payload.email);

    // Redirect or respond based on your application flow
    res.json({ success: true, message: 'Authentication successful' });
  } catch (error) {
    console.error('Error handling authentication:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});