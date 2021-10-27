import React from "react";
import Title from "./Title";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Chart({ rows }) {
  return (
    <React.Fragment>
      <Title>
        Comparación palabras en lecturas con promedio palabras detectadas en
        audios
      </Title>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={rows}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cantidad_palabras_detectadas"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="cantidad_palabras_en_lectura"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
