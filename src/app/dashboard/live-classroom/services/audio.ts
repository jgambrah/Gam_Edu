
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
  // 16-bit PCM to Float32 conversion
  const numSamples = bytes.length / 2;
  const audioBuffer = context.createBuffer(channels, numSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  for (let i = 0; i < numSamples; i++) {
    const intSample = (bytes[i * 2 + 1] << 8) | bytes[i * 2];
    const signedSample = intSample > 32767 ? intSample - 65536 : intSample;
    channelData[i] = signedSample / 32768.0; // Normalize for speakers
  }
  return audioBuffer;
};

/**
 * Creates a Blob from a Float32Array, typically from an audio buffer.
 * @param data The Float32Array audio data.
 * @returns A Blob object.
 */
export const createBlob = (data: Float32Array): Blob => {
  return new Blob([data.buffer as ArrayBuffer], { type: 'application/octet-stream' });
};
