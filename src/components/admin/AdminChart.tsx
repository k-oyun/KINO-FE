import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { styled } from "styled-components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type AnyObject = Record<string, any>;
interface chartProp {
  dataValues: AnyObject[];
  chartTitle: string;
  chartLabel: string;
  labelKey: string;
  valueKey: string;
}

const BarContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
`;

const AdminChart = ({
  dataValues,
  chartTitle,
  chartLabel,
  labelKey,
  valueKey,
}: chartProp) => {
  const labels = dataValues.map((d) => d[labelKey]);
  const values = dataValues.map((d) => d[valueKey]);
  const max = Math.max(...values);
  const chartData = {
    labels,
    datasets: [
      {
        label: chartLabel,
        data: values,
        backgroundColor: values.map((v) =>
          v === max ? "rgba(224, 74, 120, 1)" : "rgba(224, 74, 120, 0.4)"
        ),
        borderColor: values.map((v) =>
          v === max ? "rgba(224, 74, 120, 1)" : "rgba(224, 74, 120, 0.7)"
        ),
        borderWidth: 1,
        borderRadius: 12,
        barThickness: 32,
        borderSkipped: true,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: "easeOutBounce",
    },
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: chartTitle },
    },
  };

  return (
    <BarContainer>
      <Bar data={chartData} options={options} />
    </BarContainer>
  );
};

export default AdminChart;
