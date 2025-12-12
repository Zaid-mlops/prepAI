import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * FAST CHAT: Uses gemini-2.5-flash-lite for low latency responses.
 */
export const getFastChatResponse = async (history: { role: string, parts: { text: string }[] }[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash-lite', // Requested model for Fast AI responses
      config: {
        systemInstruction: "You are PrepAI, a helpful and fast tutor for software engineering students. Keep answers concise.",
      },
      history: history.map(h => ({ role: h.role, parts: h.parts })),
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Fast Chat Error:", error);
    throw error;
  }
};

/**
 * DEEP CHAT/INTERVIEW: Uses gemini-3-pro-preview for complex reasoning.
 */
export const getProChatResponse = async (prompt: string, context?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: context ? `Context: ${context}\n\nQuestion: ${prompt}` : prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Pro Chat Error:", error);
    throw error;
  }
};

/**
 * QUIZ GENERATION: Uses gemini-2.5-flash for structured JSON output.
 */
export const generateQuizQuestions = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 5 challenging multiple-choice interview questions about ${topic}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctIndex"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    return [];
  }
};

/**
 * LIVE API: Voice Interview using gemini-2.5-flash-native-audio-preview-09-2025
 */
export interface LiveTranscriptEvent {
  role: 'user' | 'model';
  text: string;
  isComplete: boolean;
}

export class LiveInterviewClient {
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private session: any = null;
  private stream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  
  // Transcription State
  private currentInputTranscription = '';
  private currentOutputTranscription = '';

  async connect(onTranscriptUpdate: (event: LiveTranscriptEvent) => void) {
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Establish Live Session
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        systemInstruction: 'You are a strict but fair technical interviewer for a Senior Software Engineer role. Ask one technical question at a time. Wait for the user to answer before providing feedback or moving to the next question. Focus on Data Structures, System Design, and Modern Web Technologies.',
        outputAudioTranscription: {}, // Transcribe model output
        inputAudioTranscription: {},  // Transcribe user input
      },
      callbacks: {
        onopen: () => {
          console.log("Live Session Connected");
          this.startAudioInput(sessionPromise);
        },
        onmessage: async (message: LiveServerMessage) => {
          // 1. Handle Audio Output
          const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioData) {
            await this.playAudio(audioData);
          }
          
          // 2. Handle User Transcription (Input)
          if (message.serverContent?.inputTranscription) {
            const text = message.serverContent.inputTranscription.text;
            this.currentInputTranscription += text;
            onTranscriptUpdate({ 
              role: 'user', 
              text: this.currentInputTranscription, 
              isComplete: false 
            });
          }

          // 3. Handle Model Transcription (Output)
          if (message.serverContent?.outputTranscription) {
            const text = message.serverContent.outputTranscription.text;
            this.currentOutputTranscription += text;
            onTranscriptUpdate({ 
              role: 'model', 
              text: this.currentOutputTranscription, 
              isComplete: false 
            });
          }

          // 4. Handle Turn Completion (Commit transcripts)
          if (message.serverContent?.turnComplete) {
             // Send final update for whatever was in the buffers
             if (this.currentInputTranscription) {
               onTranscriptUpdate({ role: 'user', text: this.currentInputTranscription, isComplete: true });
               this.currentInputTranscription = '';
             }
             if (this.currentOutputTranscription) {
               onTranscriptUpdate({ role: 'model', text: this.currentOutputTranscription, isComplete: true });
               this.currentOutputTranscription = '';
             }
          }
          
          // Handle Interruption
          if (message.serverContent?.interrupted) {
            this.stopAudioOutput();
            this.currentOutputTranscription = ''; // Clear stale output
          }
        },
        onerror: (e) => console.error("Live API Error", e),
        onclose: () => console.log("Live Session Closed"),
      }
    });
    
    this.session = sessionPromise;
    return sessionPromise;
  }

  private startAudioInput(sessionPromise: Promise<any>) {
    if (!this.inputAudioContext || !this.stream) return;

    const source = this.inputAudioContext.createMediaStreamSource(this.stream);
    this.scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
    
    this.scriptProcessor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = this.createBlob(inputData);
      
      sessionPromise.then(session => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    source.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputAudioContext.destination);
  }

  private async playAudio(base64String: string) {
    if (!this.outputAudioContext) return;

    const audioBuffer = await this.decodeAudioData(
      this.decodeBase64(base64String),
      this.outputAudioContext,
      24000,
      1
    );

    this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
    const source = this.outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    // Simple output node
    source.connect(this.outputAudioContext.destination);
    
    source.addEventListener('ended', () => this.sources.delete(source));
    source.start(this.nextStartTime);
    this.nextStartTime += audioBuffer.duration;
    this.sources.add(source);
  }

  private stopAudioOutput() {
    this.sources.forEach(s => s.stop());
    this.sources.clear();
    this.nextStartTime = 0;
  }

  disconnect() {
    if (this.session) {
        this.session.then((s: any) => {
            if(s.close) s.close();
        });
    }
    this.scriptProcessor?.disconnect();
    this.stream?.getTracks().forEach(t => t.stop());
    this.inputAudioContext?.close();
    this.outputAudioContext?.close();
  }

  // Utilities for PCM
  private createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    const bytes = new Uint8Array(int16.buffer);
    let binary = '';
    for(let i=0; i<bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);

    return {
      data: base64,
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
}