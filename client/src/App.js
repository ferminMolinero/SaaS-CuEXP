import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { themeSettings } from "theme";
import Login from "scenes/loginPage"; //OK
import Dashboard from "scenes/dashboard"; //OK
import Layout from "scenes/layout"; //OK
import Company from "scenes/company";
import Taxes from "scenes/taxes";
import Assets from "scenes/assets";
import Supplies from "scenes/supplies";
import CreditDays from "scenes/creditDays";
import Investments from "scenes/investments";
import CNS1 from "scenes/cns1";
import Members from "scenes/staffMembers";

//En las rutas que la ruta vacía me rediriga a la Landing page excepto que ya este logueado
function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.global.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={isAuth ? <Layout /> : undefined}>
              <Route
                path="/"
                element={
                  isAuth ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={isAuth ? <Dashboard /> : <Navigate to="/" replace />}
              />
              <Route path="/miempresa" element={<Company />} />
              <Route path="/miembros" element={<Members />} />
              <Route path="/impuestos" element={<Taxes />} />
              <Route path="/activos" element={<Assets />} />
              <Route path="/suministros" element={<Supplies />} />
              <Route path="/inversiones" element={<Investments />} />
              <Route path="/credito" element={<CreditDays />} />
              <Route path="/servicios" element={<CNS1 />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
