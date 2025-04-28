
import { SimulationParameters, SimulationResults } from "../types";

/**
 * Calculate the temperature profile across multiple layers
 * This is a simplified model for educational purposes
 * 
 * @param params - Simulation parameters including layers and heat source
 * @returns Temperature profile and comparison data
 */
export function calculateHeatTransfer(params: SimulationParameters): SimulationResults {
  const { layers, heatSource, ambientTemperature } = params;
  
  // Number of points to calculate in the temperature profile
  const numPoints = 100;
  
  // Calculate total thickness of all layers
  const totalThickness = layers.reduce((sum, layer) => sum + layer.thickness, 0);
  
  // Initialize results arrays
  const temperatureProfile = [];
  const analyticalSolution = [];
  const numericalSolution = [];
  
  // Position increment
  const dx = totalThickness / (numPoints - 1);
  
  // Calculate temperature at each position
  let currentPosition = 0;
  let currentLayerIndex = 0;
  let accumulatedThickness = 0;
  
  // Simplified analytical solution (1D steady-state heat conduction)
  for (let i = 0; i < numPoints; i++) {
    currentPosition = i * dx;
    
    // Find which layer we're in
    while (currentLayerIndex < layers.length - 1 && 
          currentPosition >= accumulatedThickness + layers[currentLayerIndex].thickness) {
      accumulatedThickness += layers[currentLayerIndex].thickness;
      currentLayerIndex++;
    }
    
    const currentLayer = layers[currentLayerIndex];
    
    // Simple temperature calculation based on Fourier's law of heat conduction
    // T(x) = T₀ + q̇·x/k where k is thermal conductivity
    // This is a simplified version - real solutions would be more complex
    const relativePosInLayer = currentPosition - accumulatedThickness;
    const temperatureGradient = heatSource / currentLayer.thermalConductivity;
    const temperature = ambientTemperature + temperatureGradient * relativePosInLayer;
    
    // For demonstration, let's make the numerical solution slightly different
    // In a real app, you would use actual numerical methods (finite difference, etc.)
    const numericalTemp = temperature * (1 + (Math.random() * 0.06 - 0.03)); // ±3% variation
    
    temperatureProfile.push({ position: currentPosition, temperature });
    analyticalSolution.push({ position: currentPosition, temperature });
    numericalSolution.push({ position: currentPosition, temperature: numericalTemp });
  }
  
  return {
    temperatureProfile,
    analyticalSolution,
    numericalSolution
  };
}

/**
 * Generate sample data for quick setup
 */
export function generateSampleData(): SimulationParameters {
  return {
    layers: [
      { thickness: 0.05, thermalConductivity: 0.8 },  // Insulation layer
      { thickness: 0.1, thermalConductivity: 45 },    // Metal layer
      { thickness: 0.05, thermalConductivity: 0.5 }   // Insulation layer
    ],
    heatSource: 1000,  // 1000 W/m²
    ambientTemperature: 293.15  // 20°C in Kelvin
  };
}
