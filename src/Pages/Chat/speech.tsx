import useApi from '../../hooks/useAPI';

const audioInstances: Record<number, HTMLAudioElement | null> = {};
const useTextToSpeech = () => {
    const { postDataJson } = useApi();

    const base64ToBlob = (base64: string, mimeType: string): Blob => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length)
            .fill(0)
            .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };

    const stopSpeech = (indexToKeep: number) => {

        if (audioInstances[indexToKeep]) {
            audioInstances[indexToKeep]?.pause();
            audioInstances[indexToKeep]?.remove();
            delete audioInstances[indexToKeep];
        }
        for (const key in audioInstances) {
            if (+key !== indexToKeep && audioInstances[key]) {
                audioInstances[key]?.pause();
                delete audioInstances[key];
            }
        }
    };
    const stopSpeechs = () => {
        for (const key in audioInstances) {
            const instance = audioInstances[key];
            if (instance) {
              instance.pause();
              instance.remove();
              delete audioInstances[key];
            }
          }
    };

    const MAX_CHARS = 300; // Adjust based on what your API handles comfortably
    const splitTextIntoChunks = (text: string, maxLength: number): string[] => {
        const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
        const chunks: string[] = [];
        let currentChunk = '';

        for (const sentence of sentences) {
            if ((currentChunk + sentence).length <= maxLength) {
                currentChunk += sentence;
            } else {
                if (currentChunk) chunks.push(currentChunk.trim());
                currentChunk = sentence;
            }
        }
        if (currentChunk) chunks.push(currentChunk.trim());

        return chunks;
    };
    const textToSpeech = async (texts: string, index: number) => {
        stopSpeech(index); // Stop any previous playback
        // Example: Ensure it's a string
        const text = Array.isArray(texts) ? texts[0] : texts;
        const chunks = splitTextIntoChunks(text, MAX_CHARS);
        let currentAudioIndex = 0;

        const playChunk = async () => {
            if (currentAudioIndex >= chunks.length) {
                delete audioInstances[index];
                return;
            }

            const payload = {
                text: chunks[currentAudioIndex],
                lang: "en",
                language_code: "en-IN",
                voice_name: "en-IN-Wavenet-E"
            };

            try {
                const response = await postDataJson("chat/translation", payload);
                const audioBlob = base64ToBlob(response?.data?.audio_base64, "audio/mpeg");
                const audioUrl = URL.createObjectURL(audioBlob);
                const audioElement = new Audio(audioUrl);

                audioInstances[index] = audioElement;
                audioElement.play();

                audioElement.onended = () => {
                    currentAudioIndex++;
                    playChunk(); // Play next chunk
                };
            } catch (err) {
                console.error("Error playing chunk:", err);
            }
        };

        playChunk();
    }

    return { textToSpeech, stopSpeech,stopSpeechs};
};

export default useTextToSpeech;
