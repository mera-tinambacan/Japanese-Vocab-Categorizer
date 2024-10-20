const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb+srv://admin:admin@zuittbatch243.azu7fek.mongodb.net/Nihongo?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const vocabSchema = new mongoose.Schema({
    word: String,
    level: String,
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
