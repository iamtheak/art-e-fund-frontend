// components/loader.tsx
"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: number;
  text?: string;
  className?: string;
}

export default function Loader({ size = 24, text, className = "" }: LoaderProps) {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Loader2 className={`animate-spin text-primary ${className}`} size={size} />
      {text !== undefined && (
        <span className="text-sm text-muted-foreground mt-2">{text}</span>
      )}
    </div>
  );
}