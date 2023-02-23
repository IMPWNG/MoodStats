import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function StatsMood({ moods: data }) {
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  };

  const chartData = {
    labels: data?.map((item) => formatDateTime(item.created_at)),
    datasets: [
      {
        label: "Mood Rating",
        data: data?.map((item) => item.rating),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        xAxisID: "x", // specify the category for this dataset
      },
      // add the mood.text field to the dataset
      {
        label: "Mood Description",
        data: data?.map((item) => item.text),
        fill: false,
        borderColor: "rgb(75, 192, 19)",
        tension: 0.1,
        xAxisID: "x", // specify the category for this dataset
      },
    ],
  };

  const options = {
    scales: {
      y: {
        type: "linear",
        ticks: {
          beginAtZero: true,
          max: 10,
        },
        title: {
          display: true,
          text: "Mood Rating",
          font: {
            weight: "bold",
            size: 14,
          },
        },
      },
      x: {
        time: {
          displayFormats: {
            hour: "MMM D, hA",
          },
        },
        title: {
          display: true,
          text: "Date",
          font: {
            weight: "bold",
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
