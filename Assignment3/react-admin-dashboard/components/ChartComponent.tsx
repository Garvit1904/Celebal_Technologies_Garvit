
import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types';

interface ChartDataPoint {
  name: string;
  value?: number; // For PieChart
  [key: string]: string | number | undefined; // For other charts
}

interface ChartComponentProps {
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'pie';
  dataKeys: string[] | { nameKey: string, valueKey: string }; // string[] for line/bar, object for pie
  title?: string;
  colors?: string[]; // Optional custom colors
}

const defaultColorsLight = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
const defaultColorsDark = ['#60a5fa', '#34d399', '#facc15', '#f472b6', '#a78bfa'];

const ChartComponent: React.FC<ChartComponentProps> = ({ data, type, dataKeys, title, colors }) => {
  const { theme } = useTheme();
  const currentColors = colors || (theme === Theme.Light ? defaultColorsLight : defaultColorsDark);
  const axisStrokeColor = theme === Theme.Light ? '#6b7280' : '#9ca3af'; // gray-500 dark:gray-400
  const gridStrokeColor = theme === Theme.Light ? '#e5e7eb' : '#374151'; // gray-200 dark:gray-700

  return (
    <div className="h-80 md:h-96 w-full"> {/* Ensure height is set for ResponsiveContainer */}
      {title && <h3 className="text-lg font-semibold mb-4 text-center text-secondary-800 dark:text-secondary-200">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' && Array.isArray(dataKeys) && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
            <XAxis dataKey="name" stroke={axisStrokeColor} />
            <YAxis stroke={axisStrokeColor} />
            <Tooltip
              contentStyle={{ backgroundColor: theme === Theme.Light ? '#ffffff' : '#1f2937', border: `1px solid ${gridStrokeColor}`}}
              itemStyle={{ color: theme === Theme.Light ? '#1f2937' : '#f3f4f6' }}
            />
            <Legend />
            {dataKeys.map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={currentColors[index % currentColors.length]} activeDot={{ r: 8 }} />
            ))}
          </LineChart>
        )}
        {type === 'bar' && Array.isArray(dataKeys) && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
            <XAxis dataKey="name" stroke={axisStrokeColor} />
            <YAxis stroke={axisStrokeColor} />
            <Tooltip
              contentStyle={{ backgroundColor: theme === Theme.Light ? '#ffffff' : '#1f2937', border: `1px solid ${gridStrokeColor}`}}
              itemStyle={{ color: theme === Theme.Light ? '#1f2937' : '#f3f4f6' }}
            />
            <Legend />
            {dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={currentColors[index % currentColors.length]} />
            ))}
          </BarChart>
        )}
        {type === 'pie' && typeof dataKeys === 'object' && 'nameKey' in dataKeys && 'valueKey' in dataKeys && (
           <PieChart>
            <Tooltip
                contentStyle={{ backgroundColor: theme === Theme.Light ? '#ffffff' : '#1f2937', border: `1px solid ${gridStrokeColor}`}}
                itemStyle={{ color: theme === Theme.Light ? '#1f2937' : '#f3f4f6' }}
            />
            <Legend />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={Math.min(100, (window.innerWidth < 768 ? 60 : 100) )} // Responsive radius
              fill="#8884d8"
              dataKey={dataKeys.valueKey}
              nameKey={dataKeys.nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={currentColors[index % currentColors.length]} />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
