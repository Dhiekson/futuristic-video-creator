import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Video, Image, Play } from 'lucide-react';
import AnimatedTabs from '@/components/AnimatedTabs';
import TextToVideoForm from '@/components/TextToVideoForm';
import ImageToVideoForm from '@/components/ImageToVideoForm';
import VideoPreview from '@/components/VideoPreview';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import VideoService from '@/services/VideoService';
import InteractiveBackground from '@/components/InteractiveBackground';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('text-to-video');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Parar o polling quando o componente é desmontado ou quando o vídeo está pronto
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);
  
  // Atualizar polling para o status do vídeo para usar a API real
  const startPolling = () => {
    // Limpar qualquer intervalo existente
    if (pollInterval) {
      clearInterval(pollInterval);
    }
    
    // Definir estado inicial
    setVideoUrl(null);
    setProgress(0);
    setError(null);
    
    // Iniciar um novo intervalo de polling
    const interval = setInterval(async () => {
      try {
        // Chamar a API real para verificar o status
        const status = await VideoService.checkVideoStatus();
        
        setProgress(status.progress);
        setEstimatedTime(status.estimatedTime);
        
        if (status.videoUrl) {
          setVideoUrl(status.videoUrl);
          setIsGenerating(false);
          clearInterval(interval);
          toast({
            title: "Vídeo gerado com sucesso",
            description: "Seu vídeo está pronto para visualizar e baixar.",
          });
        }
      } catch (error) {
        console.error("Erro ao verificar o status do vídeo:", error);
        clearInterval(interval);
        setIsGenerating(false);
        setError(error instanceof Error ? error.message : "Erro desconhecido ao verificar o status do vídeo");
        toast({
          title: "Erro ao verificar o status do vídeo",
          description: error instanceof Error ? error.message : "Falha ao verificar o progresso da geração do vídeo.",
          variant: "destructive",
        });
      }
    }, 3000); // Aumentando o intervalo para reduzir a carga na API
    
    setPollInterval(interval);
  };
  
  const handleTextToVideoGenerate = async (data: {
    prompt: string;
    size: string;
    watermark: boolean;
    seed: number;
  }) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Iniciar geração de vídeo a partir de texto
      const result = await VideoService.generateTextToVideo({
        prompt: data.prompt,
        size: data.size,
        watermark: data.watermark,
        seed: data.seed,
      });
      
      setEstimatedTime(result.estimatedTime);
      
      // Iniciar polling para atualizações de status
      startPolling();
      
    } catch (error) {
      console.error("Erro ao gerar vídeo a partir de texto:", error);
      setIsGenerating(false);
      setError(error instanceof Error ? error.message : "Erro desconhecido ao gerar vídeo");
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao gerar vídeo. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleImageToVideoGenerate = async (data: {
    prompt: string;
    images: File[];
    watermark: boolean;
    seed: number;
  }) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Iniciar geração de vídeo a partir de imagem
      const result = await VideoService.generateImageToVideo({
        prompt: data.prompt,
        images: data.images,
        watermark: data.watermark,
        seed: data.seed,
      });
      
      setEstimatedTime(result.estimatedTime);
      
      // Iniciar polling para atualizações de status
      startPolling();
      
    } catch (error) {
      console.error("Erro ao gerar vídeo a partir de imagem:", error);
      setIsGenerating(false);
      setError(error instanceof Error ? error.message : "Erro desconhecido ao gerar vídeo");
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao gerar vídeo. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleRefreshStatus = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      
      // Usar a API real para verificar o status
      const status = await VideoService.checkVideoStatus();
      
      setProgress(status.progress);
      setEstimatedTime(status.estimatedTime);
      
      if (status.videoUrl) {
        setVideoUrl(status.videoUrl);
        setIsGenerating(false);
        toast({
          title: "Vídeo recuperado",
          description: "Seu vídeo está pronto para visualizar e baixar.",
        });
      } else {
        setIsGenerating(false);
        toast({
          title: "Vídeo ainda em processamento",
          description: `Progresso: ${status.progress}%`,
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar o status do vídeo:", error);
      setIsGenerating(false);
      setError(error instanceof Error ? error.message : "Erro desconhecido ao atualizar status");
      toast({
        title: "Erro ao atualizar o status",
        description: error instanceof Error ? error.message : "Falha ao obter o status mais recente.",
        variant: "destructive",
      });
    }
  };

  const tabs = [
    {
      id: 'text-to-video',
      label: 'Texto para Vídeo',
      icon: <Video className="h-4 w-4" />,
    },
    {
      id: 'image-to-video',
      label: 'Imagem para Vídeo',
      icon: <Image className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <InteractiveBackground />
      
      {/* Barra de progresso para posição de rolagem (decorativa) */}
      <motion.div
        className="progress-bar"
        style={{ scaleX: 0 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 0.5, 0.8, 1] }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        <section id="creator" className="py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <div className="mb-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary-foreground">
                  Crie com IA
                </span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="mt-4 text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent"
              >
                Transforme Suas Ideias em Vídeos
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto"
              >
                Crie vídeos de alta qualidade a partir de texto ou imagens com nossa IA avançada
              </motion.p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <AnimatedTabs
                  tabs={tabs}
                  defaultValue="text-to-video"
                  onChange={(value) => setActiveTab(value)}
                >
                  <TextToVideoForm onGenerateVideo={handleTextToVideoGenerate} />
                  <ImageToVideoForm onGenerateVideo={handleImageToVideoGenerate} />
                </AnimatedTabs>
              </div>
              
              <VideoPreview
                videoUrl={videoUrl}
                isLoading={isGenerating}
                progress={progress}
                estimatedTime={estimatedTime}
                onRefresh={handleRefreshStatus}
                error={error}
              />
            </div>
          </div>
        </section>
        
        <section id="examples" className="relative py-16 bg-secondary/30 overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-[20%] right-[10%] h-64 w-64 rounded-full bg-blue-200/10 blur-3xl" />
            <div className="absolute bottom-[10%] left-[20%] h-64 w-64 rounded-full bg-purple-200/10 blur-3xl" />
          </div>
          
          <div className="container relative z-10 px-4 mx-auto">
            <div className="mb-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary-foreground">
                  Galeria
                </span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="mt-4 text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent"
              >
                Veja o Que é Possível
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto"
              >
                Explore exemplos criados com nossa tecnologia de geração de vídeo por IA
              </motion.p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card overflow-hidden group"
                >
                  <div className="aspect-video w-full bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-muted-foreground/40 animate-pulse-slow" />
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity">
                      <button className="rounded-full bg-white/90 p-3 text-black">
                        <Play className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Exemplo {i}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {i === 1 ? "Paisagem urbana ao pôr do sol com carros voadores" : 
                       i === 2 ? "Ondas do oceano quebrando em uma praia futurista" : 
                       "Paisagem montanhosa com árvores holográficas"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="about" className="py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary-foreground">
                  Sobre Nossa Tecnologia
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                  Alimentado por IA Avançada
                </h2>
                <p className="mt-4 text-muted-foreground md:text-lg">
                  Nossa tecnologia de geração de vídeo usa modelos de IA de última geração para transformar descrições de texto e imagens em vídeos realistas com detalhes e movimento notáveis.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Geração de texto para vídeo com movimento natural",
                    "Animação de imagem para vídeo com controle preciso",
                    "Múltiplas opções de resolução para diferentes necessidades",
                    "Configurações personalizáveis para flexibilidade criativa"
                  ].map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card overflow-hidden p-6 relative"
              >
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="pt-4 rounded-lg bg-muted/30 border border-border overflow-hidden">
                  <div className="px-4 py-2 font-mono text-sm">
                    <div className="text-muted-foreground mb-1"># Gerar um vídeo a partir de texto</div>
                    <div className="text-green-600 mb-2">
                      client = Client(<span className="text-blue-600">"Wan-AI/Wan2.1"</span>)
                    </div>
                    <div className="text-green-600">
                      result = client.predict(
                    </div>
                    <div className="pl-8 text-foreground">
                      prompt=<span className="text-blue-600">"Uma paisagem urbana futurista ao pôr do sol"</span>,
                    </div>
                    <div className="pl-8 text-foreground">
                      size=<span className="text-blue-600">"1280*720"</span>,
                    </div>
                    <div className="pl-8 text-foreground">
                      watermark_wan=<span className="text-purple-600">True</span>,
                    </div>
                    <div className="pl-8 text-foreground">
                      seed=<span className="text-orange-600">-1</span>,
                    </div>
                    <div className="pl-8 text-foreground">
                      api_name=<span className="text-blue-600">"/t2v_generation_async"</span>
                    </div>
                    <div className="text-green-600">)</div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <div className="animate-pulse-slow">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
