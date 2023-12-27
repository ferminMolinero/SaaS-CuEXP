import { useState } from "react";
import { Alert, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { Field, Formik, Form } from "formik";
import { TextField } from "formik-material-ui";
import { number, object } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setCompany, setUserCompany } from "state";
import { useGetCompanyQuery } from "state/api";

//Datos a rellenar:
/*
customerCreditDays: Number, //Credit Days
    suppliersBuyersCreditDays: Number,
    suppliersServicesCreditDays
    */

const creditBasicSchema = object({
  customerCreditDays: number()
    .required("Obligatorio")
    .min(0, "El valor mínimo es 0")
    .max(120, "El valor máximo es 120"),
  suppliersBuyersCreditDays: number()
    .required("Obligatorio")
    .min(0, "El valor mínimo es 0")
    .max(120, "El valor máximo es 120"),
  suppliersServicesCreditDays: number()
    .required("Obligatorio")
    .min(0, "El valor mínimo es 0")
    .max(120, "El valor máximo es 120"),
  operativeBox: number()
    .required("Obligatorio")
    .min(0, "El valor mínimo es 0")
    .max(120, "El valor máximo es 120"),
});

//Setup the initials values

const FormCreditDays = () => {
  //Aqui tengo que ver como obtener los datos de company para representarlos en el formulario si ya existen, para que el autor pueda modificar
  //Necesito saber que compañía se está seleccionando

  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const company = useSelector((state) => state.global.company);
  const user = useSelector((state) => state.global.user);
  const { data, isLoading } = useGetCompanyQuery(company);
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  //Esto falla porque no le da tiempo a recoger los datos antes de hacer la  inicialización. Si la api es async podría hacerlo con una promise?
  /*
    const initialCompanyBasicRegister = {
      name: data.name || "",
      description: data.description || "",
      promoters: data.promoters || [{ name: "", percentage: "" }],
      yearOfCreation: data.yearOfCreation || "",
      yearOfAnalysis: data.yearOfAnalysis || "",
    };
*/
  //Dejo estos mientras no consiga obtener de forma asyncrona los valores
  const initialCompanyCreditDays = {
    customerCreditDays: data ? data.customerCreditDays : 30,
    suppliersBuyersCreditDays: data ? data.suppliersBuyersCreditDays : 30,
    suppliersServicesCreditDays: data ? data.suppliersServicesCreditDays : 30,
    operativeBox: data ? data.operativeBox : 30,
  };
  //Esta sería la función con la que guardaría los datos.
  const updateCompanyCreditDays = async (values, onSubmitProps) => {
    //Esto debería cambairla por una llamada a las apis para que este más bonito:)
    const savedUserResponse = await fetch(
      "http://localhost:5001/inbound/updateCompanyCreditDays",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, company }),
      }
    );
    onSubmitProps.resetForm();
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (company) {
      await updateCompanyCreditDays(values, onSubmitProps);
      if (updateCompanyCreditDays) {
        setAlertContent("¡Se han actualizado los impuestos de su compañía!");
        setAlert(true);
      }
    }
    window.location.reload(false);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialCompanyCreditDays}
      enableReinitialize
      validationSchema={creditBasicSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
      }) => (
        <Form onSubmit={handleSubmit} autoComplete="off">
          <div>
            {alert ? <Alert severity="success">{alertContent}</Alert> : <></>}
          </div>
          <div>
            {" "}
            <h3>Días de crédito soportado</h3>
          </div>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(3, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
            }}
          >
            <Field
              component={TextField}
              label="Días de crédito a compradores"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.customerCreditDays}
              name="customerCreditDays"
              error={
                Boolean(touched.customerCreditDays) &&
                Boolean(errors.customerCreditDays)
              }
              sx={{ gridColumn: "span 2" }}
            />

            <Field
              component={TextField}
              label="Días de crédito a receptores de servicio"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.suppliersBuyersCreditDays}
              name="suppliersBuyersCreditDays"
              error={
                Boolean(touched.suppliersBuyersCreditDays) &&
                Boolean(errors.suppliersBuyersCreditDays)
              }
              helperText={
                touched.suppliersBuyersCreditDays &&
                errors.suppliersBuyersCreditDays
              }
              sx={{ gridColumn: "span 2" }}
            />
            <Field
              component={TextField}
              label="Días de crédito a proveedores de servicio"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.suppliersServicesCreditDays}
              name="suppliersServicesCreditDays"
              error={
                Boolean(touched.suppliersServicesCreditDays) &&
                Boolean(errors.suppliersServicesCreditDays)
              }
              helperText={
                touched.suppliersServicesCreditDays &&
                errors.suppliersServicesCreditDays
              }
              sx={{ gridColumn: "span 2" }}
            />
            <Field
              component={TextField}
              label="Días de caja operativa"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.operativeBox}
              name="operativeBox"
              error={
                Boolean(touched.operativeBox) && Boolean(errors.operativeBox)
              }
              helperText={touched.operativeBox && errors.operativeBox}
              sx={{ gridColumn: "span 2" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              disabled={isSubmitting}
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              Guardar datos
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default FormCreditDays;
