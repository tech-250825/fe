"use client";

import React from "react";

interface ModelDataDebuggerProps {
  styleModels: any[];
  characterModels: any[];
}

export function ModelDataDebugger({ styleModels, characterModels }: ModelDataDebuggerProps) {
  if (process.env.NODE_ENV !== "development") {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-card border border-border rounded-lg p-4 shadow-lg z-50 max-h-96 overflow-auto">
      <h3 className="font-bold text-sm mb-2">🐛 Model Data Debug</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Style Models ({styleModels?.length || 0}):</strong>
          {styleModels && styleModels.length > 0 ? (
            <pre className="mt-1 p-2 bg-muted rounded text-[10px] overflow-auto max-h-32">
              {JSON.stringify(styleModels[0], null, 2)}
            </pre>
          ) : (
            <div className="text-muted-foreground">No data</div>
          )}
        </div>
        
        <div>
          <strong>Character Models ({characterModels?.length || 0}):</strong>
          {characterModels && characterModels.length > 0 ? (
            <pre className="mt-1 p-2 bg-muted rounded text-[10px] overflow-auto max-h-32">
              {JSON.stringify(characterModels[0], null, 2)}
            </pre>
          ) : (
            <div className="text-muted-foreground">No data</div>
          )}
        </div>
      </div>
    </div>
  );
}