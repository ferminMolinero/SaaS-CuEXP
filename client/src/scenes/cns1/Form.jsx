import { useState } from "react";
import { Alert, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { Field, FieldArray, Formik, Form } from "formik";
import { TextField } from "formik-material-ui";
import { array, number, object, string, ValidationError } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setCompany, setUserCompany } from "state";
import { useGetCompanyQuery } from "state/api";

//customerSegmentCNS: [{ description: String, percentage: Number }],
/*cns1: {
  salesFirstEx: Number,
  anualGrowth: Number,
  MonthDistribution: Array, (Lo dejo por el momento)
},
serviciesCategories: [
      { description: String, percentage: Number, rate: Number, growth: Number },//CNS1
    ],
*/
const cns1BasicSchema = object({
  salesFirstEx: number().required("Obligatorio"),
  anualGrowth: number().required("Obligatorio").min(0),
  customerSegmentCNS: array(
    object({
      description: string().required("Añade una descriptcion al cliente"),
      percentage: number()
        .required("Añade un porcentaje al segmento de cliente")
        .min(1, "El valor mínimo es 1")
        .max(100, "El valor máximo es 100"),
    })
  )
    .max(5, "Puedes añadir hasta 5 segmentos")
    .test((promoters) => {
      const sum = promoters?.reduce(
        (acc, curr) => acc + (curr.percentage || 0),
        0
      );

      if (sum >= 100) {
        return new ValidationError(
          `El porcentaje no debe superar el 100%. El tuyo es: ${sum}%`,
          undefined,
          "promoters"
        );
      }

      return true;
    }),
  serviciesCategories: array(
    object({
      description: string().required("Añade un nombre al servicio"),
      rate: number()
        .required("Añade una tarifa al servicio")
        .min(1, "El valor mínimo es 1"),
      growth: number()
        .required("Añade una porcentaje de crecimiento al servicio")
        .min(1, "El valor mínimo es 0"),
      percentage: number()
        .required("Añade el porcentaje de negocio de este servicio")
        .min(1, "El valor mínimo es 1")
        .max(100, "El valor máximo es 100"),
    })
  )
    .max(5, "Puedes añadir hasta 5 segmentos")
    .test((promoters) => {
      const sum = promoters?.reduce(
        (acc, curr) => acc + (curr.percentage || 0),
        0
      );

      if (sum >= 100) {
        return new ValidationError(
          `El porcentaje no debe superar el 100%. El tuyo es: ${sum}%`,
          undefined,
          "promoters"
        );
      }

      return true;
    }),
});

