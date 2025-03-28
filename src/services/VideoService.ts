
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

interface VideoStatus {
  videoUrl: string | null;
  progress: number;
  estimatedTime: number;
}

class VideoService {
  private static API_URL = "https://api-inference.huggingface.co/models/Wan-AI/Wan2.1";
  private static API_KEY = "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";
  private static currentTaskId: string | null = null;
  
  static async generateTextToVideo(params: TextToVideoParams): Promise<VideoStatus> {
    try {
      console.log("Iniciando geração de vídeo a partir de texto:", params);
      
      const response = await fetch(`${this.API_URL}/t2v_generation_async`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          inputs: params.prompt,
          parameters: {
            size: params.size,
            watermark_wan: params.watermark,
            seed: params.seed
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (data.task_id) {
        this.currentTaskId = data.task_id;
        return {
          videoUrl: null,
          progress: 0,
          estimatedTime: data.eta || 60
        };
      } else if (data.error) {
        throw new Error(`API error: ${data.error}`);
      } else {
        throw new Error("Resposta inesperada da API");
      }
    } catch (error) {
      console.error("Erro na geração de vídeo:", error);
      throw error;
    }
  }
  
  static async generateImageToVideo(params: ImageToVideoParams): Promise<VideoStatus> {
    try {
      console.log("Iniciando geração de vídeo a partir de imagens:", params);
      
      const formData = new FormData();
      formData.append("inputs", params.prompt);
      
      // Adicionar parâmetros
      const parameters = {
        watermark_wan: params.watermark,
        seed: params.seed
      };
      formData.append("parameters", JSON.stringify(parameters));
      
      // Adicionar imagens
      params.images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });
      
      const response = await fetch(`${this.API_URL}/i2v_generation_async`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.API_KEY}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (data.task_id) {
        this.currentTaskId = data.task_id;
        return {
          videoUrl: null,
          progress: 0,
          estimatedTime: data.eta || 90
        };
      } else if (data.error) {
        throw new Error(`API error: ${data.error}`);
      } else {
        throw new Error("Resposta inesperada da API");
      }
    } catch (error) {
      console.error("Erro na geração de vídeo a partir de imagens:", error);
      throw error;
    }
  }
  
  static async checkVideoStatus(): Promise<VideoStatus> {
    try {
      if (!this.currentTaskId) {
        console.warn("Nenhuma tarefa em andamento para verificar status");
        return {
          videoUrl: null,
          progress: 0,
          estimatedTime: 0
        };
      }
      
      const response = await fetch(`${this.API_URL}/status/${this.currentTaskId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.API_KEY}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Status API Error:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Status Response:", data);
      
      if (data.status === "completed" && data.output) {
        // Tarefa completa
        return {
          videoUrl: data.output,
          progress: 100,
          estimatedTime: 0
        };
      } else if (data.status === "processing") {
        // Ainda processando
        return {
          videoUrl: null,
          progress: data.progress || 0,
          estimatedTime: data.eta || 0
        };
      } else if (data.status === "error") {
        throw new Error(`Erro na geração: ${data.error || "Erro desconhecido"}`);
      } else {
        return {
          videoUrl: null,
          progress: data.progress || 0,
          estimatedTime: data.eta || 0
        };
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      throw error;
    }
  }
}

export default VideoService;
