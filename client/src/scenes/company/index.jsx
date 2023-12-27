import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Header from "components/Header";
// import { useState } from "react";
import FormCompany from "./Form";

const Company = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Mi empresa"
        subtitle="Comienza la creación de tu empresa"
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
            Usando este formulario comenzarás el proceso de análisis económico
            de tu primera empresa.
          </Typography>
          <FormCompany />
        </Box>
      </Box>
    </Box>
  );
};

export default Company;
