/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: "sk_5c40f43be58ba384e26500279e398f26fd3144059852fde8" });

const audioInstances: Record<number, HTMLAudioElement | null> = {}; // Store multiple audio instances by index

const textToSpeech = async (text: string, index: number) => {
    try {
        // Stop all previous instances except the current one
        stopSpeech(index);

        // const response = await client.textToSpeech.convert(
        //     "Sm1seazb4gs7RSlUVw7c",
        //     {
        //         output_format: "mp3_44100_128",
        //         text: text,
        //         model_id: "eleven_flash_v2_5",
        //     }
        // );
       const response = await client.textToSpeech.convertAsStream(
            "Sm1seazb4gs7RSlUVw7c",
            {
                output_format: "mp3_44100_128",
                text: text,
                model_id: "eleven_flash_v2_5",
            }
        )

        // Convert Readable Stream to ArrayBuffer
        const audioChunks: Uint8Array[] = [];
        for await (const chunk of response as any) {
            audioChunks.push(chunk);
        }

        // Create a Blob from the chunks
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });

        // Generate an Object URL for playback
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);

        audioInstances[index] = audioElement; // Store the new audio instance
        audioElement.play();

        // When the speech finishes, clean up the instance and update UI
        audioElement.onended = () => {
            delete audioInstances[index]; // Remove instance
        };
    } catch (error) {
        console.error("Error generating speech:", error);
    }
};

// Function to stop all audio except the given index
const stopSpeech = (indexToKeep: number) => {
    if (audioInstances[indexToKeep]) {
        audioInstances[indexToKeep]?.pause();
        audioInstances[indexToKeep]?.remove(); // Stop and remove the audio
        delete audioInstances[indexToKeep];
    }
    for (const key in audioInstances) {
        const idx = Number(key);
        if (idx !== indexToKeep && audioInstances[idx]) {
            audioInstances[idx]?.pause();
            delete audioInstances[idx]; // Remove reference
        }
    }
};

export { textToSpeech, stopSpeech };
