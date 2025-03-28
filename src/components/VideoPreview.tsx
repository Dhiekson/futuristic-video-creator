
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { Download, RefreshCw, Video, Loader2, AlertCircle } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl: string | null;
  isLoading: boolean;
  progress: number;
  estimatedTime: number;
  onRefresh: () => void;
  error?: string | null;
}

const VideoPreview = ({
  videoUrl,
  isLoading,
  progress,
  estimatedTime,
  onRefresh,
  error = null,
}: VideoPreviewProps) => {
  const [showProgress, setShowProgress] = useState(false);
  
  useEffect(() => {
    if (isLoading) {
      setShowProgress(true);
    }
  }, [isLoading]);
  
  useEffect(() => {
    if (videoUrl) {
      // Only hide progress when video is loaded
      const timer = setTimeout(() => setShowProgress(false), 500);
      return () => clearTimeout(timer);
    }
  }, [videoUrl]);
  
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
      <Card className="h-full overflow-hidden border-0 bg-black text-white backdrop-blur-lg shadow-xl rounded-xl border border-gray-800">
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Prévia do Vídeo
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading}
              className="group border-gray-700 bg-gray-900 text-gray-300 hover:border-blue-500 hover:bg-gray-800 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 group-hover:text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>

          <div className="relative flex-grow aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-inner flex items-center justify-center mb-4">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                className="w-full h-full object-contain"
                poster={videoUrl + "?poster=true"}
              >
                Seu navegador não suporta a tag de vídeo.
              </video>
            ) : error ? (
              <div className="text-center space-y-6 p-8 w-full">
                <div className="flex justify-center">
                  <AlertCircle size={48} className="text-red-500" />
                </div>
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="bg-red-900/30 text-red-300 px-4 py-3 rounded-lg text-sm border border-red-800">
                    <p className="font-medium">
                      Erro ao gerar vídeo
                    </p>
                    <p className="text-red-400/80 text-xs mt-1">
                      {error || "Não foi possível processar o vídeo. Tente novamente com outro prompt."}
                    </p>
                  </div>
                </div>
              </div>
            ) : showProgress && isLoading ? (
              <div className="text-center space-y-6 p-8 w-full">
                <div className="flex justify-center">
                  <Loader2 size={48} className="text-blue-500 animate-spin" />
                </div>
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-400 bg-blue-900/50">
                          Progresso
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-400">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2 w-full bg-gray-800" />
                  </div>
                  <div className="bg-gray-900/70 text-blue-300 px-4 py-3 rounded-lg text-sm border border-gray-800">
                    <p className="font-medium">
                      Seu vídeo está sendo gerado
                    </p>
                    <p className="text-blue-400/80 text-xs mt-1">
                      Tempo estimado: {formatTime(estimatedTime)}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      A geração de vídeo com IA pode levar alguns minutos. Por favor, aguarde enquanto nosso sistema processa sua solicitação.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="p-4 rounded-full bg-gray-800/50 inline-flex mb-4">
                  <Video className="h-12 w-12 text-blue-400" />
                </div>
                <p className="text-gray-400 max-w-md">
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
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all">
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
