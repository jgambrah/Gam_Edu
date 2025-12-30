
'use client';

let globalAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!globalAudioCtx) {
    globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return globalAudioCtx;
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes raw 16-bit PCM data into an AudioBuffer.
 * Handles potential alignment issues by slicing the buffer to ensure
 * the Int16Array constructor doesn't throw if byteOffset is odd.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  // Ensure the data length is even for 16-bit PCM (2 bytes per sample)
  const lengthInBytes = Math.floor(data.byteLength / 2) * 2;
  
  // Create a clean, aligned copy of the data
  const alignedBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + lengthInBytes);
  const pcmData = new Int16Array(alignedBuffer);
  
  const frameCount = pcmData.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Normalize 16-bit signed PCM [-32768, 32767] to [-1.0, 1.0]
      channelData[i] = pcmData[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Unified helper to play raw PCM base64 audio.
 * Ensures the AudioContext is resumed and handles source lifecycle.
 */
export async function playRawPcm(base64: string): Promise<AudioBufferSourceNode | null> {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const bytes = decode(base64);
    const audioBuffer = await decodeAudioData(bytes, ctx, 24000, 1);
    
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();
    return source;
  } catch (error) {
    console.error("Error playing audio:", error);
    return null;
  }
}

export function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16