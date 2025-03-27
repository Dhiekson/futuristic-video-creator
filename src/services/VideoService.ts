
import { toast } from "sonner";

interface TextToVideoParams {
  prompt: string;
  size: string;
  watermark: boolean;
  seed: number;
}

interface ImageToVideoParams {
  prompt: string;
  images: File[];
  watermark: boolean;
  seed: number;
}

interface WanAIResponse {
  status?: string;
  eta?: number;
  progress?: number;
  output?: {
    video?: string;
  };
  detail?: string;
  task_id?: string;
}

class VideoService {
  private static API_URL = "https://api-inference.huggingface.co/models/Wan-AI/Wan2.1";
  private static API_KEY = "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"; // Chave API adicionada
  private static pollInterval = 2000; // 2 segundos
  
  // Armazena o ID da tarefa atual
  private static currentTaskId: string | null = null;
  
  private static async fetchWithTimeout(
    resource: RequestInfo, 
    options: RequestInit & { timeout?: number } = {}
  ) {
    const { timeout = 30000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }
  
  static async generateTextToVideo(params: TextToVideoParams): Promise<{ videoUrl: string | null; estimatedTime: number }> {
    try {
      console.log("Iniciando geração de vídeo a partir de texto:", params);
      
      const response = await this.fetchWithTimeout(`${this.API_URL}/t2v_generation_async`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          prompt: params.prompt,
          size: params.size,
          watermark_wan: params.watermark,
          seed: params.seed === -1 ? -1 : params.seed
        }),
        timeout: 60000  // 60 segundos
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro na chamada da API");
      }
      
      const data: WanAIResponse = await response.json();
      console.log("Resposta da API:", data);
      
      // Armazenar o ID da tarefa para consultar o status posteriormente
      this.currentTaskId = data.task_id || null;
      
      return {
        videoUrl: null,
        estimatedTime: data.eta || 60, // Usando o eta da resposta
      };
    } catch (error) {
      console.error("Erro na geração de vídeo a partir de texto:", error);
      throw error;
    }
  }
  
  static async generateImageToVideo(params: ImageToVideoParams): Promise<{ videoUrl: string | null; estimatedTime: number }> {
    try {
      console.log("Imagens para upload:", params.images);
      console.log("Iniciando geração de vídeo a partir de imagens:", params);
      
      const formData = new FormData();
      formData.append("prompt", params.prompt);
      formData.append("watermark_wan", params.watermark.toString());
      formData.append("seed", params.seed === -1 ? "-1" : params.seed.toString());
      
      // Adicionar todas as imagens ao FormData
      params.images.forEach((image, index) => {
        formData.append("image", image);
      });
      
      const response = await this.fetchWithTimeout(`${this.API_URL}/i2v_generation_async`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.API_KEY}`
        },
        body: formData,
        timeout: 60000  // 60 segundos
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro na chamada da API");
      }
      
      const data: WanAIResponse = await response.json();
      console.log("Resposta da API:", data);
      
      // Armazenar o ID da tarefa para consultar o status posteriormente
      this.currentTaskId = data.task_id || null;
      
      return {
        videoUrl: null,
        estimatedTime: data.eta || 90, // Usando o eta da resposta
      };
    } catch (error) {
      console.error("Erro na geração de vídeo a partir de imagens:", error);
      throw error;
    }
  }
  
  static async checkVideoStatus(): Promise<{ videoUrl: string | null; progress: number; estimatedTime: number }> {
    try {
      if (!this.currentTaskId) {
        return {
          videoUrl: null,
          progress: 0,
          estimatedTime: 0,
        };
      }
      
      const response = await this.fetchWithTimeout(`${this.API_URL}/status_refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          task_id: this.currentTaskId
        }),
        timeout: 30000
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao verificar o status do vídeo");
      }
      
      const data: WanAIResponse = await response.json();
      console.log("Status do vídeo:", data);
      
      // Se o status for "complete", retornar a URL do vídeo
      if (data.status === "complete" && data.output?.video) {
        // Limpar o ID da tarefa atual
        this.currentTaskId = null;
        
        return {
          videoUrl: data.output.video,
          progress: 100,
          estimatedTime: 0,
        };
      }
      
      // Se ainda estiver processando, retornar o progresso
      return {
        videoUrl: null,
        progress: data.progress || 0,
        estimatedTime: data.eta || 0,
      };
    } catch (error) {
      console.error("Erro ao verificar o status do vídeo:", error);
      throw error;
    }
  }
}

export default VideoService;
