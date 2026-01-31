'use client';

// This is a simplified placeholder implementation for browser environments.
// Real-time audio processing is complex and platform-dependent.

/**
 * Decodes a base64 string into a byte array.
 * @param base64 The base64 encoded string.
 * @returns A Uint8Array of the decoded data.
 */
export const decode = (base64: string): Uint8Array => {
  try {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error("Base64 decoding failed:", error);
    return new Uint8Array();
  }
};

/**
 * Decodes raw audio data (like PCM) into an AudioBuffer for playback.
 * NOTE: This is a simplified version. For true PCM data, you would need to
 * manually populate the buffer channels with the byte data.
 * @param bytes The raw audio byte data.
 * @param context The active AudioContext.
 * @param sampleRate The sample rate of the audio.
 * @param channels The number of audio channels.
 * @returns An AudioBuffer promise.
 */
export const decodeAudioData = async (
  bytes: Uint8Array,
  context: AudioContext,
  sampleRate: number,
  channels: number
): Promise<AudioBuffer> => {
  try {
    // For many simple formats, the browser's decodeAudioData can work if wrapped in a proper container.
    // However, for raw PCM, you'd typically fill the buffer manually.
    // This is a placeholder showing the structure.
    return await context.decodeAudioData(bytes.buffer);
  } catch (error) {
     console.error("decodeAudioData failed, creating silent buffer as fallback:", error);
     // Fallback to a silent buffer to prevent playback errors
     return context.createBuffer(channels, 1, sampleRate);
  }
};

/**
 * Creates a Blob from a Float32Array, typically from an audio buffer.
 * @param data The Float32Array audio data.
 * @returns A Blob object.
 */
export const createBlob = (data: Float32Array): Blob => {
  return new Blob([data.buffer], { type: 'application/octet-stream' });
};
