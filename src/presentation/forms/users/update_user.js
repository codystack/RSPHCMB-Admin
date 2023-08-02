import React from "react";
import {
  ValidatorForm,
  TextValidator,
  // SelectValidator,
} from "react-material-ui-form-validator";
// import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import {
  db,
  // ref,
  // storage,
  doc,
  // uploadBytesResumable,
  // getDownloadURL,
  // query,
  // collection,
  // onSnapshot,
  // deleteObject,
  updateDoc,
} from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
// import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
// import { Typography } from "@mui/material";
// import { Grid } from "@mui/material";
// import { MenuItem } from "@mui/material";
// import RichText from "../../components/misc/richtext";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 15px auto",
    width: 128,
    height: 100,
  },
  mb: {
    marginBottom: 10,
  },
}));

const UpdateUserForm = (props) => {
  const classes = useStyles();
  let { setOpen, id, firstname, lastname, phone, email, role } = props;
  const [formValues, setFormValues] = React.useState({
    firstname: firstname,
    lastname: lastname,
    phone: phone,
    email: email,
    role: role,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // const [isError, setIsError] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateService = async (e) => {
    setIsLoading(true);
    setFormValues({
      firstname: formValues.firstname ? formValues.firstname : firstname,
      lastname: formValues.lastname ? formValues.lastname : lastname,
      phone: formValues.phone ? formValues.phone : phone,
      email: formValues.email ? formValues.email : email,
      role: formValues.role ? formValues.role : role,
    });
    //No image is changed. So update all text
    // const timeNow = new Date();
    try {
      const mRef = doc(db, "user", "" + id);
      await updateDoc(mRef, {
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        phone: phone,
        email: email,
        role: role,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`User information updated successfully`, {
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
      <ValidatorForm onSubmit={updateService}>
        <TextValidator
          className={classes.mb}
          label="Firstname"
          size="small"
          variant="outlined"
          value={
            formValues.firstname === " "
              ? firstname
              : !formValues.firstname
              ? ""
              : formValues.firstname
          }
          onChange={handleChange}
          name="firstname"
          fullWidth
          validators={["required"]}
          errorMessages={["User's first name is required"]}
        />

        <br />
        <TextValidator
          className={classes.mb}
          label="Firstname"
          size="small"
          variant="outlined"
          value={
            formValues.lastname === " "
              ? lastname
              : !formValues.lastname
              ? ""
              : formValues.lastname
          }
          onChange={handleChange}
          name="lastname"
          fullWidth
          validators={["required"]}
          errorMessages={["User's last name is required"]}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update User
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default UpdateUserForm;
