
import React from 'react';
import { Label } from "@/components/ui/label";
import { Plus, X } from 'lucide-react';

interface ImageUploaderProps {
  images: File[];
  imagePreviews: string[];
  addImages: (files: File[]) => void;
  removeImage: (index: number) => void;
  disabled: boolean;
  maxImages?: number;
}

const ImageUploader = ({
  images,
  imagePreviews,
  addImages,
  removeImage,
  disabled,
  maxImages = 5
}: ImageUploaderProps) => {
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const availableSlots = maxImages - images.length;
      if (availableSlots <= 0) return;
      
      const newFiles = Array.from(e.target.files).slice(0, availableSlots);
      addImages(newFiles);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Imagens (até {maxImages})</Label>
      <div className="grid grid-cols-2 gap-3">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-primary/20 group shadow-sm">
            <img
              src={preview}
              alt={`Imagem ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {!disabled && (
              <button
                type="button"
                className="absolute top-2 right-2 rounded-full bg-background/90 p-1.5 hover:bg-background shadow-md transition-all"
                onClick={() => removeImage(index)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
        
        {images.length < maxImages && (
          <label
            htmlFor="imageUpload"
            className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${disabled 
              ? 'bg-muted border-muted-foreground/30' 
              : 'bg-background/50 border-primary/30 hover:bg-accent/30 hover:border-primary hover:shadow-sm'}`}
          >
            <div className="flex flex-col items-center justify-center p-4">
              <Plus className="w-8 h-8 mb-2 text-primary/60" />
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
              disabled={disabled || images.length >= maxImages}
              multiple
            />
          </label>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-1">
        {images.length}/{maxImages} imagens • PNG, JPG (máx 5MB cada)
      </p>
    </div>
  );
};

export default ImageUploader;
