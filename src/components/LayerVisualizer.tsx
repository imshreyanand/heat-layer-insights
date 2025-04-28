
import React from 'react';
import { LayerProperties } from '@/types';

interface LayerVisualizerProps {
  layers: LayerProperties[];
}

const LayerVisualizer: React.FC<LayerVisualizerProps> = ({ layers }) => {
  // Calculate total thickness for proportions
  const totalThickness = layers.reduce((sum, layer) => sum + layer.thickness, 0);
  
  // Color gradient based on thermal conductivity
  const getLayerColor = (conductivity: number) => {
    // Higher conductivity = more blue (better conductor)
    // Lower conductivity = more orange (insulator)
    if (conductivity < 1) return 'bg-heat-500';
    if (conductivity < 10) return 'bg-heat-400';
    if (conductivity < 50) return 'bg-cool-400';
    return 'bg-cool-600';
  };

  return (
    <div className="mb-8 mt-4">
      <h3 className="text-sm font-medium mb-2">Layer Visualization</h3>
      <div className="flex w-full h-12 rounded-md overflow-hidden border border-border">
        {layers.map((layer, index) => {
          const widthPercent = (layer.thickness / totalThickness) * 100;
          return (
            <div
              key={index}
              className={`${getLayerColor(layer.thermalConductivity)} relative`}
              style={{ width: `${widthPercent}%` }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {layer.thickness < 0.02 ? '' : `Layer ${index + 1}`}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex w-full justify-between mt-1 text-xs text-muted-foreground">
        <span>0 m</span>
        <span>{totalThickness.toFixed(2)} m</span>
      </div>
    </div>
  );
};

export default LayerVisualizer;
