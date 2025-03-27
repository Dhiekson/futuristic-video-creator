
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  disabled: boolean;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  optional?: boolean;
}

const PromptInput = ({
  prompt,
  setPrompt,
  disabled,
  label = "Prompt",
  placeholder = "Descreva o vídeo que deseja criar...",
  maxLength = 500,
  optional = false
}: PromptInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt" className="text-sm font-medium flex items-center">
        {label}
        {optional && <span className="ml-2 text-xs text-muted-foreground">(Opcional)</span>}
      </Label>
      <div className="relative">
        <Input
          id="prompt"
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="pr-14 h-12 bg-background/50 focus:border-primary/50 focus:ring-primary/50"
          disabled={disabled}
          maxLength={maxLength}
        />
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${prompt.length > maxLength * 0.8 ? 'text-orange-500' : 'text-muted-foreground'}`}>
          {prompt.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default PromptInput;
