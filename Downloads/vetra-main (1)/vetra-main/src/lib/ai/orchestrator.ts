/**
 * Orchestrateur IA Unifié
 * Gère tous les appels IA avec fallback et optimisation des coûts
 */

export type AIModel = 'deepseek' | 'openai' | 'ollama' | 'replicate';
export type AITask = 'text' | 'image' | 'video' | 'code' | 'chat';

export interface AIRequest {
  task: AITask;
  prompt: string;
  model?: AIModel;
  options?: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
    [key: string]: any;
  };
}

export interface AIResponse {
  content: string;
  model: AIModel;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost?: number;
  metadata?: Record<string, any>;
}

class AIOrchestrator {
  private deepseekApiKey: string;
  private openaiApiKey?: string;
  private defaultModel: AIModel = 'deepseek';

  constructor() {
    this.deepseekApiKey = process.env.DEEPSEEK_API_KEY || 'sk-491b1fc66cc14b3aaf40ea6511008bfa';
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  /**
   * Génération de texte (chat, completion)
   */
  async generateText(request: AIRequest): Promise<AIResponse> {
    const model = request.model || this.defaultModel;

    switch (model) {
      case 'deepseek':
        return this.generateTextDeepSeek(request);
      case 'openai':
        return this.generateTextOpenAI(request);
      case 'ollama':
        return this.generateTextOllama(request);
      default:
        return this.generateTextDeepSeek(request);
    }
  }

  /**
   * Génération d'images
   */
  async generateImage(prompt: string, options?: any): Promise<AIResponse> {
    // Utiliser Replicate ou Flux pour les images
    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'flux-dev', // ou autre modèle
          input: { prompt },
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error('Image generation failed');
      }

      const data = await response.json();
      return {
        content: data.output?.[0] || '',
        model: 'replicate',
        metadata: { predictionId: data.id },
      };
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
    }
  }

  /**
   * Génération de vidéos
   */
  async generateVideo(prompt: string, options?: any): Promise<AIResponse> {
    // Utiliser Replicate pour les vidéos (Open-Sora, etc.)
    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'open-sora', // ou autre modèle vidéo
          input: { prompt },
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error('Video generation failed');
      }

      const data = await response.json();
      return {
        content: data.output?.[0] || '',
        model: 'replicate',
        metadata: { predictionId: data.id },
      };
    } catch (error) {
      console.error('Video generation error:', error);
      throw error;
    }
  }

  /**
   * Génération de code
   */
  async generateCode(prompt: string, language?: string, options?: any): Promise<AIResponse> {
    const enhancedPrompt = language
      ? `Generate ${language} code: ${prompt}`
      : `Generate code: ${prompt}`;

    return this.generateText({
      task: 'code',
      prompt: enhancedPrompt,
      options: {
        temperature: 0.2, // Plus déterministe pour le code
        ...options,
      },
    });
  }

  /**
   * DeepSeek API
   */
  private async generateTextDeepSeek(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.deepseekApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: request.prompt,
            },
          ],
          temperature: request.options?.temperature || 0.7,
          max_tokens: request.options?.maxTokens || 2000,
          stream: request.options?.stream || false,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error?.message || 'DeepSeek API error');
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content || '',
        model: 'deepseek',
        tokens: {
          prompt: data.usage?.prompt_tokens || 0,
          completion: data.usage?.completion_tokens || 0,
          total: data.usage?.total_tokens || 0,
        },
        cost: this.calculateCost('deepseek', data.usage?.total_tokens || 0),
        metadata: data,
      };
    } catch (error: any) {
      console.error('DeepSeek API error:', error);
      throw new Error(`DeepSeek API error: ${error.message}`);
    }
  }

  /**
   * OpenAI API (fallback)
   */
  private async generateTextOpenAI(request: AIRequest): Promise<AIResponse> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: request.prompt,
            },
          ],
          temperature: request.options?.temperature || 0.7,
          max_tokens: request.options?.maxTokens || 2000,
        }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content || '',
        model: 'openai',
        tokens: {
          prompt: data.usage?.prompt_tokens || 0,
          completion: data.usage?.completion_tokens || 0,
          total: data.usage?.total_tokens || 0,
        },
        cost: this.calculateCost('openai', data.usage?.total_tokens || 0),
      };
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  /**
   * Ollama (local)
   */
  private async generateTextOllama(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.1',
          prompt: request.prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Ollama API error');
      }

      const data = await response.json();
      return {
        content: data.response || '',
        model: 'ollama',
        metadata: data,
      };
    } catch (error: any) {
      console.error('Ollama API error:', error);
      throw new Error('Ollama not available. Make sure Ollama is running on localhost:11434');
    }
  }

  /**
   * Calcul du coût (en USD)
   */
  private calculateCost(model: AIModel, tokens: number): number {
    const costs: Record<AIModel, number> = {
      deepseek: 0.00014 / 1000, // $0.14 per 1M tokens
      openai: 0.03 / 1000, // $30 per 1M tokens (gpt-4)
      ollama: 0, // Gratuit (local)
      replicate: 0.002 / 1000, // Variable selon le modèle
    };

    return (costs[model] || 0) * tokens;
  }

  /**
   * Pipeline unifié pour tous les types de tâches
   */
  async process(request: AIRequest): Promise<AIResponse> {
    switch (request.task) {
      case 'text':
      case 'chat':
        return this.generateText(request);
      case 'code':
        return this.generateCode(request.prompt, undefined, request.options);
      case 'image':
        return this.generateImage(request.prompt, request.options);
      case 'video':
        return this.generateVideo(request.prompt, request.options);
      default:
        return this.generateText(request);
    }
  }
}

// Singleton
export const aiOrchestrator = new AIOrchestrator();

