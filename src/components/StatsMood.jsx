import { Line, Bar, registerables } from "react-chartjs-2";

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
Chart.register(BarElement);

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
  const [expanded, setExpanded] = useState(false);
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

  const sortedDataByDate = data?.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  const labels = sortedDataByDate?.map((item) =>
    formatDateTime(item.created_at, "date")
  );

  const sortedDataByCategory = data?.sort((a, b) => a.category - b.category);

  const dataByCategory = {};
  sortedDataByCategory?.forEach((item) => {
    if (!dataByCategory[item.category]) {
      dataByCategory[item.category] = [];
    }
    dataByCategory[item.category].push(item);
  });

  const countByCategory = Object.keys(dataByCategory).map((category) => ({
    category,
    count: dataByCategory[category].length,
  }));

  const dataByDay = {};

  sortedDataByDate?.forEach((item) => {
    const dateStr = formatDateTime(item.created_at, "date");
    if (!dataByDay[dateStr]) {
      dataByDay[dateStr] = [];
    }
    dataByDay[dateStr].push(item);
  });

  const countByDay = Object.keys(dataByDay).map((dateStr) => ({
    date: dateStr,
    count: dataByDay[dateStr].length,
  }));

  function logDataByDay(data) {
    const dataByDay = {};
    data.forEach((item) => {
      const dateStr = formatDateTime(item.created_at, "date");
      if (!dataByDay[dateStr]) {
        dataByDay[dateStr] = [];
      }
      dataByDay[dateStr].push(item);
    });

    const dayElements = [];
    for (const dateStr in dataByDay) {
      const items = dataByDay[dateStr];
      const buttonLabel = `${dateStr}: You wrote (${items.length}) quotes`;

      const toggleExpanded = () => {
        setExpanded(!expanded);
      };

      const itemElements = items.map((item) => (
        <ListItem key={item.id}>
          <ListItemText primary={JSON.stringify(item)} />
        </ListItem>
      ));

      const dayElement = (
        <Accordion key={dateStr}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            onClick={toggleExpanded}
          >
            <Typography>{buttonLabel}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>{itemElements}</List>
          </AccordionDetails>
        </Accordion>
      );

      dayElements.push(dayElement);
    }

    return <div>{dayElements}</div>;
  }

  const chartDataRate = {
    labels: labels,
    datasets: [
      {
        label: "Rate",
        data: data?.map((item) => item.rating),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
    ],
    options: {
      scales: {
        x: {
          type: "date",
          labels: data?.map((item) => formatDateTime(item.created_at, "date")),
        },
      },
    },
  };

  const chartDataCount = {
    labels: countByDay?.map((item) => item.date),
    datasets: [
      {
        label: "Count",
        data: countByDay?.map((item) => item.count),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
    ],
  };

  const chartDataCountByCategory = {
    labels: countByCategory?.map((item) => item.category),
    datasets: [
      {
        label: "Count",
        data: countByCategory?.map((item) => item.count),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
    ],
  };

  const optionsRate = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "See the rate of your mood by date",
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

  const optionsCount = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "See the count of your description created by day",
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

  const optionsCategoryCount = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "See the count of your created description by category",
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
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ ml: 4, mr: 4 }}>
        <Button variant="contained" onClick={() => setExpanded(!expanded)} sx={{ mb: 2, textAlign: "center", justifyContent: "center", display: "flex" }}>
          {expanded ? "Hide" : "Show"} Data
        </Button>
        <Typography variant="h5" sx={{ mb: 2 }}>
        {expanded && logDataByDay(sortedDataByDate)}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ ml: 4, mr: 4 }}>


      <Line data={chartDataRate} options={optionsRate} legend={legend} />
      </Grid>
      <Grid item xs={12} sx={{ ml: 4, mr: 4 }}>
      <Line data={chartDataCount} options={optionsCount} legend={legend} />
      </Grid>
      <Grid item xs={12} sx={{ ml: 4, mr: 4 }}>
      <Bar
        data={chartDataCountByCategory}
        options={optionsCategoryCount}
        legend={legend}
      />
      </Grid>

    </Grid>
  );
}
