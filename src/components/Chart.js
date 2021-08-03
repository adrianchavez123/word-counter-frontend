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

const data = [
  {
    name: "Tarea 1",
    cantidad_palabras_detectadas: 89,
    cantidad_palabras_en_lectura: 150,
    amt: 200,
  },
  {
    name: "Tarea 2",
    cantidad_palabras_detectadas: 95,
    cantidad_palabras_en_lectura: 160,
    amt: 200,
  },
  {
    name: "Tarea 3",
    cantidad_palabras_detectadas: 115,
    cantidad_palabras_en_lectura: 130,
    amt: 200,
  },
  {
    name: "Tarea 4",
    cantidad_palabras_detectadas: 120,
    cantidad_palabras_en_lectura: 170,
    amt: 200,
  },
  {
    name: "Tarea 5",
    cantidad_palabras_detectadas: 135,
    cantidad_palabras_en_lectura: 160,
    amt: 200,
  },
  {
    name: "Tarea 6",
    cantidad_palabras_detectadas: 140,
    cantidad_palabras_en_lectura: 150,
    amt: 200,
  },
];

export default function Chart() {
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
          data={data}
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
