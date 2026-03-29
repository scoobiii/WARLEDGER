import { GoogleGenAI } from "@google/genai";

export interface VideoGenerationState {
  id: string;
  part: string;
  prompt: string;
  status: 'idle' | 'generating' | 'done' | 'error';
  url?: string;
  operationId?: string;
}

export async function generateWarVideo(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  return operation;
}

export async function checkVideoStatus(operationName: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const operation = await ai.operations.getVideosOperation({
    operation: { name: operationName } as any
  });
  return operation;
}

export async function fetchVideoBlob(uri: string) {
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      'x-goog-api-key': process.env.API_KEY || '',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch video');
  return await response.blob();
}
