
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { Download, RefreshCw, Video, Play, Loader2 } from 'lucide-react';
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
      <Card className="h-full overflow-hidden border-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-800/70 backdrop-blur-lg shadow-xl rounded-2xl">
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prévia do Vídeo
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading && progress === 0}
              className="group hover:border-blue-400 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 group-hover:text-blue-500 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>

          <div className="relative flex-grow aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-inner flex items-center justify-center mb-4">
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
              <div className="text-center space-y-6 p-8 w-full">
                <div className="flex justify-center">
                  <Loader2 size={48} className="text-blue-500 animate-spin" />
                </div>
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          Progresso
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2 w-full bg-blue-200" />
                  </div>
                  <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-lg text-sm">
                    <p className="font-medium">
                      Seu vídeo está sendo gerado
                    </p>
                    <p className="text-blue-600/80 text-xs mt-1">
                      Tempo estimado: {formatTime(estimatedTime)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/50 inline-flex mb-4">
                  <Video className="h-12 w-12 text-blue-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
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
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all">
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
