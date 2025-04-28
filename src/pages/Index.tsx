
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Navbar from '@/components/Navbar';
import ParameterSlider from '@/components/ParameterSlider';
import LayerVisualizer from '@/components/LayerVisualizer';
import TemperatureChart from '@/components/TemperatureChart';
import ResultsTable from '@/components/ResultsTable';
import SaveSimulationDialog from '@/components/SaveSimulationDialog';

import { SimulationParameters, SimulationResults } from '@/types';
import { calculateHeatTransfer, generateSampleData } from '@/utils/heatTransferCalculations';
import { useSimulationApi } from '@/hooks/useSimulationApi';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const { saveSimulation } = useSimulationApi();
  
  // Initialize with sample data
  const [parameters, setParameters] = useState<SimulationParameters>(generateSampleData());
  const [results, setResults] = useState<SimulationResults | null>(null);
  
  // Run initial simulation on component mount
  useEffect(() => {
    handleRunSimulation();
  }, []);
  
  // Update a specific layer property
  const updateLayer = (index: number, property: keyof typeof parameters.layers[0], value: number) => {
    const updatedLayers = [...parameters.layers];
    updatedLayers[index] = {
      ...updatedLayers[index],
      [property]: value
    };
    
    setParameters({
      ...parameters,
      layers: updatedLayers
    });
  };
  
  // Update the heat source value
  const updateHeatSource = (value: number) => {
    setParameters({
      ...parameters,
      heatSource: value
    });
  };
  
  // Run the heat transfer simulation
  const handleRunSimulation = () => {
    try {
      const newResults = calculateHeatTransfer(parameters);
      setResults(newResults);
      toast({
        title: "Simulation Complete",
        description: "The heat transfer simulation has been calculated successfully.",
      });
    } catch (error) {
      console.error("Simulation error:", error);
      toast({
        title: "Simulation Error",
        description: "An error occurred while running the simulation.",
        variant: "destructive",
      });
    }
  };
  
  // Handle saving the simulation
  const handleSaveSimulation = (name: string, params: SimulationParameters, results: SimulationResults) => {
    saveSimulation(name, params, results);
  };
  
  // Reset to default parameters
  const handleReset = () => {
    setParameters(generateSampleData());
    toast({
      title: "Parameters Reset",
      description: "Simulation parameters have been reset to default values.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Heat Transfer Simulation Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Parameters */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Simulation Parameters</h2>
              
              <Tabs defaultValue="layer1">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="layer1">Layer 1</TabsTrigger>
                  <TabsTrigger value="layer2">Layer 2</TabsTrigger>
                  <TabsTrigger value="layer3">Layer 3</TabsTrigger>
                </TabsList>
                
                <TabsContent value="layer1">
                  <ParameterSlider
                    label="Thickness"
                    value={parameters.layers[0].thickness}
                    onChange={(value) => updateLayer(0, 'thickness', value)}
                    min={0.01}
                    max={0.2}
                    step={0.01}
                    unit="m"
                    tooltip="Thickness of the first layer in meters"
                  />
                  <ParameterSlider
                    label="Thermal Conductivity"
                    value={parameters.layers[0].thermalConductivity}
                    onChange={(value) => updateLayer(0, 'thermalConductivity', value)}
                    min={0.1}
                    max={5}
                    step={0.1}
                    unit="W/(m·K)"
                    tooltip="Thermal conductivity of the first layer in watts per meter-kelvin"
                  />
                </TabsContent>
                
                <TabsContent value="layer2">
                  <ParameterSlider
                    label="Thickness"
                    value={parameters.layers[1].thickness}
                    onChange={(value) => updateLayer(1, 'thickness', value)}
                    min={0.01}
                    max={0.2}
                    step={0.01}
                    unit="m"
                    tooltip="Thickness of the second layer in meters"
                  />
                  <ParameterSlider
                    label="Thermal Conductivity"
                    value={parameters.layers[1].thermalConductivity}
                    onChange={(value) => updateLayer(1, 'thermalConductivity', value)}
                    min={1}
                    max={200}
                    step={1}
                    unit="W/(m·K)"
                    tooltip="Thermal conductivity of the second layer in watts per meter-kelvin"
                  />
                </TabsContent>
                
                <TabsContent value="layer3">
                  <ParameterSlider
                    label="Thickness"
                    value={parameters.layers[2].thickness}
                    onChange={(value) => updateLayer(2, 'thickness', value)}
                    min={0.01}
                    max={0.2}
                    step={0.01}
                    unit="m"
                    tooltip="Thickness of the third layer in meters"
                  />
                  <ParameterSlider
                    label="Thermal Conductivity"
                    value={parameters.layers[2].thermalConductivity}
                    onChange={(value) => updateLayer(2, 'thermalConductivity', value)}
                    min={0.1}
                    max={5}
                    step={0.1}
                    unit="W/(m·K)"
                    tooltip="Thermal conductivity of the third layer in watts per meter-kelvin"
                  />
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <ParameterSlider
                  label="Heat Source"
                  value={parameters.heatSource}
                  onChange={updateHeatSource}
                  min={100}
                  max={5000}
                  step={100}
                  unit="W/m²"
                  tooltip="Heat source intensity in watts per square meter"
                />
              </div>
              
              <LayerVisualizer layers={parameters.layers} />
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <div className="space-x-2">
                  {results && (
                    <SaveSimulationDialog
                      params={parameters}
                      results={results}
                      onSave={handleSaveSimulation}
                    />
                  )}
                  <Button onClick={handleRunSimulation}>
                    Run Simulation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Right Column - Results */}
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Simulation Results</h2>
              
              {results ? (
                <>
                  <TemperatureChart data={results} />
                  <ResultsTable results={results} />
                </>
              ) : (
                <div className="flex justify-center items-center h-[400px]">
                  <p className="text-muted-foreground">Run the simulation to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">1. Frontend Setup:</h3>
              <p className="text-muted-foreground">The dashboard is already running. Adjust the sliders to modify simulation parameters and click "Run Simulation" to see the results.</p>
            </div>
            <div>
              <h3 className="font-medium">2. Backend Setup (optional):</h3>
              <p className="text-muted-foreground">To enable saving simulations, install the required dependencies and run the Express server:</p>
              <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                <code>{`# Install required packages
npm install express cors uuid

# Run the server
node src/server/index.js`}</code>
              </pre>
            </div>
            <div>
              <h3 className="font-medium">3. Understanding the Visualization:</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Blue layers represent high thermal conductivity materials (like metals)</li>
                <li>Orange layers represent low thermal conductivity materials (like insulation)</li>
                <li>The chart shows temperature distribution across the layers</li>
                <li>The table compares analytical and numerical solutions at sample points</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
