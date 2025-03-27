
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
import { Play, RefreshCw, ImagePlus } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ImageToVideoFormProps {
  onGenerateVideo: (data: {
    prompt: string;
    image: File | null;
    watermark: boolean;
    seed: number;
  }) => Promise<void>;
}

const ImageToVideoForm = ({ onGenerateVideo }: ImageToVideoFormProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [watermark, setWatermark] = useState(true);
  const [seed, setSeed] = useState(-1);
  const [useSeed, setUseSeed] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      toast({
        title: "Image is required",
        description: "Please upload an image to generate a video",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      await onGenerateVideo({
        prompt: prompt,
        image: image,
        watermark: watermark,
        seed: useSeed ? seed : -1,
      });
      
      toast({
        title: "Video generation started",
        description: "Your video is being generated. Please wait.",
      });
    } catch (error) {
      console.error("Error generating video:", error);
      toast({
        title: "Error",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 999999999));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card overflow-hidden p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imagePrompt" className="text-sm font-medium">
                  Prompt (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="imagePrompt"
                    placeholder="Add details to guide video generation..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="pr-14 h-12 bg-background/50"
                    disabled={isGenerating}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {prompt.length}/500
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Upload Image</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="imageUpload"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer 
                    ${isGenerating ? 'bg-muted border-muted-foreground/30' : 'bg-background/50 border-muted-foreground/50 hover:bg-accent/30 hover:border-muted-foreground'}`}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        {!isGenerating && (
                          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                            <p className="text-white text-sm font-medium">
                              Click to change image
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or JPEG (max 5MB)
                        </p>
                      </div>
                    )}
                    <input
                      id="imageUpload"
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageChange}
                      disabled={isGenerating}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Settings</Label>
              </div>
              
              <div className="flex items-center space-x-2 py-1">
                <Checkbox
                  id="watermark"
                  checked={watermark}
                  onCheckedChange={(checked) => 
                    setWatermark(checked as boolean)
                  }
                  disabled={isGenerating}
                />
                <Label
                  htmlFor="watermark"
                  className="text-sm font-medium cursor-pointer"
                >
                  Apply watermark
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 py-1">
                <Checkbox
                  id="useSeed"
                  checked={useSeed}
                  onCheckedChange={(checked) => 
                    setUseSeed(checked as boolean)
                  }
                  disabled={isGenerating}
                />
                <Label
                  htmlFor="useSeed"
                  className="text-sm font-medium cursor-pointer"
                >
                  Use specific seed
                </Label>
              </div>
              
              {useSeed && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                    className="h-10 bg-background/50"
                    disabled={isGenerating || !useSeed}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleRandomSeed}
                    disabled={isGenerating || !useSeed}
                    className="h-10 w-10 shrink-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium mt-auto"
                disabled={isGenerating || !image}
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Generate Video
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default ImageToVideoForm;
