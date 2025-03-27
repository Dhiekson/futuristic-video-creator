
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { Download, RefreshCw, Play } from 'lucide-react';
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
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds} minutes`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card overflow-hidden p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Generated Video</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={onRefresh}
              disabled={isLoading && progress === 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            ) : isLoading ? (
              <div className="text-center space-y-4">
                <LoadingSpinner size="lg" />
                <div className="space-y-2">
                  <Progress value={progress} className="h-1.5 w-64" />
                  <p className="text-sm text-muted-foreground">
                    Estimated time: {formatTime(estimatedTime)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <Play className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No video generated yet. Fill out the form and click Generate.
                </p>
              </div>
            )}
          </div>

          {videoUrl && (
            <div className="flex justify-end">
              <a 
                href={videoUrl} 
                download="generated-video.mp4"
                target="_blank"
                rel="noreferrer"
              >
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
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
