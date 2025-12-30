
'use client';

// Decode Base64 string to a Uint8Array.
export const decode = (base64: string): Uint8Array => {
    if (typeof window === 'undefined') return new Uint8Array(0);
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

// Decode raw PCM audio data into an AudioBuffer.
export const decodeAudioData = async (
    rawData: Uint8Array,
    audioContext: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> => {
    const audioBuffer = audioContext.createBuffer(numChannels, rawData.length / 2, sampleRate);
    const pcmData = new Float32Array(rawData.buffer);
    for (let channel = 0; channel < numChannels; channel++) {
        const nowBuffering = audioBuffer.getChannelData(channel);
        for (let i = 0; i < audioBuffer.length; i++) {
            nowBuffering[i] = pcmData[i * 2 + channel] / 32767;
        }
    }
    return audioBuffer;
};

// Play an AudioBuffer and return the source node.
export const playAudioBuffer = (
    audioBuffer: AudioBuffer,
    audioContext: AudioContext
): AudioBufferSourceNode => {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
    return source;
};


/**
 * Creates a Blob from raw PCM audio data.
 * The server expects the audio input in a specific format, and creating a Blob
 * with the correct MIME type is a reliable way to send it.
 * @param pcmData Raw PCM audio data as a Float32Array.
 * @returns A Blob object representing the audio data.
 */
export const createBlob = (pcmData: Float32Array): Blob => {
    return new Blob([pcmData.buffer], { type: 'audio/l16; rate=16000' });
};


/**
 * Decodes a base64 string representing raw PCM audio data, plays it,
 * and returns the AudioBufferSourceNode.
 * @param base64 The base64 encoded audio string.
 * @returns The AudioBufferSourceNode for the playing audio, or null on error.
 */
export async function playRawPcm(base64: string): Promise<AudioBufferSourceNode | null> {
    if (typeof window === 'undefined' || !base64) return null;
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const pcmData = decode(base64);
        
        // Convert Uint8Array to Int16Array, then to Float32Array
        const int16Data = new Int16Array(pcmData.buffer);
        const float32Data = new Float32Array(int16Data.length);
        for(let i = 0; i < int16Data.length; i++) {
            float32Data[i] = int16Data[i] / 32768.0;
        }

        const audioBuffer = audioContext.createBuffer(1, float32Data.length, 24000);
        audioBuffer.getChannelData(0).set(float32Data);
        
        return playAudioBuffer(audioBuffer, audioContext);
    } catch (error) {
        console.error("Failed to play raw PCM:", error);
        return null;
    }
}
