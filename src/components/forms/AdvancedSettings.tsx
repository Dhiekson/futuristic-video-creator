
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

interface AdvancedSettingsProps {
  watermark: boolean;
  setWatermark: (checked: boolean) => void;
  useSeed: boolean;
  setUseSeed: (checked: boolean) => void;
  seed: number;
  setSeed: (value: number) => void;
  disabled: boolean;
}

const AdvancedSettings = ({
  watermark,
  setWatermark,
  useSeed,
  setUseSeed,
  seed,
  setSeed,
  disabled
}: AdvancedSettingsProps) => {
  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 999999999));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Configurações Avançadas
        </Label>
      </div>
      
      <div className="flex items-center space-x-2 py-1">
        <Checkbox
          id="watermark"
          checked={watermark}
          onCheckedChange={(checked) => 
            setWatermark(checked as boolean)
          }
          disabled={disabled}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
          disabled={disabled}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
            className="h-10 bg-background/50 focus:border-primary/50 focus:ring-primary/50"
            disabled={disabled || !useSeed}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRandomSeed}
            disabled={disabled || !useSeed}
            className="h-10 w-10 shrink-0 hover:border-primary/50 hover:bg-secondary/50"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings;
