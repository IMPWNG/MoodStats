import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Grid } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatsMood = ({ moods }) => {
  const formatDateTime = (dateTimeString, format) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    let formattedDateTime;
    switch (format) {
      case "date":
        formattedDateTime = `${year}-${month}-${day}`;
        break;
      case "time":
        formattedDateTime = `${hours}:${minutes}:${seconds}`;
        break;
      default:
        formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        break;
    }
    return formattedDateTime;
  };

  const sortedData = moods?.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  const labels = sortedData?.map((item) =>
    formatDateTime(item.created_at, "date")
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Mood",
        data: sortedData?.map((item) => item.mood),
        fill: false,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        pointRadius: 0,
        yAxisID: "y",
      },
      {
        label: "Energy",
        data: sortedData?.map((item) => item.energy),
        fill: false,

        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        pointRadius: 0,
        yAxisID: "y",
      },
      {
        label: "Sleep",
        data: sortedData?.map((item) => item.sleep),
        fill: false,

        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,

        pointRadius: 0,
        yAxisID: "y",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Chart.js Line Chart - Multi Axis",
      },
      ChartRough: {
        roughness: 2,
        bowing: 2,
      },
    },

   
  };

  const legend = {
    display: true,
    position: "bottom",
    labels: {
      fontColor: "#323130",
      fontSize: 14,
    },
  };

  return (
    <Grid container spacing={3} direction="column" alignItems="center">
      <Grid sx={{ mt: 4, backgroundColor: "white" }}>
        <Line data={chartData} options={options} legend={legend} />
      </Grid>
    </Grid>
  );
};

export default StatsMood;
