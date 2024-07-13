const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./moviebuff-3007b-firebase-adminsdk-xbk7v-6fc7a5cfd5.json'); // Replace with your service account key path

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello, MovieBuff Backend!');
});

// Endpoint to get movies by genre
app.get('/movies/:genre', async (req, res) => {
    const genre = req.params.genre;
    try {
        const moviesRef = db.collection(genre); // Assuming collections are named after genres
        const snapshot = await moviesRef.get();
        if (snapshot.empty) {
            res.status(404).send('No matching movies found.');
            return;
        }
        let movies = [];
        snapshot.forEach(doc => {
            movies.push(doc.data());
        });
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
