import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Header from "components/Header";
// import { useState } from "react";
import FormInvestments from "./Form";

const Investments = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Inversiones"
        subtitle="Activos invertidos actuales de tu empresa"
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
            Aportacion en inversiones actuales totales
          </Typography>
          <FormInvestments />
        </Box>
      </Box>
    </Box>
  );
};

export default Investments;
