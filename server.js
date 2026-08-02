const express = require('express');
const cors = require('cors');
const { translate, languages } = require('google-translate-api-x');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Endpoint to provide all official Google Translate languages
app.get('/api/languages', (req, res) => {
    try {
        res.json(languages);
    } catch (error) {
        console.error('Error fetching languages:', error);
        res.status(500).json({ error: 'Failed to load languages.' });
    }
});

// Endpoint to handle text translation requests securely
app.post('/api/translate', async (req, res) => {
    try {
        const { text, source, target } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ error: 'Text is required for translation.' });
        }

        const options = { to: target };
        if (source && source !== 'auto') {
            options.from = source;
        }

        const result = await translate(text, options);
        
        res.json({
            translatedText: result.text,
            from: result.from?.language?.iso || source
        });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Failed to process translation. Please try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`Core Translate server running at http://localhost:${PORT}`);
});
