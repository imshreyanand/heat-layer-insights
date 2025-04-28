
// Types for our heat transfer simulation

export interface LayerProperties {
  thickness: number;   // in meters
  thermalConductivity: number;  // in W/(m·K)
}

export interface SimulationParameters {
  layers: LayerProperties[];
  heatSource: number;  // in W/m²
  ambientTemperature: number;  // in Kelvin or Celsius
}

export interface SimulationResults {
  temperatureProfile: { 
    position: number;  // distance from left boundary in meters
    temperature: number;  // in Kelvin or Celsius 
  }[];
  analyticalSolution: { 
    position: number;
    temperature: number;
  }[];
  numericalSolution: { 
    position: number;
    temperature: number;
  }[];
}

export interface SavedSimulation {
  id: string;
  name: string;
  date: string;
  parameters: SimulationParameters;
  results: SimulationResults;
}
