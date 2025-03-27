
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
import { Play, RefreshCw, ImagePlus, X, Plus } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ImageToVideoFormProps {
  onGenerateVideo: (data: {
    prompt: string;
    images: File[];
    watermark: boolean;
    seed: number;
  }) => Promise<void>;
}

const ImageToVideoForm = ({ onGenerateVideo }: ImageToVideoFormProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [watermark, setWatermark] = useState(true);
  const [seed, setSeed] = useState(-1);
  const [useSeed, setUseSeed] = useState(false);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedImages = [...images, ...newFiles];
      setImages(updatedImages);
      
      // Criar preview URLs para as novas imagens
      const newPreviews: string[] = [];
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
    
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast({
        title: "Imagem é obrigatória",
        description: "Por favor, faça upload de pelo menos uma imagem para gerar um vídeo",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      await onGenerateVideo({
        prompt: prompt,
        images: images,
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
                  Prompt (Opcional)
                </Label>
                <div className="relative">
                  <Input
                    id="imagePrompt"
                    placeholder="Adicione detalhes para guiar a geração do vídeo..."
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
                <Label className="text-sm font-medium">Imagens (até 5)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-muted-foreground/30">
                      <img
                        src={preview}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {!isGenerating && (
                        <button
                          type="button"
                          className="absolute top-2 right-2 rounded-full bg-background/80 p-1 hover:bg-background"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {images.length < 5 && (
                    <label
                      htmlFor="imageUpload"
                      className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer 
                      ${isGenerating ? 'bg-muted border-muted-foreground/30' : 'bg-background/50 border-muted-foreground/50 hover:bg-accent/30 hover:border-muted-foreground'}`}
                    >
                      <div className="flex flex-col items-center justify-center p-4">
                        <Plus className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-xs text-center text-muted-foreground">
                          Adicionar imagem
                        </p>
                      </div>
                      <input
                        id="imageUpload"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImagesChange}
                        disabled={isGenerating || images.length >= 5}
                        multiple
                      />
                    </label>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {images.length}/5 imagens • PNG, JPG (máx 5MB cada)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Configurações</Label>
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
                  Aplicar marca d'água
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
                  Usar seed específica
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
                disabled={isGenerating || images.length === 0}
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
            </div>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default ImageToVideoForm;
