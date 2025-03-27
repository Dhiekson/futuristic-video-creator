
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const resolutions = [
  { value: '1280*720', label: '1280×720 (16:9)' },
  { value: '960*960', label: '960×960 (1:1)' },
  { value: '720*1280', label: '720×1280 (9:16)' },
  { value: '1088*832', label: '1088×832 (4:3)' },
  { value: '832*1088', label: '832×1088 (3:4)' },
];

interface ResolutionSelectorProps {
  selectedResolution: string;
  setSelectedResolution: (value: string) => void;
  disabled: boolean;
}

const ResolutionSelector = ({ 
  selectedResolution, 
  setSelectedResolution, 
  disabled 
}: ResolutionSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Resolução</Label>
      <div className="grid grid-cols-2 gap-2">
        {resolutions.map((res) => (
          <Button
            key={res.value}
            type="button"
            variant={selectedResolution === res.value ? "default" : "outline"}
            className={`h-10 justify-center ${
              selectedResolution === res.value
                ? "bg-gradient-to-r from-primary to-blue-500 text-primary-foreground hover:shadow-md transition-shadow"
                : "bg-background/50 hover:bg-secondary/80 hover:border-primary/30"
            }`}
            onClick={() => setSelectedResolution(res.value)}
            disabled={disabled}
          >
            {res.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ResolutionSelector;
