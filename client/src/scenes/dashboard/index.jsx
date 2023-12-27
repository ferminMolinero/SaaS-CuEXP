import React, { useEffect, useState, setMode } from "react";
import {
  Button,
  Typography,
  Container,
  Paper,
  Box,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const theme = useTheme();
  const [hasCompany, setHasCompany] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Aquí puedes obtener los datos del usuario y determinar si ya tiene una empresa.
  //   // Por ejemplo:
  //   // fetchUserData().then(data => {
  //   //     if(data.company) {
  //   //         setHasCompany(true);
  //   //         setCompanyData(data.company);
  //   //     }
  //   // });
  // }, []);

  return (
    <Container>
      {hasCompany ? (
        <>
          <Typography variant="h4" gutterBottom>
            Gráficos de tu empresa
          </Typography>
          <Typography variant="body1" gutterBottom>
            Estos son los gráficos y predicciones basados en los datos que nos
            proporcionaste. Si deseas ajustar o agregar más datos, utiliza las
            opciones de gestión.
          </Typography>
          {/* Renderizar gráficos aquí */}
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="75vh"
        >
          <Paper
            elevation={3}
            sx={{
              padding: "20px",
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[200],
            }}
          >
            <Box textAlign="center">
              <Typography variant="h4" gutterBottom>
                Bienvenido a CuExp
              </Typography>
              <Typography variant="body1" gutterBottom>
                ¡Estamos emocionados de tenerte aquí! Para aprovechar al máximo
                las funcionalidades, te sugerimos crear tu primera empresa. Esto
                nos permitirá mostrar gráficos personalizados y ofrecerte
                predicciones precisas basadas en tus datos.
              </Typography>
              <Button
                onClick={() => navigate("/miempresa")}
                variant="contained"
                style={{ marginTop: "15px" }}
              >
                Crear mi Empresa
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
