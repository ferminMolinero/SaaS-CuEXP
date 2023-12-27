import { useState } from "react";
import { Alert, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { Field, FieldArray, Formik, Form } from "formik";
import { TextField } from "formik-material-ui";
import { array, number, object, string, ValidationError } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setCompany, setUserCompany } from "state";
import { useGetCompanyQuery } from "state/api";

//Datos a rellenar:
/*taxes: {
    ivaBuys: Number,
    ivaServices: Number,
    ivaGeneral: Number,
    ivaSales: Number,
    societyTax: Number,
  },
  socialSecurity: {
    mediumAut: Number,
    growthRate: Number,
    employee: Number,
  },*/

const taxesBasicSchema = object({
  ivaBuys: number()
    .required("Obligatorio")
    .min(0, "El valor mínimo es 0")
    .max(100, "El valor máximo es 100"),
  ivaServices: number()
    .required("Obligatorio")
    .min(0, "El valor mínimo es 0")
    .max(100, "El valor máximo es 100"),
  ivaGeneral: number()
    .required("Obligatorio")
    .min(0, "El valor mínimo es 0")
    .max(100, "El valor máximo es 100"),
  ivaSales: number()
    .required("Obligatorio")
    .min(0, "El valor mínimo es 0")
    .max(100, "El valor máximo es 100"),
  societyTax: number()
    .required("Obligatorio")
    .min(0, "El valor mínimo es 0")
    .max(100, "El valor máximo es 100"),
  mediumAut: number(),
  growthRate: number()
    .min(0, "El valor mínimo es 0")
    .max(100, "El valor máximo es 100"),
  employee: number()
    .required("Obligatorio")
    .min(0, "El valor mínimo es 0")
    .max(100, "El valor máximo es 100"),
});

//Setup the initials values

const FormTaxes = () => {
  //Aqui tengo que ver como obtener los datos de company para representarlos en el formulario si ya existen, para que el autor pueda modificar
  //Necesito saber que compañía se está seleccionando

  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const company = useSelector((state) => state.global.company);
  const user = useSelector((state) => state.global.user);
  const { data, isLoading } = useGetCompanyQuery(company);
  const dispatch = useDispatch();
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
  const initialCompanyTaxes = {
    ivaBuys: data ? data.taxes.ivaBuys : 12,
    ivaServices: data ? data.taxes.ivaServices : 21,
    ivaGeneral: data ? data.taxes.ivaGeneral : 21,
    ivaSales: data ? data.taxes.ivaSales : 12,
    societyTax: data ? data.taxes.societyTax : 20,
    mediumAut: data ? data.socialSecurity.mediumAut : 315,
    growthRate: data ? data.socialSecurity.growthRate : 2,
    employee: data ? data.socialSecurity.employee : 34,
  };
  //Esta sería la función con la que guardaría los datos.
  const updateCompanyTaxes = async (values, onSubmitProps) => {
    //Esto debería cambairla por una llamada a las apis para que este más bonito:)
    const savedUserResponse = await fetch(
      "http://localhost:5001/inbound/updateCompanyTaxes",
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
      await updateCompanyTaxes(values, onSubmitProps);
      if (updateCompanyTaxes) {
        setAlertContent("¡Se han actualizado los impuestos de su compañía!");
        setAlert(true);
      }
    }
    window.location.reload(false);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialCompanyTaxes}
      enableReinitialize
      validationSchema={taxesBasicSchema}
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
            <h3>IVA soportado</h3>
          </div>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(3, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <Field
              component={TextField}
              label="% Compras"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.ivaBuys}
              name="ivaBuys"
              error={Boolean(touched.name) && Boolean(errors.name)}
              sx={{ gridColumn: "span 1" }}
            />

            <Field
              component={TextField}
              label="% Servicios"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.ivaServices}
              name="ivaServices"
              error={
                Boolean(touched.ivaServices) && Boolean(errors.ivaServices)
              }
              helperText={touched.ivaServices && errors.ivaServices}
              sx={{ gridColumn: "span 1" }}
            />
            <Field
              component={TextField}
              label="% General"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.ivaGeneral}
              name="ivaGeneral"
              error={Boolean(touched.ivaGeneral) && Boolean(errors.ivaGeneral)}
              helperText={touched.ivaGeneral && errors.ivaGeneral}
              sx={{ gridColumn: "span 1" }}
            />
          </Box>
          <div>
            {" "}
            <h3>IVA repercutido</h3>{" "}
          </div>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(3, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <Field
              component={TextField}
              label="% Ventas"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.ivaSales}
              name="ivaSales"
              error={Boolean(touched.ivaSales) && Boolean(errors.ivaSales)}
              helperText={touched.ivaSales && errors.ivaSales}
              sx={{ gridColumn: "span 1" }}
            />
          </Box>
          <div>
            {" "}
            <h3>Gastos seguridad social</h3>
          </div>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(3, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <Field
              component={TextField}
              label="Media para autónomos"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.mediumAut}
              name="mediumAut"
              error={Boolean(touched.mediumAut) && Boolean(errors.mediumAut)}
              helperText={touched.mediumAut && errors.mediumAut}
              sx={{ gridColumn: "span 1" }}
            />
            <Field
              component={TextField}
              label="% Ratio de crecimiento"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.growthRate}
              name="growthRate"
              error={Boolean(touched.growthRate) && Boolean(errors.growthRate)}
              helperText={touched.growthRate && errors.growthRate}
              sx={{ gridColumn: "span 1" }}
            />
            <Field
              component={TextField}
              label="% Cuenta ajena"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.employee}
              name="employee"
              error={Boolean(touched.employee) && Boolean(errors.employee)}
              helperText={touched.employee && errors.employee}
              sx={{ gridColumn: "span 1" }}
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

export default FormTaxes;
