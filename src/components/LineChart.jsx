import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { fetchCarreras } from "../services/firebaseService";

const LineChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [processedData, setProcessedData] = useState([]);
  const [carrerasKeys, setCarrerasKeys] = useState([]);

  // Procesar datos de la API
  const processChartData = (data) => {
    const processed = [];
    const carrerasKeysSet = new Set();
  
    data.forEach((entry) => {
      const siglas = entry.Siglas || "SN"; // Siglas de la carrera, "SN" para sin nombre
      carrerasKeysSet.add(siglas);
  
      Object.keys(entry).forEach((key) => {
        // Detectar trimestres con un patrón más flexible
        const match = key.match(/^(\d{4})[-\s]*(\d)T$/i) || key.match(/^NI\s(\d{4})\sT(\d)$/i);
        if (match) {
          const year = match[1];
          const quarter = match[2];
          const trimestreKey = `${year}-Q${quarter}`;
          const ingresos = parseInt(entry[key], 10) || 0;
  
          let trimestreEntry = processed.find((item) => item.trimestre === trimestreKey);
          if (!trimestreEntry) {
            trimestreEntry = { trimestre: trimestreKey };
            processed.push(trimestreEntry);
          }
  
          trimestreEntry[siglas] = (trimestreEntry[siglas] || 0) + ingresos;
        }
      });
    });
  
    // Ordenar por trimestre
    processed.sort((a, b) => a.trimestre.localeCompare(b.trimestre));
  
    return { processed, carrerasKeys: Array.from(carrerasKeysSet) };
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCarreras();
        const { processed, carrerasKeys } = processChartData(data);
        setProcessedData(processed);
        setCarrerasKeys(carrerasKeys);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ height: 500 }}>
      <ResponsiveBar
        data={processedData}
        keys={carrerasKeys}
        indexBy="trimestre"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
          tooltip: {
            container: {
              color: colors.primary[500],
            },
          },
        }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Trimestre",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Ingresos",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default LineChart;
