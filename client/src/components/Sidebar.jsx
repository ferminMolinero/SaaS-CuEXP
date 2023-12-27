import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ConstructionOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  AddBusinessOutlined,
  ReceiptLongOutlined,
  PointOfSaleOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
  AllInboxOutlined,
  Person3Outlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

//LIST OF NAV ITEMS
const navItems = [
  {
    text: "Dashboard",
    link: "dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Entradas de Datos",
    icon: null,
  },
  {
    text: "Mi Empresa",
    link: "miempresa",
    icon: <AddBusinessOutlined />,
  },
  {
    text: "Miembros",
    icon: <Person3Outlined />,
    link: "miembros",
  },
  {
    text: "Impuestos",
    icon: <ReceiptLongOutlined />,
    link: "impuestos",
  },
  {
    text: "Activos",
    icon: <ConstructionOutlined />,
    link: "activos",
  },
  {
    text: "Suministros",
    icon: <AllInboxOutlined />,
    link: "suministros",
  },
  {
    text: "Inversiones",
    icon: <PieChartOutlined />,
    link: "inversiones",
  },
  {
    text: "Crédito",
    icon: <ShoppingCartOutlined />,
    link: "credito",
  },
  {
    text: "Estimación de ventas",
    icon: null,
  },
  {
    text: "CNS1",
    icon: <ReceiptLongOutlined />,
    link: "servicios",
  } /*
  {
    text: "Geography",
    icon: <PublicOutlined />,
  },*/,
  {
    text: "Consolidación de Datos",
    icon: null,
  },
  {
    text: "Overview",
    icon: <PointOfSaleOutlined />,
  },
  /*{
    text: "Daily",
    icon: <TodayOutlined />,
  },
  {
    text: "Monthly",
    icon: <CalendarMonthOutlined />,
  },
  {
    text: "Breakdown",
    icon: <PieChartOutlined />,
  },*/
  {
    text: "Mis Gráficos",
    icon: null,
  },
  /*{
    text: "Admin",
    icon: <AdminPanelSettingsOutlined />,
  },*/
  {
    text: "Performance",
    icon: <TrendingUpOutlined />,
  },
];

export const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);
  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 1.5rem 1.5rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h2" fontWeight="bold">
                    Cu.Exp
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, link, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();
                const lcLink = link;

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcLink}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box position="absolute" bottom="2rem"></Box>
        </Drawer>
      )}
    </Box>
  );
};
