import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { fetchCarreras } from "../../services/firebaseService";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "nombre_carrera",
      headerName: "Carrera",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "abreviacion",
      headerName: "Abreviación",
      flex: 1,
    },
    {
      field: "ingresados",
      headerName: "Ingresos",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCarreras();
        setRows(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header title="Ingresos Trimestrales" subtitle="Alumnos ingresados por trimestre" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
