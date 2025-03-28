
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  disabled: boolean;
  label?: string;
  placeholder?: string;
  optional?: boolean;
}

const PromptInput = ({
  prompt,
  setPrompt,
  disabled,
  label = "Prompt",
  placeholder = "Descreva o vídeo que deseja criar...",
  optional = false
}: PromptInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt" className="text-sm font-medium flex items-center text-gray-200">
        {label}
        {optional && <span className="ml-2 text-xs text-gray-400">(Opcional)</span>}
      </Label>
      <div className="relative">
        <Input
          id="prompt"
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="pr-4 h-12 bg-gray-900/80 focus:border-blue-500 focus:ring-blue-500 border-gray-700 text-gray-200 shadow-lg"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default PromptInput;
