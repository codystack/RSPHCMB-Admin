import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Button from "@mui/material/Button";
// import { db, doc } from "../../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";

const UpdateCommitteeForm = (props) => {
  let { setOpen } = props;
  const [formValues, setFormValues] = React.useState({
    name: "",
    designation: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const addRecord = async (e) => {
    // const mRef = doc(db, "lgas", "" + id);
    // list[index]
    try {
      //   await updateDoc(mRef, {
      //     committees: [list[index]:{
      //       name: formValues.name,
      //       designation: formValues.designation,
      //     },
      //   });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Committee updated successfully`, {
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
          label="Name"
          size="small"
          variant="outlined"
          value={formValues.name}
          onChange={handleChange}
          name="name"
          fullWidth
          validators={["required"]}
          errorMessages={["Name is required"]}
        />
        <br />

        <TextValidator
          label="Designation"
          size="small"
          variant="outlined"
          value={formValues.designation}
          onChange={handleChange}
          name="designation"
          fullWidth
          validators={["required"]}
          errorMessages={["Designation is required"]}
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

export default UpdateCommitteeForm;
