import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikConfig,
  FormikValues,
} from "formik";
import * as Yup from "yup";
import { Select, TextField } from "formik-material-ui";
import { Children, ReactElement, useState } from "react";

export interface TransactionFormProps {}

const sleep = () => new Promise((acc) => setTimeout(acc, 3000));
const categories = [
  "Grocery",
  "Health",
  "Bills",
  "Fees",
  "Rent",
  "Entertainment",
  "Repairing and Maintainence",
  "Fuel",
  "Other",
];

const TransactionForm: React.FC<TransactionFormProps> = () => {
  return (
    <Card style={{ marginTop: "100px" }}>
      <CardContent>
        <FormikStepper
          initialValues={{
            title: "",
            category: "",
            amount: 0,
            type: "",
            details: "",
          }}
          onSubmit={async (values) => {
            await sleep();
            console.log("values", values);
          }}
        >
          <FormikStep
            label="Enter Transaction Title and Type"
            validationSchema={Yup.object().shape({
              title: Yup.string()
                .min(5)
                .max(50, "Maxiumum 50 characters are allowed")
                .required(),
              category: Yup.string().oneOf(categories).required(),
            })}
          >
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="title"
                label="Transaction Title"
                variant="outlined"
                component={TextField}
              />
            </Box>
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="category"
                type="select"
                label="Transaction Type"
                variant="outlined"
                component={Select}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Field>
              <ErrorMessage name="category" />
            </Box>
          </FormikStep>
          <FormikStep
            label="Enter Transaction Amount and Type"
            validationSchema={Yup.object().shape({
              amount: Yup.number().min(1).required(),
              type: Yup.string().oneOf(["Income", "Expense"]).required(),
            })}
          >
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="amount"
                type="number"
                label="Transaction Amount"
                variant="outlined"
                component={TextField}
              />
            </Box>
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="type"
                type="select"
                label="Transaction Type"
                variant="outlined"
                component={Select}
              >
                <MenuItem value="Income">+ Income</MenuItem>
                <MenuItem value="Expense">- Expense</MenuItem>
              </Field>
              <ErrorMessage name="type" />
            </Box>
          </FormikStep>
          <FormikStep
            label="Enter Transaction Detail"
            validationSchema={Yup.object().shape({
              detail: Yup.string(),
            })}
          >
            <Box paddingBottom={2}>
              <Field
                fullWidth
                multiline
                name="detail"
                label="Transaction Details"
                variant="outlined"
                component={TextField}
              />
              <ErrorMessage name="detail" />
            </Box>
          </FormikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;

export interface IFormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {
  label: string;
}

export const FormikStep = ({ children }: IFormikStepProps) => {
  return <>{children}</>;
};

export const FormikStepper = ({
  children,
  ...props
}: FormikConfig<FormikValues>) => {
  const childrenArray = Children.toArray(
    children
  ) as ReactElement<IFormikStepProps>[];
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];
  const [completed, setCompleted] = useState(false);

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
        } else {
          setStep((s) => s + 1);
          helpers.setTouched({});
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step
                key={child.props.label}
                completed={step > index || completed}
              >
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {currentChild}
          <Grid container spacing={2}>
            {step > 0 ? (
              <Grid item>
                <Button
                  disabled={isSubmitting}
                  variant="outlined"
                  color="primary"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
              </Grid>
            ) : null}
            <Grid item>
              <Button
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? "Submitting" : isLastStep() ? "Submit" : "Next"}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
