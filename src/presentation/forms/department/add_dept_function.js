import React from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import Button from "@mui/material/Button";
import { db, doc, setDoc } from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress, TextField } from "@mui/material";

const AddDeptFunctionForm = (props) => {
  let { setOpen, deptId } = props;
  const [formValues, setFormValues] = React.useState({
    text: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const addRecord = (e) => {
    const timeNow = new Date();
    setIsLoading(true);
    setDoc(doc(db, "dept-functions", `${timeNow.getTime()}`), {
      id: timeNow.getTime(),
      department: deptId,
      function: formValues.text,
    })
      .then((resp) => {
        setOpen(false);
        setIsLoading(false);
        enqueueSnackbar(`Department function added successfully`, {
          variant: "success",
        });
      })
      .catch((error) => {
        setIsLoading(false);
        enqueueSnackbar(`${error?.message || "Check your internet!"}`, {
          variant: "error",
        });
      });
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
        <TextField
          label="Function"
          multiline={true}
          // minRows={2}
          rows={3}
          size="small"
          variant="outlined"
          value={formValues.text}
          onChange={handleChange}
          name="text"
          fullWidth
          required
          placeholder="Add new function"
        />
        <br />

        <Button
          sx={{ mt: 2 }}
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

export default AddDeptFunctionForm;
