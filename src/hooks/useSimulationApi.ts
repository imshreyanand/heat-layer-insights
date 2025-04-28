
import { useState } from 'react';
import { SimulationParameters, SavedSimulation } from '../types';
import { useToast } from '@/components/ui/use-toast';

// API base URL - change this if your server is on a different port or host
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Custom hook for interacting with the simulation API
 */
export function useSimulationApi() {
  const [loading, setLoading] = useState(false);
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const { toast } = useToast();

  /**
   * Fetch all saved simulations
   */
  const fetchSimulations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/simulations`);
      if (!response.ok) throw new Error('Failed to fetch simulations');
      
      const data = await response.json();
      setSavedSimulations(data);
      return data;
    } catch (error) {
      console.error("Error fetching simulations:", error);
      toast({
        title: "Error",
        description: "Failed to load saved simulations",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save a simulation to the server
   */
  const saveSimulation = async (name: string, params: SimulationParameters, results: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/simulations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          parameters: params,
          results
        }),
      });

      if (!response.ok) throw new Error('Failed to save simulation');
      
      const savedSim = await response.json();
      setSavedSimulations(prev => [...prev, savedSim]);
      
      toast({
        title: "Simulation Saved",
        description: `Simulation "${name}" has been saved successfully`,
      });
      
      return savedSim;
    } catch (error) {
      console.error("Error saving simulation:", error);
      toast({
        title: "Error",
        description: "Failed to save simulation",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a simulation from the server
   */
  const deleteSimulation = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/simulations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete simulation');
      
      setSavedSimulations(prev => prev.filter(sim => sim.id !== id));
      
      toast({
        title: "Simulation Deleted",
        description: "Simulation has been deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting simulation:", error);
      toast({
        title: "Error",
        description: "Failed to delete simulation",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    savedSimulations,
    fetchSimulations,
    saveSimulation,
    deleteSimulation,
  };
}
