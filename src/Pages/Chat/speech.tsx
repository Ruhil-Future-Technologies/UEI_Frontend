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
    const textToSpeech = async (texts: string, index: number) => {
        // Example: Ensure it's a string
    const text = Array.isArray(texts) ? texts[0] : texts;

        const payload = {
            text,
            lang: "en",
            language_code: "en-IN",
            voice_name: "en-IN-Wavenet-E"
        }
        try {
            stopSpeech(index); // Stop any previous playback
            const response = await postDataJson("chat/translation", payload);
            const audioBlob = base64ToBlob(response?.data?.audio_base64, "audio/mpeg");
            const audioUrl = URL.createObjectURL(audioBlob);
            const audioElement = new Audio(audioUrl);
            audioInstances[index] = audioElement;
            audioElement.play();

            audioElement.onended = () => {
                delete audioInstances[index];
            };
        } catch (err) {
            console.error("Error playing audio:", err);
        }
    };

    return { textToSpeech, stopSpeech };
};

export default useTextToSpeech;
