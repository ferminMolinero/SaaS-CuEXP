import { useState } from "react";
import { Alert, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { Field, FieldArray, Formik, Form } from "formik";
import { TextField } from "formik-material-ui";
import { array, number, object, string } from "yup";
import { useDispatch, useSelector } from "react-redux";
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

const assetsBasicSchema = object({
  asset: array(
    object({
      description: string().required("Añade la descripción del activo"),
      appraisalValue: number().required("Añade un valor de tasación"),
      realValue: number().required("Añade un valor incluyendo el IVA"),
      firstMonth: number().required("Añade el mes de inicio"),
      ROIterm: number().required(
        "Añade el número de meses en los que se amorizará"
      ),
    })
  ).max(15, "Puedes añadir hasta 15 activos"),
});

//Setup the initials values

const FormAssets = () => {
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

  /*const initialCompanyAssets = {
    assets: [
      {
        description: "",
        appraisalValue: "",
        realValue: "",
        firstMonth: "",
        ROIterm: "",
      },
    ],
  };*/

  const initialCompanyAssets = {
    assets: data
      ? data.nonCurrentAssets
      : [
          {
            description: "",
            appraisalValue: "",
            realValue: "",
            firstMonth: "",
            ROIterm: "",
          },
        ],
  };

  //Esta sería la función con la que guardaría los datos.
  const updateCompanyAssets = async (values, onSubmitProps) => {
    //Esto debería cambairla por una llamada a las apis para que este más bonito:)
    const savedUserResponse = await fetch(
      "http://localhost:5001/inbound/updateCompanyAssets",
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
      await updateCompanyAssets(values, onSubmitProps);
      if (updateCompanyAssets) {
        setAlertContent("¡Se han actualizado los activos de su compañía!");
        setAlert(true);
      }
    }
    window.location.reload(false);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialCompanyAssets}
      enableReinitialize
      validationSchema={assetsBasicSchema}
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
            <FieldArray name="assets">
              {({ remove, push }) => (
                <>
                  {values.assets.length > 0 &&
                    values.assets.map((el, index) => (
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
                          label="Descripción del activo"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`assets.${index}.description`}
                        />

                        <Field
                          component={TextField}
                          label="Valor de tasación"
                          type="number"
                          name={`assets.${index}.appraisalValue`}
                        />
                        <Field
                          component={TextField}
                          label="Valor (IVA inc.)"
                          type="number"
                          name={`assets.${index}.realValue`}
                        />
                        <Field
                          component={TextField}
                          label="Mes de adquisición"
                          type="number"
                          name={`assets.${index}.firstMonth`}
                        />
                        <Field
                          component={TextField}
                          label="Meses de amortización"
                          type="number"
                          name={`assets.${index}.ROIterm`}
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

export default FormAssets;
