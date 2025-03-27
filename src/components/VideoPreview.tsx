
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { Download, RefreshCw, Play, Video } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface VideoPreviewProps {
  videoUrl: string | null;
  isLoading: boolean;
  progress: number;
  estimatedTime: number;
  onRefresh: () => void;
}

const VideoPreview = ({
  videoUrl,
  isLoading,
  progress,
  estimatedTime,
  onRefresh,
}: VideoPreviewProps) => {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)} segundos`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds} minutos`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="glass-card h-full overflow-hidden p-6 border-2 border-primary/10 shadow-lg">
        <div className="flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Vídeo Gerado
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading && progress === 0}
              className="group hover:border-primary/50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2 group-hover:text-primary" />
              Atualizar
            </Button>
          </div>

          <div className="relative flex-grow aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-secondary/50 to-background shadow-inner flex items-center justify-center">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                className="w-full h-full object-contain"
                poster={videoUrl + "?poster=true"}
              >
                Seu navegador não suporta a tag de vídeo.
              </video>
            ) : isLoading ? (
              <div className="text-center space-y-6 p-8">
                <LoadingSpinner size="lg" />
                <div className="space-y-3">
                  <Progress value={progress} className="h-2 w-64 bg-secondary/50" />
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-primary/80 font-medium">
                      {progress.toFixed(0)}% concluído
                    </p>
                    <p className="text-muted-foreground">
                      Tempo estimado: {formatTime(estimatedTime)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="p-4 rounded-full bg-secondary/50 inline-flex mb-4">
                  <Video className="h-12 w-12 text-primary/50" />
                </div>
                <p className="text-muted-foreground max-w-md">
                  Nenhum vídeo gerado ainda. Preencha o formulário e clique em Gerar para criar seu vídeo com IA.
                </p>
              </div>
            )}
          </div>

          {videoUrl && (
            <div className="flex justify-end pt-2">
              <a 
                href={videoUrl} 
                download="video-ia-gerado.mp4"
                target="_blank"
                rel="noreferrer"
                className="inline-block"
              >
                <Button className="bg-gradient-to-r from-primary to-blue-500 hover:shadow-md transition-shadow" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Vídeo
                </Button>
              </a>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default VideoPreview;
