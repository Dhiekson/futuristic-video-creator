
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
  maxLength = 250,
  optional = false
}: PromptInputProps) => {
  const percentUsed = (prompt.length / maxLength) * 100;
  const isNearLimit = percentUsed > 80;
  
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt" className="text-sm font-medium flex items-center">
        {label}
        {optional && <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Opcional)</span>}
      </Label>
      <div className="relative">
        <Input
          id="prompt"
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="pr-14 h-12 bg-white/80 dark:bg-gray-900/80 focus:border-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-700 shadow-sm"
          disabled={disabled}
          maxLength={maxLength}
        />
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded-full ${
          isNearLimit 
            ? 'text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' 
            : 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
        }`}>
          {prompt.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default PromptInput;
