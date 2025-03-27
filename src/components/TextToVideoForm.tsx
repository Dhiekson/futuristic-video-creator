
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import PromptInput from './forms/PromptInput';
import ResolutionSelector, { resolutions } from './forms/ResolutionSelector';
import AdvancedSettings from './forms/AdvancedSettings';

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
        title: "O prompt é obrigatório",
        description: "Por favor, insira um prompt para gerar um vídeo",
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
        title: "Geração de vídeo iniciada",
        description: "Seu vídeo está sendo gerado. Por favor, aguarde.",
      });
    } catch (error) {
      console.error("Erro ao gerar vídeo:", error);
      toast({
        title: "Erro",
        description: "Falha ao iniciar a geração do vídeo. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="glass-card h-full overflow-hidden p-6 border-2 border-primary/10 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
          <PromptInput 
            prompt={prompt}
            setPrompt={setPrompt}
            disabled={isGenerating}
          />

          <div className="grid gap-6 md:grid-cols-2 flex-grow">
            <ResolutionSelector
              selectedResolution={selectedResolution}
              setSelectedResolution={setSelectedResolution}
              disabled={isGenerating}
            />

            <AdvancedSettings
              watermark={watermark}
              setWatermark={setWatermark}
              useSeed={useSeed}
              setUseSeed={setUseSeed}
              seed={seed}
              setSeed={setSeed}
              disabled={isGenerating}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-blue-500 hover:shadow-md transition-shadow"
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Gerando...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Gerar Vídeo
              </>
            )}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default TextToVideoForm;
