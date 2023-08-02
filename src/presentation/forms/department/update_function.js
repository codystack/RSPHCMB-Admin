import React from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { db, doc, updateDoc } from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress, TextField } from "@mui/material";

const useStyles = makeStyles(() => ({
  image: {
    margin: "0px auto 15px auto",
    width: 128,
    height: 100,
  },
  mb: {
    marginBottom: 10,
  },
}));

const UpdateFunctionForm = (props) => {
  const classes = useStyles();
  let { setOpen, id, func } = props;
  const [formValues, setFormValues] = React.useState({
    function: func,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateDepartment = async (e) => {
    setIsLoading(true);
    setFormValues({
      function: formValues.function ? formValues.function : func,
    });

    try {
      const mRef = doc(db, "dept-functions", "" + id);
      await updateDoc(mRef, {
        function: formValues.function,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Function updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(`${error?.message}`, {
        variant: "error",
      });
    }
  };

  return (
    <div>
      <Backdrop style={{ zIndex: 1200 }} open={isLoading}>
        {isLoading ? (
          <CircularProgress
            size={90}
            thickness={3.0}
            style={{ color: "white" }}
          />
        ) : (
          <div />
        )}
      </Backdrop>
      <ValidatorForm onSubmit={updateDepartment}>
        <TextField
          multiline
          minRows={2}
          className={classes.mb}
          label="Function"
          size="small"
          variant="outlined"
          value={
            formValues.function === " "
              ? func
              : !formValues.function
              ? ""
              : formValues.function
          }
          onChange={handleChange}
          name="function"
          fullWidth
          required
        />
        <br />
        <Button
          sx={{ mt: 2 }}
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update Function
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default UpdateFunctionForm;