const CNS1Company = () => {
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const company = useSelector((state) => state.global.company);
  const { data, isLoading } = useGetCompanyQuery(company);
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const CNS1BasicRegister = {
    salesFirstEx: data ? data.cns1.salesFirstEx : "",
    anualGrowth: data ? data.cns1.anualGrowth : "",
    customerSegmentCNS: data
      ? data.customerSegmentCNS
      : [{ description: "", percentage: "" }],
    serviciesCategories: data
      ? data.serviciesCategories
      : [{ description: "", rate: "", growth: "", percentage: "" }],
  };

  /*const CNS1BasicRegister = {
    salesFirstEx: "",
    anualGrowth: "",
    customerSegmentCNS: [{ description: "", percentage: "" }],
    serviciesCategories: [
      { description: "", rate: "", growth: "", percentage: "" },
    ],
  };*/

  //Esta sería la función con la que guardaría los datos.
  const updateCNS1 = async (values, onSubmitProps) => {
    //Esto debería cambairla por una llamada a las apis para que este más bonito:)
    const savedUserResponse = await fetch(
      "http://localhost:5001/inbound/updateCNS1",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, company }),
      }
    );
    const savedCompany = await savedUserResponse.json();
    onSubmitProps.resetForm();
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (company) {
      await updateCNS1(values, onSubmitProps);
      if (updateCNS1) {
        setAlertContent("¡Se ha actualizado la compañía!");
        setAlert(true);
      }
    }
    window.location.reload(false);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={CNS1BasicRegister}
      enableReinitialize
      validationSchema={cns1BasicSchema}
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
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <Field
              component={TextField}
              label="Cifra de negocio inicial"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.salesFirstEx}
              name="salesFirstEx"
              error={
                Boolean(touched.salesFirstEx) && Boolean(errors.salesFirstEx)
              }
              helperText={touched.salesFirstEx && errors.salesFirstEx}
              sx={{ gridColumn: "span 2" }}
            />
            <Field
              component={TextField}
              label="% Crecimiento anualizado estimado"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.anualGrowth}
              name="anualGrowth"
              error={
                Boolean(touched.anualGrowth) && Boolean(errors.anualGrowth)
              }
              helperText={touched.anualGrowth && errors.anualGrowth}
              sx={{ gridColumn: "span 2" }}
            />
            <Box sx={{ gridColumn: "span 4" }}>
              <Box
                sx={{
                  gridColumn: "span 4",
                  textDecoration: "underline",
                  fontWeight: "bold",
                  marginBottom: "0",
                }}
              >
                Segmentos de clientes
              </Box>
              <FieldArray name="customerSegmentCNS">
                {({ remove, push }) => (
                  <>
                    {values.customerSegmentCNS.length > 0 &&
                      values.customerSegmentCNS.map((_, index) => (
                        <Box
                          key={index}
                          display="grid"
                          gap="15px"
                          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                          sx={{
                            m: "1rem",
                            "& > div": {
                              gridColumn: isNonMobile ? undefined : "span 4",
                            },
                          }}
                        >
                          <Field
                            component={TextField}
                            label="Descripción del segmento de cliente"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name={`customerSegmentCNS.${index}.description`}
                            sx={{ gridColumn: "span 3" }}
                          />

                          <Field
                            component={TextField}
                            label="% del segmento de clientes"
                            type="number"
                            name={`customerSegmentCNS.${index}.percentage`}
                            sx={{ gridColumn: "span 1" }}
                          />

                          <Button
                            type="button"
                            sx={{
                              backgroundColor: palette.primary.main,
                              gridColumn: "span 2",
                              color: palette.background.alt,
                              "&:hover": { color: palette.primary.main },
                            }}
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            Eliminar segmento de cliente
                          </Button>
                        </Box>
                      ))}
                    <Button
                      type="button"
                      onClick={() => push({ description: "", percentage: "" })}
                      sx={{
                        m: "2rem 0rem",
                        p: "1rem",
                        gridColumn: "span 2",
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        "&:hover": { color: palette.primary.main },
                      }}
                    >
                      Añadir Segmento de cliente
                    </Button>
                  </>
                )}
              </FieldArray>
            </Box>
            <Box sx={{ gridColumn: "span 4" }}>
              <Box
                sx={{
                  gridColumn: "span 4",
                  textDecoration: "underline",
                  fontWeight: "bold",
                  marginBottom: "0",
                }}
              >
                Categorías de servicios
              </Box>
              <FieldArray name="serviciesCategories">
                {({ remove, push }) => (
                  <>
                    {values.serviciesCategories.length > 0 &&
                      values.serviciesCategories.map((_, index2) => (
                        <Box
                          key={index2}
                          display="grid"
                          gap="15px"
                          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                          sx={{
                            m: "1rem",
                            "& > div": {
                              gridColumn: isNonMobile ? undefined : "span 4",
                            },
                          }}
                        >
                          <Field
                            component={TextField}
                            label="Descripción del Servicio"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name={`serviciesCategories.${index2}.description`}
                            sx={{ gridColumn: "span 3" }}
                          />

                          <Field
                            component={TextField}
                            label="% de negocio del servicio"
                            type="number"
                            name={`serviciesCategories.${index2}.percentage`}
                            sx={{ gridColumn: "span 1" }}
                          />
                          <Field
                            component={TextField}
                            label="Tarifa del servicio"
                            type="number"
                            name={`serviciesCategories.${index2}.rate`}
                            sx={{ gridColumn: "span 2" }}
                          />
                          <Field
                            component={TextField}
                            label="% de crecimiento del servicio"
                            type="number"
                            name={`serviciesCategories.${index2}.growth`}
                            sx={{ gridColumn: "span 2" }}
                          />

                          <Button
                            type="button"
                            sx={{
                              backgroundColor: palette.primary.main,
                              gridColumn: "span 2",
                              color: palette.background.alt,
                              "&:hover": { color: palette.primary.main },
                            }}
                            onClick={() => {
                              remove(index2);
                            }}
                          >
                            Eliminar Servicio
                          </Button>
                        </Box>
                      ))}
                    <Button
                      type="button"
                      onClick={() =>
                        push({
                          description: "",
                          percentage: "",
                          rate: "",
                          growth: "",
                        })
                      }
                      sx={{
                        m: "2rem 0rem",
                        p: "1rem",
                        gridColumn: "span 2",
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        "&:hover": { color: palette.primary.main },
                      }}
                    >
                      Añadir Servicio
                    </Button>
                  </>
                )}
              </FieldArray>
            </Box>
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

export default CNS1Company;
