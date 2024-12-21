import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import { useEffect, useState } from "react";
import { fetchCarreras } from "../../services/firebaseService";

const icons = {
  total: PersonAddIcon,
  promedio: CalendarMonthIcon,
  carreras: AutoStoriesIcon,
  maxTrimestre: TrendingUpIcon,
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCarreras();
        setStats(calculateStats(data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (data) => {
    let totalIngresos = 0;
    const trimestreIngresos = {};
    const carrerasSet = new Set();

    data.forEach((entry) => {
      const siglas = entry.Siglas || "SN";
      carrerasSet.add(siglas);

      Object.keys(entry).forEach((key) => {
        const match = key.match(/^(\d{4})[-\s]*(\d)T$/i) || key.match(/^NI\s(\d{4})\sT(\d)$/i);
        if (match) {
          const trimestre = `${match[1]}-Q${match[2]}`;
          const ingresos = parseInt(entry[key], 10) || 0;
          totalIngresos += ingresos;
          trimestreIngresos[trimestre] = (trimestreIngresos[trimestre] || 0) + ingresos;
        }
      });
    });

    const maxTrimestre = Object.entries(trimestreIngresos).reduce(
      (max, current) => (current[1] > max[1] ? current : max),
      ["", 0]
    );

    const promedioIngresos = totalIngresos / Object.keys(trimestreIngresos).length;

    return [
      { key: "total", title: totalIngresos.toLocaleString(), subtitle: "Total de Ingresos", value: 1.0 },
      { key: "promedio", title: promedioIngresos.toFixed(2), subtitle: "Promedio por Trimestre", value: 0.75 },
      { key: "carreras", title: carrerasSet.size, subtitle: "Carreras Activas", value: 0.5 },
      {
        key: "maxTrimestre",
        title: `${maxTrimestre[0]}: ${maxTrimestre[1]} ingresos`,
        subtitle: "Trimestre con Más Ingresos",
        value: 0.8,
      },
    ];
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Welcome Francisco" />
        <Button
          sx={{
            backgroundColor: colors.orangeAccent[500],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {stats.map((stat) => {
          const Icon = icons[stat.key];
          return (
            <Box
              key={stat.key}
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={stat.title}
                subtitle={stat.subtitle}
                progress={stat.value}
                increase="+15%"
                icon={<Icon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>
          );
        })}

        <Box gridColumn="span 12" gridRow="span 4" backgroundColor={colors.primary[400]}>
          <Box m="30px 0 0 10px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
