
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { SimulationResults } from '@/types';

interface TemperatureChartProps {
  data: SimulationResults;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
  // Prepare the data for the chart - we'll merge the datasets
  const chartData = data.analyticalSolution.map((analytical, index) => {
    const numerical = data.numericalSolution[index];
    return {
      position: analytical.position.toFixed(2),
      analytical: analytical.temperature,
      numerical: numerical.temperature,
    };
  });

  return (
    <div className="w-full h-[350px] mt-6">
      <h3 className="font-medium mb-2">Temperature Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="position" 
            label={{ 
              value: 'Position (m)', 
              position: 'insideBottomRight', 
              offset: -5 
            }} 
          />
          <YAxis 
            label={{ 
              value: 'Temperature (K)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }} 
          />
          <Tooltip 
            formatter={(value: number) => [value.toFixed(2) + ' K', '']}
            labelFormatter={(label) => `Position: ${label} m`}
            contentStyle={{ 
              borderRadius: '0.375rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="analytical" 
            name="Analytical Solution"
            stroke="#3B82F6" 
            strokeWidth={2}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="numerical" 
            name="Numerical Solution"
            stroke="#F97316" 
            strokeWidth={2}
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
