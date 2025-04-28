
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SimulationParameters, SimulationResults } from '@/types';

interface SaveSimulationDialogProps {
  params: SimulationParameters;
  results: SimulationResults;
  onSave: (name: string, params: SimulationParameters, results: SimulationResults) => void;
}

const SaveSimulationDialog: React.FC<SaveSimulationDialogProps> = ({ params, results, onSave }) => {
  const [name, setName] = useState('Heat Transfer Simulation');
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave(name, params, results);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Save Simulation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Simulation</DialogTitle>
          <DialogDescription>
            Enter a name for this simulation to save it for future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Simulation name"
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveSimulationDialog;
