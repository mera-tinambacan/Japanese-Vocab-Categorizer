const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config({ path: '../.env' });

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

    const vocabSchema = new mongoose.Schema({
        word: String,
        level: String,
        on: String,   // On reading
        kun: String,  // Kun reading
        eng: String   // English meaning
    });

const Vocab = mongoose.model('Vocab', vocabSchema);

// Endpoint to retrieve vocabulary
app.get('/api/vocab', async (req, res) => {
    const vocabList = await Vocab.find();
    res.json(vocabList);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});