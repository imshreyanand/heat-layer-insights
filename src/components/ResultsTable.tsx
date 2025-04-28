import React from 'react';
import { SimulationResults } from '@/types';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ResultsTableProps {
  results: SimulationResults;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  // We'll show a subset of points to keep the table manageable
  const samplePoints = results.analyticalSolution.filter((_, i) => i % 10 === 0);
  
  // Calculate differences and error percentages
  const tableData = samplePoints.map((analytical, i) => {
    const index = i * 10; // Because we're sampling every 10th point
    const numerical = results.numericalSolution[index];
    const difference = numerical.temperature - analytical.temperature;
    const errorPercent = (difference / analytical.temperature) * 100;
    
    return {
      position: analytical.position.toFixed(2),
      analytical: analytical.temperature.toFixed(2),
      numerical: numerical.temperature.toFixed(2),
      difference: difference.toFixed(2),
      errorPercent: errorPercent.toFixed(2)
    };
  });

  return (
    <div className="w-full mt-8">
      <h3 className="font-medium mb-2">Analytical vs. Numerical Comparison</h3>
      
      <Table>
        <TableCaption>Comparison at selected positions across the material layers</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Position (m)</TableHead>
            <TableHead>Analytical (K)</TableHead>
            <TableHead>Numerical (K)</TableHead>
            <TableHead>Difference</TableHead>
            <TableHead>Error (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.position}</TableCell>
              <TableCell>{row.analytical}</TableCell>
              <TableCell>{row.numerical}</TableCell>
              <TableCell>{row.difference}</TableCell>
              <TableCell className={Number(row.errorPercent) > 2 ? 'text-heat-600' : 'text-cool-600'}>
                {row.errorPercent}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResultsTable;
