import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const PackageDistributionChart = ({ data, title, companyNames }) => {
  const packageData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: '0 0 auto' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      </CardContent>
      <Box sx={{ flex: '1 1 auto', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={packageData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="70%"
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {packageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [
                `${value} orders`, 
                `${name}\n${companyNames[name].join(', ')}`
              ]} 
            />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default PackageDistributionChart;