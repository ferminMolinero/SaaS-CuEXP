import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Header from "components/Header";
// import { useState } from "react";
import FormTaxes from "./Form";

const Company = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Impuestos"
        subtitle="El robo mensual organizado por la mafia del estado"
      />

      <Box>
        <Box
          width={isNonMobile ? "50%" : "93%"}
          p="2rem"
          m="2rem auto"
          borderRadius="1.5rem"
          backgroundColor={theme.palette.background.alt}
        >
          <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
            Utiliza este formulario para cumplimentar que impuestos deberías
            pagar en tu empresa
          </Typography>
          <FormTaxes />
        </Box>
      </Box>
    </Box>
  );
};

export default Company;
