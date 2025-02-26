import { useState } from 'react';
import videos from '../data/videos.json';

function useVoiceCommand(setCurrentVideo) {
    const [listening, setListening] = useState(false);

    const startListening = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'pt-BR';
        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            const allVideos = [...videos.desenhos, ...videos.filmes, ...videos.musicas];
            const found = allVideos.find(v => v.title.toLowerCase().includes(command));
            if (found) setCurrentVideo(found);
            else alert('Não encontrei esse vídeo!');
        };
        recognition.start();
    };

    return { listening, startListening };
}

export default useVoiceCommand;