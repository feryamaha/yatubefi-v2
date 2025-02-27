const express = require('express');
const crypto = require('crypto');
const fetch = require('node-fetch');
const fs = require('fs');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Configura CORS para permitir requisições de https://feryamaha.github.io
app.use(cors({
    origin: 'https://feryamaha.github.io',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const FORM_PASSWORD_HASH = process.env.FORM_PASSWORD_HASH;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!GITHUB_TOKEN || !FORM_PASSWORD_HASH || !ENCRYPTION_KEY) {
    throw new Error('Variáveis de ambiente não definidas. Verifique o Vercel ou .env.');
}

const encryptData = (data) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
};

const decryptData = (encryptedData) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(encryptedData.iv, 'hex'));
    let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
};

const verifyPassword = (inputPassword) => {
    const hash = crypto.createHash('sha256').update(inputPassword).digest('hex');
    return hash === FORM_PASSWORD_HASH;
};

let encryptedVideos = {};
try {
    const encryptedContent = fs.readFileSync('encrypted-dynamic-videos.json', 'utf8');
    encryptedVideos = JSON.parse(encryptedContent);
} catch (error) {
    encryptedVideos = { desenhos: [], filmes: [], musicas: [] };
    fs.writeFileSync('encrypted-dynamic-videos.json', JSON.stringify(encryptData(encryptedVideos)));
}

app.post('/api/verify-password', (req, res) => {
    const { password } = req.body;
    const isValid = verifyPassword(password);
    res.json({ valid: isValid });
});

app.post('/api/manage-videos', async (req, res) => {
    const { password, action, video, videoId } = req.body;

    if (!password || !verifyPassword(password)) {
        return res.status(401).json({ error: 'Senha incorreta!' });
    }

    let videos = decryptData(encryptedVideos);
    let updatedVideos = { ...videos };

    if (action === 'add') {
        updatedVideos[video.category.toLowerCase()].push(video);
    } else if (action === 'edit') {
        updatedVideos[video.category.toLowerCase()] = updatedVideos[video.category.toLowerCase()].map(v =>
            v.id === video.id ? video : v
        );
    } else if (action === 'delete') {
        updatedVideos = {
            desenhos: updatedVideos.desenhos.filter(v => v.id !== videoId),
            filmes: updatedVideos.filmes.filter(v => v.id !== videoId),
            musicas: updatedVideos.musicas.filter(v => v.id !== videoId),
        };
    }

    encryptedVideos = encryptData(updatedVideos);
    fs.writeFileSync('encrypted-dynamic-videos.json', JSON.stringify(encryptedVideos));

    if (GITHUB_TOKEN) {
        try {
            const response = await fetch(
                `https://api.github.com/repos/feryamaha/yatubefi-v2/contents/data/dynamic-videos.json`,
                {
                    headers: {
                        Authorization: `token ${GITHUB_TOKEN}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                }
            );
            const data = await response.json();
            if (!response.ok) throw new Error('Erro ao buscar SHA: ' + data.message);
            const sha = data.sha;

            const content = btoa(JSON.stringify(encryptData(updatedVideos), null, 2));
            const updateResponse = await fetch(
                `https://api.github.com/repos/feryamaha/yatubefi-v2/contents/data/dynamic-videos.json`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `token ${GITHUB_TOKEN}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                    body: JSON.stringify({
                        message: 'Atualizar dynamic-videos.json via backend (criptografado)',
                        content: content,
                        sha: sha,
                        branch: 'main',
                    }),
                }
            );

            if (!updateResponse.ok) throw new Error('Erro ao atualizar o GitHub');
        } catch (error) {
            console.error('Erro na API do GitHub:', error);
            return res.status(500).json({ error: 'Erro ao sincronizar com o GitHub.' });
        }
    }

    res.json({ message: 'Vídeos atualizados com sucesso!', videos: updatedVideos });
});

app.get('/api/videos', (req, res) => {
    const videos = decryptData(encryptedVideos);
    res.json(videos);
});

app.use(express.static('../dist'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;