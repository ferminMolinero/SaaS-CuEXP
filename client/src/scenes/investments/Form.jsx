import { useState } from "react";
import { Alert, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { Field, FieldArray, Formik, Form } from "formik";
import { TextField } from "formik-material-ui";
import { array, number, object, string } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useGetCompanyQuery } from "state/api";

const investmentsBasicSchema = object({
  asset: array(
    object({
      description: string().required("Añade la descripción del activo"),
      appraisalValue: number().required("Añade un valor de tasación"),
      realValue: number().required("Añade un valor incluyendo el IVA"),
      firstMonth: number().required("Añade el mes de inicio"),
      months: number().required("Añade el plazo en meses de la inversión"),
    })
  ).max(15, "Puedes añadir hasta 15 inversiones"),
});

//Setup the initials values

const FormInvestments = () => {
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const company = useSelector((state) => state.global.company);
  const user = useSelector((state) => state.global.user);
  const { data, isLoading } = useGetCompanyQuery(company);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  /*const initialCompanyInvestments = {
    assets: [
      {
        description: "",
        appraisalValue: "",
        realValue: "",
        firstMonth: "",
        months: "",
      },
    ],
  };*/

  //Dejo estos mientras no consiga obtener de forma asyncrona los valores
  const initialCompanyInvestments = {
    investments: data
      ? data.nonCurrentInvestments
      : [
          {
            description: "",
            appraisalValue: "",
            realValue: "",
            firstMonth: "",
            months: "",
          },
        ],
  };

  //Esta sería la función con la que guardaría los datos.
  const updateCompanyInvestments = async (values, onSubmitProps) => {
    //Esto debería cambairla por una llamada a las apis para que este más bonito:)
    const savedUserResponse = await fetch(
      "http://localhost:5001/inbound/updateCompanyInvestments",
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
      await updateCompanyInvestments(values, onSubmitProps);
      if (updateCompanyInvestments) {
        setAlertContent("¡Se han actualizado los activos de su compañía!");
        setAlert(true);
      }
    }
    window.location.reload(false);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialCompanyInvestments}
      enableReinitialize
      validationSchema={investmentsBasicSchema}
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
          <Box sx={{ gridColumn: "span 4" }}>
            <FieldArray name="investments">
              {({ remove, push }) => (
                <>
                  {values.investments.length > 0 &&
                    values.investments.map((el, index) => (
                      <Box
                        key={index}
                        display="grid"
                        gap="15px"
                        gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                        sx={{
                          m: "1rem",
                          "& > div": {
                            gridColumn: isNonMobile ? undefined : "span 3",
                          },
                        }}
                      >
                        <Field
                          component={TextField}
                          label="Descripción de la inversión"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`investments.${index}.description`}
                        />

                        <Field
                          component={TextField}
                          label="Valor"
                          type="number"
                          name={`investments.${index}.appraisalValue`}
                        />
                        <Field
                          component={TextField}
                          label="Valor (IVA inc.)"
                          type="number"
                          name={`investments.${index}.realValue`}
                        />
                        <Field
                          component={TextField}
                          label="Mes de adquisición"
                          type="number"
                          name={`investments.${index}.firstMonth`}
                        />
                        <Field
                          component={TextField}
                          label="Plazos mensuales"
                          type="number"
                          name={`investments.${index}.months`}
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
                          Eliminar activo
                        </Button>
                      </Box>
                    ))}
                  <Button
                    type="button"
                    onClick={() =>
                      push({
                        description: "",
                        appraisalValue: "",
                        realValue: "",
                        firstMonth: "",
                        ROIterm: "",
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
                    Añadir Activo
                  </Button>
                </>
              )}
            </FieldArray>
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

export default FormInvestments;
