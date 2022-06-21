import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({ data, labels }) => {
  const dataInput = {
    labels: labels,
    datasets: [
      {
        label: "# of Votes",
        data: data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(225, 90, 102, 0.2)",
          "rgba(84, 102, 215, 0.2)",
          "rgba(205, 106, 66, 0.2)",
          "rgba(25, 102, 112, 0.2)",
          "rgba(193, 152, 205, 0.2)",
          "rgba(155, 109, 94, 0.2)",
          `rgba(${Math.floor(Math.random() * 1000)}, ${Math.floor(
            Math.random() * 100
          )}, ${Math.floor(Math.random() * 100)}, 0.2)`,
          `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(
            Math.random() * 100
          )}, ${Math.floor(Math.random() * 100)}, 0.2)`,
          `rgba(${Math.floor(Math.random() * 1000)}, ${Math.floor(
            Math.random() * 10
          )}, ${Math.floor(Math.random() * 100)}, 0.2)`,
          `rgba(${Math.floor(Math.random() * 1000)}, ${Math.floor(
            Math.random() * 10
          )}, ${Math.floor(Math.random() * 100)}, 0.2)`,
          `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(
            Math.random() * 100
          )}, ${Math.floor(Math.random() * 100)}, 0.2)`,
          `rgba(${Math.floor(Math.random() * 1000)}, ${Math.floor(
            Math.random() * 100
          )}, ${Math.floor(Math.random() * 100)}, 0.2)`,
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(225, 90, 102, 1)",
          "rgba(84, 102, 215, 1)",
          "rgba(205, 106, 66, 1)",
          "rgba(25, 102, 112, 1)",
          "rgba(193, 152, 205, 1)",
          "rgba(155, 109, 94, 1)",
          `rgba(${Math.floor(Math.random() * 1000)}, ${Math.floor(
            Math.random() * 100
          )}, ${Math.floor(Math.random() * 100)}, 1)`,
          `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(
            Math.random() * 100
          )}, ${Math.floor(Math.random() * 100)}, 1)`,
          `rgba(${Math.floor(Math.random() * 1000)}, ${Math.floor(
            Math.random() * 10
          )}, ${Math.floor(Math.random() * 100)}, 1)`,
          `rgba(${Math.floor(Math.random() * 1000)}, ${Math.floor(
            Math.random() * 10
          )}, ${Math.floor(Math.random() * 100)}, 1)`,
          `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(
            Math.random() * 100
          )}, ${Math.floor(Math.random() * 100)}, 1)`,
          `rgba(${Math.floor(Math.random() * 1000)}, ${Math.floor(
            Math.random() * 100
          )}, ${Math.floor(Math.random() * 100)}, 1)`,
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={dataInput} />;
};
