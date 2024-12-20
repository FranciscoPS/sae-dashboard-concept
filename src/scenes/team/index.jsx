import { Box, Button, useTheme, Select, MenuItem } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { fetchCarreras, updateCollection } from "../../services/firebaseService";
import { columnas_ingresos_trimestrales } from "../../constants/columns";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = columnas_ingresos_trimestrales;

  const [rows, setRows] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCarreras();
        processAndSetData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const processAndSetData = (data) => {
    const processedData = [];
    const uniqueYears = new Set();

    data.forEach((entry, index) => {
      const carrera = entry["Carrera"];
      const siglas = entry["Siglas"];

      Object.keys(entry).forEach((key) => {
        const match = key.match(/^(\d{4})-(\d)/);
        if (match) {
          const [_, año, trimestre] = match;
          const ingresos = parseInt(entry[key], 10) || 0;

          processedData.push({
            id: `${index}-${key}`,
            nombre_carrera: carrera || "Desconocida",
            abreviacion: siglas || "N/A",
            año: parseInt(año, 10),
            trimestre: `${trimestre}T`,
            ingresados: ingresos,
          });

          uniqueYears.add(parseInt(año, 10));
        }
      });
    });

    setAllData(processedData);
    setRows(processedData);
    setYears([...uniqueYears].sort());
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileToUpload(file); 
      setOpenDialog(true);
    }
  };

  const handleConfirmUpload = async () => {
    setOpenDialog(false);

    if (!fileToUpload) return;

    Papa.parse(fileToUpload, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          await updateCollection(result.data);
          alert("Colección actualizada correctamente");

          const updatedData = await fetchCarreras();
          processAndSetData(updatedData);
        } catch (error) {
          console.error("Error updating collection:", error);
          alert("Ocurrió un error al actualizar la colección");
        }
      },
    });
  };

  const handleCancelUpload = () => {
    setOpenDialog(false); 
    setFileToUpload(null);
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);

    if (year) {
      const filteredRows = allData.filter((row) => row.año === parseInt(year, 10));
      setRows(filteredRows);
    } else {
      setRows(allData);
    }
  };

  return (
    <>
      <Box m="20px">
        <Header title="Ingresos Trimestrales" subtitle="Alumnos ingresados por trimestre" />
        <Box display="flex" alignItems="center" gap="20px" mb="20px">
          <Button variant="contained" component="label">
            Cargar CSV
            <input type="file" accept=".csv" hidden onChange={handleFileChange} />
          </Button>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            displayEmpty
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">
              Todos
            </MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box
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

      <Dialog
        open={openDialog}
        onClose={handleCancelUpload}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmar actualización</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Cargar este archivo actualizará los datos existentes en la base de datos. Esto podría
            afectar la información actual. ¿Deseas continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpload} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmUpload} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Team;
