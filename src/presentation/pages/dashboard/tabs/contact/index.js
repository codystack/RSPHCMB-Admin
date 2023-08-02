import { Call, Email, LocationOn } from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { TextValidator } from "react-material-ui-form-validator";
import { ValidatorForm } from "react-material-ui-form-validator";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { updateDoc, db, doc } from "../../../../../data/firebase";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
import CustomDialog2 from "../../../../components/dialogs/custom-dialog";
import CustomDialog3 from "../../../../components/dialogs/custom-dialog";

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

const Contact = () => {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const { contactData } = useSelector((state) => state.contact);

  return (
    <div>
      <CustomDialog
        title="Update Contact Email Address"
        open={open}
        handleClose={() => setOpen(false)}
        bodyComponent={
          <UpdateEmail setOpen={setOpen} email={contactData?.email ?? ""} />
        }
      />
      <CustomDialog2
        title="Update Contact Phone Number"
        open={open2}
        handleClose={() => setOpen2(false)}
        bodyComponent={
          <UpdatePhone setOpen={setOpen2} phone={contactData?.phone ?? ""} />
        }
      />
      <CustomDialog3
        title="Update Contact Address"
        open={open3}
        handleClose={() => setOpen3(false)}
        bodyComponent={
          <UpdateAddress setOpen={setOpen3} address={contactData?.address} />
        }
      />
      <Container>
        <Box display="flex" flexDirection={"column"} width="75%">
          <Box
            paddingY={2}
            display="flex"
            flexDirection={"row"}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Avatar
              variant="circular"
              sx={{
                backgroundColor: "#18113C",
                width: 48,
                height: 48,
              }}
            >
              <Email fontSize="14" />
            </Avatar>
            <Typography>{contactData?.email}</Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Update
            </Button>
          </Box>
          <Divider />
          <Box
            paddingY={2}
            display="flex"
            flexDirection={"row"}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Avatar
              variant="circular"
              sx={{
                backgroundColor: "#18113C",
                width: 48,
                height: 48,
              }}
            >
              <Call fontSize="14" />
            </Avatar>
            <Typography>{contactData?.phone}</Typography>
            <Button variant="contained" onClick={() => setOpen2(true)}>
              Update
            </Button>
          </Box>
          <Divider />
          <Box
            paddingY={2}
            display="flex"
            flexDirection={"row"}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Avatar
              variant="circular"
              sx={{
                backgroundColor: "#18113C",
                width: 48,
                height: 48,
              }}
            >
              <LocationOn fontSize="14" />
            </Avatar>
            <Typography>{contactData?.address}</Typography>
            <Button variant="contained" onClick={() => setOpen3(true)}>
              Update
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

const UpdateEmail = (props) => {
  const classes = useStyles();
  let { setOpen, email } = props;
  const [formValues, setFormValues] = React.useState({
    email: email,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const update = async (e) => {
    setIsLoading(true);
    setFormValues({
      email: formValues.email ? formValues.email : email,
    });

    //No image is changed. So update all text
    const timeNow = new Date();
    try {
      const mRef = doc(db, "contact", "data");
      await updateDoc(mRef, {
        email: formValues.email,
        updatedAt: timeNow,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Email updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
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
      <ValidatorForm onSubmit={update}>
        <TextValidator
          className={classes.mb}
          label="email"
          size="small"
          variant="outlined"
          value={
            formValues.email === " "
              ? email
              : !formValues.email
              ? ""
              : formValues.email
          }
          onChange={handleChange}
          name="email"
          fullWidth
          type="email"
          validators={["required"]}
          errorMessages={["Email is required"]}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update Email Address
        </Button>
      </ValidatorForm>
    </div>
  );
};

const UpdatePhone = (props) => {
  const classes = useStyles();
  let { setOpen, phone } = props;
  const [formValues, setFormValues] = React.useState({
    phone: phone,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const update = async (e) => {
    setIsLoading(true);
    setFormValues({
      phone: formValues.phone ? formValues.phone : phone,
    });

    //No image is changed. So update all text
    const timeNow = new Date();
    try {
      const mRef = doc(db, "contact", "data");
      await updateDoc(mRef, {
        phone: formValues.phone,
        updatedAt: timeNow,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Phone number updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
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
      <ValidatorForm onSubmit={update}>
        <TextValidator
          className={classes.mb}
          label="Phone"
          size="small"
          variant="outlined"
          value={
            formValues.phone === " "
              ? phone
              : !formValues.phone
              ? ""
              : formValues.phone
          }
          onChange={handleChange}
          name="phone"
          fullWidth
          validators={["required"]}
          errorMessages={["Phone number is required"]}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update Phone Number
        </Button>
      </ValidatorForm>
    </div>
  );
};

const UpdateAddress = (props) => {
  const classes = useStyles();
  let { setOpen, address } = props;
  const [formValues, setFormValues] = React.useState({
    address: address,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const update = async (e) => {
    setIsLoading(true);
    setFormValues({
      address: formValues.address ? formValues.address : address,
    });

    //No image is changed. So update all text
    const timeNow = new Date();
    try {
      const mRef = doc(db, "contact", "data");
      await updateDoc(mRef, {
        address: formValues.address,
        updatedAt: timeNow,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Address updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
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
      <ValidatorForm onSubmit={update}>
        <TextValidator
          className={classes.mb}
          label="Address"
          size="small"
          variant="outlined"
          value={
            formValues.address === " "
              ? address
              : !formValues.address
              ? ""
              : formValues.address
          }
          onChange={handleChange}
          name="address"
          fullWidth
          required
          validators={["required"]}
          errorMessages={["Address is required"]}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update Address
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default Contact;
