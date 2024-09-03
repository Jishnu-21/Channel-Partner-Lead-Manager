import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LeadsByPartnerChart = ({ data, title, selectedPartner, uniquePartners }) => {
  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  // Determine which partners to show in the chart
  const partnersToShow = selectedPartner ? [selectedPartner] : uniquePartners;

  // Create a complete dataset with zero values for missing months
  const completeData = partnersToShow.reduce((acc, partner) => {
    data.forEach((entry) => {
      const existingEntry = acc.find((d) => d.date === entry.date);
      if (existingEntry) {
        existingEntry[partner] = entry[partner] !== undefined ? entry[partner] : 0;
      } else {
        acc.push({
          date: entry.date,
          [partner]: entry[partner] !== undefined ? entry[partner] : 0,
        });
      }
    });
    return acc;
  }, []);

  // Sort the data by date
  completeData.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={completeData} margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(-2)}`;
              }}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => {
                const date = new Date(value);
                return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
              }}
              formatter={(value, name) => [value, `Partner: ${name}`]}
            />
            <Legend />
            {partnersToShow.map((partner, index) => (
              <Line
                key={partner}
                type="monotone"
                dataKey={partner}
                stroke={COLORS[index % COLORS.length]}
                activeDot={{ r: 8 }}
                connectNulls={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LeadsByPartnerChart;