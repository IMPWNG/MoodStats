import { Line } from "react-chartjs-2";

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
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
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

export default function StatsMood({ moods: data }) {
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

  const sortedData = data?.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  const labels = sortedData?.map((item) =>
    formatDateTime(item.created_at, "date")
  );


function logDataByDay(data) {
  const dataByDay = {};
  data.forEach((item) => {
    const dateStr = formatDateTime(item.created_at, "date");
    if (!dataByDay[dateStr]) {
      dataByDay[dateStr] = [];
    }
    dataByDay[dateStr].push(item);
  });

  for (const dateStr in dataByDay) {
    const div = document.createElement("div");
    const button = document.createElement("button");
    button.innerText = `Items for ${dateStr} (${dataByDay[dateStr].length})`;
    button.addEventListener("click", () => {
      if (div.childNodes.length > 1) {
        div.removeChild(div.lastChild);
      } else {
        const ul = document.createElement("ul");
        dataByDay[dateStr].forEach((item) => {
          const li = document.createElement("li");
          li.innerText = JSON.stringify(item);
          ul.appendChild(li);
        });
        div.appendChild(ul);
      }
    });
    div.appendChild(button);
    document.body.appendChild(div);
  }
}

  const chartData = {
    labels: labels,
    datasets: [
      { 
        label: "Rate/Date",
        data: data?.map((item) => item.rating),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
    ],
    options: {
      scales: {
        x: {
          type: "category",
          labels: data?.map((item) => formatDateTime(item.created_at, "date")),
        },
      },
    },
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

    scales: {
      yAxes: [
        {
          ticks: {
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
      ],
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
    <div className="w-full">
      <Line data={chartData} options={options} legend={legend} />
      <button onClick={() => logDataByDay(data)}>Log data by day

      </button>
    </div>
  );
}
