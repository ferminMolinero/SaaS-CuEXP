import { useState } from "react";
import { Alert, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { Field, FieldArray, Formik, Form } from "formik";
import { TextField } from "formik-material-ui";
import { array, number, object, string } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useGetCompanyQuery } from "state/api";

/* members: [
      {
        name: String,
        position: String,
        monthlyCost: Number,
        numberOfPayments: Number,
        startedMonth: Number,
        anualGrowth: Number,
      },
    ],,*/

const membersBasicSchema = object().shape({
  members: array(
    object({
      name: string().required("Obligatorio"),
      position: string().required("Obligatorio"),
      monthlyCost: number()
        .required("Obligatorio")
        .min(1, "El mínimo valor es 1"),
      numberOfPayments: number().required("Obligatorio"),
      startedMonth: number()
        .required("Obligatorio")
        .min(0, "El mínimo valor es 0"),
      anualGrowth: number()
        .required("Obligatorio")
        .min(0, "El mínimo valor es 0"),
    })
  ).max(30, "Puedes añadir hasta 30 Miembros"),
});

const MembersForm = () => {
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const company = useSelector((state) => state.global.company);
  const user = useSelector((state) => state.global.user);
  const { data, isLoading } = useGetCompanyQuery(company);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const initialCompanyMembers = {
    members: data
      ? data.members
      : [
          {
            name: "",
            position: "",
            monthlyCost: "",
            numberOfPayments: "",
            startedMonth: "",
            anualGrowth: "",
          },
        ],
  };

  const updateCompanyMembers = async (values, onSubmitProps) => {
    //Esto debería cambairla por una llamada a las apis para que este más bonito:)
    const savedUserResponse = await fetch(
      "http://localhost:5001/inbound/updateCompanyMembers",
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
      await updateCompanyMembers(values, onSubmitProps);
      if (updateCompanyMembers) {
        setAlertContent("¡Se han actualizado los activos de su compañía!");
        setAlert(true);
      }
    }
    window.location.reload(false);
  };
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialCompanyMembers}
      enableReinitialize
      validationSchema={membersBasicSchema}
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
            <FieldArray name="members">
              {({ remove, push }) => (
                <>
                  {values.members.length > 0 &&
                    values.members.map((el, index) => (
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
                          label="Nombre"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`members.${index}.name`}
                        />

                        <Field
                          component={TextField}
                          label="Posición"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`members.${index}.position`}
                        />
                        <Field
                          component={TextField}
                          label="Coste mensual"
                          type="number"
                          name={`members.${index}.monthlyCost`}
                        />
                        <Field
                          component={TextField}
                          label="Número de pagos"
                          type="number"
                          name={`members.${index}.numberOfPayments`}
                        />
                        <Field
                          component={TextField}
                          label="Mes de inicio"
                          type="number"
                          name={`members.${index}.startedMonth`}
                        />
                        <Field
                          component={TextField}
                          label="Crecimiento anualizado %"
                          type="number"
                          name={`members.${index}.anualGrowth`}
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
                          Eliminar miembro
                        </Button>
                      </Box>
                    ))}
                  <Button
                    type="button"
                    onClick={() =>
                      push({
                        name: "",
                        position: "",
                        monthlyCost: "",
                        numberOfPayments: "",
                        startedMonth: "",
                        anualGrowth: "",
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
                    Añadir miembro
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

export default MembersForm;
