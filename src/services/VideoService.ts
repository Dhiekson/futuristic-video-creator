import { toast } from "sonner";

interface TextToVideoParams {
  prompt: string;
  size: string;
  watermark: boolean;
  seed: number;
}

interface ImageToVideoParams {
  prompt: string;
  image: File | null;
  watermark: boolean;
  seed: number;
}

class VideoService {
  private static API_URL = "https://wan-ai-wan2-1.hf.space";
  private static pollInterval = 1000; // 1 second
  private static maxPollAttempts = 60; // 1 minute
  
  private static async fetchWithTimeout(
    resource: RequestInfo, 
    options: RequestInit & { timeout?: number } = {}
  ) {
    const { timeout = 8000 } = options;
    
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
      // Start text-to-video generation
      const generateResponse = await this.fetchWithTimeout(`${this.API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fn_index: 3, // t2v_generation_async endpoint
          data: [
            params.prompt,
            params.size,
            params.watermark,
            params.seed,
          ],
        }),
        timeout: 30000,
      });
      
      if (!generateResponse.ok) {
        throw new Error(`Failed to start generation: ${generateResponse.statusText}`);
      }
      
      const generateData = await generateResponse.json();
      console.log("Generation started:", generateData);
      
      // Wait for and poll status until video is ready
      const estimatedTime = generateData.data[1]; // Estimated waiting time in seconds
      
      // Start polling for results
      return {
        videoUrl: null,
        estimatedTime: estimatedTime || 30,
      };
    } catch (error) {
      console.error("Error in text-to-video generation:", error);
      throw error;
    }
  }
  
  static async generateImageToVideo(params: ImageToVideoParams): Promise<{ videoUrl: string | null; estimatedTime: number }> {
    try {
      // First, we need to create a FormData to upload the image
      const formData = new FormData();
      
      // Add the image if available
      if (params.image) {
        formData.append('image', params.image);
      } else {
        throw new Error("No image provided");
      }
      
      // Create form data for the API request
      const apiFormData = new FormData();
      apiFormData.append('fn_index', '4'); // i2v_generation_async endpoint
      
      // Convert other params to JSON and append to FormData
      const dataArray = [
        params.prompt,
        null,  // This will be replaced with the uploaded image data
        params.watermark,
        params.seed,
      ];
      
      // Make a POST request to upload the image first (in a real API, this would be the actual process)
      console.log("Image to be uploaded:", params.image);
      
      // Start image-to-video generation (simulated)
      console.log("Starting image-to-video generation with params:", params);
      
      // In a real implementation, we would handle the image upload and API call
      // Since we're simulating, we'll return a fixed estimated time
      return {
        videoUrl: null,
        estimatedTime: 45, // Return a fixed estimated time for simulation
      };
    } catch (error) {
      console.error("Error in image-to-video generation:", error);
      throw error;
    }
  }
  
  static async checkVideoStatus(): Promise<{ videoUrl: string | null; progress: number; estimatedTime: number }> {
    try {
      // Poll the status endpoint
      const statusResponse = await this.fetchWithTimeout(`${this.API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fn_index: 5, // status_refresh endpoint
          data: [],
        }),
      });
      
      if (!statusResponse.ok) {
        throw new Error(`Failed to check status: ${statusResponse.statusText}`);
      }
      
      const statusData = await statusResponse.json();
      console.log("Status update:", statusData);
      
      // Parse the response data
      const videoData = statusData.data[0]; // Video URL if available
      const progress = statusData.data[3] || 0; // Progress as percentage (0-100)
      const remainingTime = statusData.data[2] || 0; // Remaining time in seconds
      
      let videoUrl = null;
      
      // Check if video is ready (videoData would contain the URL)
      if (videoData && typeof videoData === 'object' && videoData.video) {
        // Extract the actual video URL from the response
        videoUrl = `${this.API_URL}/file=${videoData.video}`;
      }
      
      return {
        videoUrl,
        progress,
        estimatedTime: remainingTime,
      };
    } catch (error) {
      console.error("Error checking video status:", error);
      throw error;
    }
  }
  
  // For demo purposes, we'll provide a simulated implementation that randomly succeeds or progresses
  static async simulateVideoGeneration(): Promise<{ videoUrl: string | null; progress: number; estimatedTime: number }> {
    // This is a placeholder implementation that simulates video generation progress
    // In a real app, this would be replaced with actual API calls
    
    // Get the current progress from localStorage or start at 0
    const currentProgress = parseInt(localStorage.getItem('simulatedProgress') || '0');
    
    // If progress is complete, return the video URL
    if (currentProgress >= 100) {
      // Reset progress for next generation
      localStorage.setItem('simulatedProgress', '0');
      
      // Return a sample video
      return {
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        progress: 100,
        estimatedTime: 0,
      };
    }
    
    // Otherwise, increment progress
    const newProgress = Math.min(currentProgress + Math.floor(Math.random() * 15) + 5, 100);
    localStorage.setItem('simulatedProgress', newProgress.toString());
    
    // Calculate estimated time (decreases as progress increases)
    const estimatedTime = Math.round((100 - newProgress) * 0.3);
    
    return {
      videoUrl: null,
      progress: newProgress,
      estimatedTime,
    };
  }
}

export default VideoService;
