import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Button from "@mui/material/Button";
import { db, doc, updateDoc } from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";

const AddFunctionForm = (props) => {
  let { setOpen, id, list } = props;
  const [formValues, setFormValues] = React.useState({
    text: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const addRecord = async (e) => {
    // const timeNow = new Date();
    setIsLoading(true);
    list = Object.assign([], list);
    list?.push({
      text: formValues.text,
    });
    const mRef = doc(db, "departments", "" + id);

    try {
      await updateDoc(mRef, {
        functions: [...list],
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Department function added successfully`, {
        variant: "success",
      });
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(`${error?.message || "Check your internet!"}`, {
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
      <ValidatorForm onSubmit={addRecord}>
        <TextValidator
          label="Text"
          size="small"
          variant="outlined"
          value={formValues.text}
          onChange={handleChange}
          name="text"
          fullWidth
          required
          validators={["required"]}
          errorMessages={["Text is required"]}
        />
        <br />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Save
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default AddFunctionForm;
