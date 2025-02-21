import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const LineChartComponent = ({ historicalData }) => {
  const [data, setData] = useState([]); // initialize data as an empty array

  useEffect(() => {
    if (historicalData.prices) { // if prices of historicalData available then executes further code inside if block
      const formattedData = historicalData.prices.map(item => ({
        date: `${new Date(item[0]).toLocaleDateString().slice(0, -5)}`, // here item[0] refers to Date of data and item[1] refers to price of data because on coingecko api site date is first element of array and price is second element of array
        price: item[1],
      }));
      setData(formattedData);
    }
  }, [historicalData]);

  return (
    <div style={{ width: '100%', height: 300, backgroundColor: '#1c1c1c', padding: '1rem', borderRadius: '12px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#bbb" tick={{ fontSize: 12 }} />
          <YAxis stroke="#bbb" tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: '#2c2c2c', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#ff7300' }}
            labelStyle={{ color: '#fff' }}
          />
          <Line type="monotone" dataKey="price" stroke="#ff7300" strokeWidth={2.5} dot={{ fill: '#ff7300', r: 3 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
