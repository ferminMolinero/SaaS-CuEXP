import { useState } from "react";
import { Alert, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { Field, FieldArray, Formik, Form } from "formik";
import { TextField } from "formik-material-ui";
import { array, number, object, string, ValidationError } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setCompany, setUserCompany } from "state";
import { useGetCompanyQuery } from "state/api";

//Datos a rellenar: name, description, promoters, yearOfCreation, yearOfAnalysis

const companyBasicSchema = object({
  name: string().required("Obligatorio"),
  description: string().required().min(1),
  yearOfCreation: number().required("Obligatorio"),
  yearOfAnalysis: number()
    .required("Obligatorio")
    .min(1)
    .max(10, "Actualmente podremos estimar hasta 10 años"),
  promoters: array(
    object({
      name: string().required("Añade un nombre al promotor"),
      percentage: number()
        .required("Añade un porcentaje al proveedor")
        .min(1, "El valor mínimo es 1")
        .max(100, "El valor máximo es 100"),
    })
  )
    .max(5, "Puedes añadir hasta 5 promotores")
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

//Setup the initials values

const FormCompany = () => {
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

  const initialCompanyBasicRegister = {
    name: data ? data.name : "",
    description: data ? data.description : "",
    promoters: data ? data.promoters : [{ name: "", percentage: "" }],
    yearOfCreation: data ? data.yearOfCreation : "",
    yearOfAnalysis: data ? data.yearOfAnalysis : "",
  };

  /*const initialCompanyBasicRegister = {
    name: "",
    description: "",
    promoters: [{ name: "", percentage: "" }],
    yearOfCreation: "",
    yearOfAnalysis: "",
  };*/
  //Esta sería la función con la que guardaría los datos.
  const updateCompanyBasic = async (values, onSubmitProps) => {
    //Esto debería cambairla por una llamada a las apis para que este más bonito:)
    const savedUserResponse = await fetch(
      "http://localhost:5001/inbound/updateCompanyBasic",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, company }),
      }
    );
    const savedCompany = await savedUserResponse.json();
    //Como el usuario acaba de crear o actualizar su empresa, debemos crearla o actualizarla en sus compañías
    const updateUserCompanies = await fetch(
      "http://localhost:5001/inbound/updateUserCompanies",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedCompany: savedCompany, user: user }),
      }
    );
    const userCompanyUpdated = await updateUserCompanies.json();
    onSubmitProps.resetForm();
  };

  const createCompanyBasic = async (values, onSubmitProps) => {
    //Esto debería cambairla por una llamada a las apis para que este más bonito:)
    const savedUserResponse = await fetch(
      "http://localhost:5001/inbound/createCompanyBasic",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const savedCompany = await savedUserResponse.json();
    const updateUserCompanies = await fetch(
      "http://localhost:5001/inbound/updateUserCompanies",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedCompany, user }),
      }
    );

    const userCompanyUpdated = await updateUserCompanies.json();
    onSubmitProps.resetForm();
    if (savedCompany) {
      dispatch(
        setCompany({
          company: savedCompany._id,
        })
      );
      dispatch(setUserCompany({ company: savedCompany._id }));
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (company) {
      await updateCompanyBasic(values, onSubmitProps);
      if (updateCompanyBasic) {
        setAlertContent("¡Se ha actualizado la compañía!");
        setAlert(true);
      }
    } else {
      await createCompanyBasic(values, onSubmitProps);
      setAlertContent("¡Se ha creado la nueva compañía!");
      setAlert(true);
    }
    window.location.reload(false);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialCompanyBasicRegister}
      enableReinitialize
      validationSchema={companyBasicSchema}
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
              label="Nombre de la empresa"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              name="name"
              error={Boolean(touched.name) && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              sx={{ gridColumn: "span 2" }}
            />

            <Field
              component={TextField}
              label="Breve descripción del negocio"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              name="description"
              error={
                Boolean(touched.description) && Boolean(errors.description)
              }
              helperText={touched.description && errors.description}
              sx={{ gridColumn: "span 4" }}
            />
            <Field
              component={TextField}
              label="Año de creación de la Empresa"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.yearOfCreation}
              name="yearOfCreation"
              error={
                Boolean(touched.yearOfCreation) &&
                Boolean(errors.yearOfCreation)
              }
              helperText={touched.yearOfCreation && errors.yearOfCreation}
              sx={{ gridColumn: "span 2" }}
            />
            <Field
              component={TextField}
              label="Años de proyección de la estimación"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.yearOfAnalysis}
              name="yearOfAnalysis"
              error={
                Boolean(touched.yearOfAnalysis) &&
                Boolean(errors.yearOfAnalysis)
              }
              helperText={touched.yearOfAnalysis && errors.yearOfAnalysis}
              sx={{ gridColumn: "span 2" }}
            />
            <Box sx={{ gridColumn: "span 4" }}>
              <FieldArray name="promoters">
                {({ remove, push }) => (
                  <>
                    {values.promoters.length > 0 &&
                      values.promoters.map((_, index) => (
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
                            label="Nombre del Promotor"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name={`promoters.${index}.name`}
                          />

                          <Field
                            component={TextField}
                            label="Porcentaje de Participación"
                            type="number"
                            name={`promoters.${index}.percentage`}
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
                            Eliminar promotor
                          </Button>
                        </Box>
                      ))}
                    <Button
                      type="button"
                      onClick={() => push({ name: "", percentage: "" })}
                      sx={{
                        m: "2rem 0rem",
                        p: "1rem",
                        gridColumn: "span 2",
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        "&:hover": { color: palette.primary.main },
                      }}
                    >
                      Añadir promotor
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

export default FormCompany;
