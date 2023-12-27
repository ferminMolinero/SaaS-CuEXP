import { useState } from "react";
import { Alert, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { Field, FieldArray, Formik, Form } from "formik";
import { TextField } from "formik-material-ui";
import { array, number, object, string } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useGetCompanyQuery } from "state/api";

/*supplies: [
      {
        taxRate: Number,
        pricePerPayment: Number,
        numberOfPayments: Number,
        startedMonth: Number,
        anualGrowth: Number,
      },
    ],*/

const suppliesBasicSchema = object().shape({
  supplies: array(
    object({
      description: string().required("Obligatorio"),
      pricePerPayment: number()
        .required("Required")
        .min(0, "El mínimo valor es 0"),
      numberOfPayments: number()
        .required("Required")
        .min(1, "El mínimo valor es 1"),
      startMonth: number().required("Required"),
      annualRate: number().required("Required").min(0, "El mínimo valor es 0"),
      taxRate: number()
        .required("Required")
        .min(0, "Must be a positive number")
        .max(100, "Cannot be more than 100%"),
    })
  ).max(15, "Puedes añadir hasta 15 Suministros"),
});

const SuppliesForm = () => {
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const company = useSelector((state) => state.global.company);
  const user = useSelector((state) => state.global.user);
  const { data, isLoading } = useGetCompanyQuery(company);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const initialCompanySupplies = {
    supplies: data
      ? data.supplies
      : [
          {
            description: "",
            pricePerPayment: "",
            numberOfPayments: "",
            startMonth: "",
            annualRate: "",
            taxRate: "",
          },
        ],
  };

  const updateCompanySupplies = async (values, onSubmitProps) => {
    //Esto debería cambairla por una llamada a las apis para que este más bonito:)
    const savedUserResponse = await fetch(
      "http://localhost:5001/inbound/updateCompanySupplies",
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
      await updateCompanySupplies(values, onSubmitProps);
      if (updateCompanySupplies) {
        setAlertContent("¡Se han actualizado los activos de su compañía!");
        setAlert(true);
      }
    }
    window.location.reload(false);
  };
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialCompanySupplies}
      enableReinitialize
      validationSchema={suppliesBasicSchema}
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
            <FieldArray name="supplies">
              {({ remove, push }) => (
                <>
                  {values.supplies.length > 0 &&
                    values.supplies.map((el, index) => (
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
                          label="Descripción del suministro"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name={`supplies.${index}.description`}
                        />

                        <Field
                          component={TextField}
                          label="Precio por pago"
                          type="number"
                          name={`supplies.${index}.pricePerPayment`}
                        />
                        <Field
                          component={TextField}
                          label="Número de pagos"
                          type="number"
                          name={`supplies.${index}.numberOfPayments`}
                        />
                        <Field
                          component={TextField}
                          label="Mes de inicio"
                          type="number"
                          name={`supplies.${index}.startMonth`}
                        />
                        <Field
                          component={TextField}
                          label="Tasa de crecimiento anual %"
                          type="number"
                          name={`supplies.${index}.annualRate`}
                        />
                        <Field
                          component={TextField}
                          label="Impuestos %"
                          type="number"
                          name={`supplies.${index}.taxRate`}
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
                          Eliminar suministro
                        </Button>
                      </Box>
                    ))}
                  <Button
                    type="button"
                    onClick={() =>
                      push({
                        description: "",
                        pricePerPayment: "",
                        numberOfPayments: "",
                        startMonth: "",
                        annualRate: "",
                        taxRate: "",
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
                    Añadir suministro
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

export default SuppliesForm;
