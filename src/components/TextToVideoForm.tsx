
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
import { Play, RefreshCw, CheckSquare, DownloadCloud } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const resolutions = [
  { value: '1280*720', label: '1280×720 (16:9)' },
  { value: '960*960', label: '960×960 (1:1)' },
  { value: '720*1280', label: '720×1280 (9:16)' },
  { value: '1088*832', label: '1088×832 (4:3)' },
  { value: '832*1088', label: '832×1088 (3:4)' },
];

interface TextToVideoFormProps {
  onGenerateVideo: (data: {
    prompt: string;
    size: string;
    watermark: boolean;
    seed: number;
  }) => Promise<void>;
}

const TextToVideoForm = ({ onGenerateVideo }: TextToVideoFormProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState(resolutions[0].value);
  const [watermark, setWatermark] = useState(true);
  const [seed, setSeed] = useState(-1);
  const [useSeed, setUseSeed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Prompt is required",
        description: "Please enter a prompt to generate a video",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      await onGenerateVideo({
        prompt: prompt,
        size: selectedResolution,
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
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">
              Prompt
            </Label>
            <div className="relative">
              <Input
                id="prompt"
                placeholder="Describe the video you want to create..."
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

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Resolution</Label>
              <div className="grid grid-cols-2 gap-2">
                {resolutions.map((res) => (
                  <Button
                    key={res.value}
                    type="button"
                    variant={selectedResolution === res.value ? "default" : "outline"}
                    className={`h-10 justify-center ${
                      selectedResolution === res.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-background/50 hover:bg-secondary/80"
                    }`}
                    onClick={() => setSelectedResolution(res.value)}
                    disabled={isGenerating}
                  >
                    {res.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Advanced Settings</Label>
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
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={isGenerating || !prompt.trim()}
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
        </form>
      </Card>
    </motion.div>
  );
};

export default TextToVideoForm;
