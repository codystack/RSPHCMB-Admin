import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useHistory } from "react-router-dom";

import CircularProgress from "@mui/material/CircularProgress";
import { RefreshOutlined } from "@mui/icons-material";

// import { useDispatch } from "react-redux";
// import { setMyData, setUserData } from "../../data/redux/slice/user";
import { auth, sendPasswordResetEmail } from "../../data/firebase";
// import { resetPassword } from "../../domain/service";
import image from "../../assets/images/logo.svg";
import { useSnackbar } from "notistack";

const PasswordForm = () => {
  const history = useHistory();
  const [formValues, setFormValues] = React.useState({
    email: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitForm = async (e) => {
    setIsLoading(true);

    sendPasswordResetEmail(auth, formValues.email)
      .then(() => {
        setIsLoading(false);
        enqueueSnackbar(`Password reset link sent to ${formValues.email}`, {
          variant: "success",
        });
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        setIsLoading(false);
        enqueueSnackbar(
          `${error?.message || "Check your internet connection!"}`,
          { variant: "error" }
        );
      });
  };

  return (
    <div>
      <Box
        paddingTop={5}
        paddingBottom={8}
        display="flex"
        flexDirection="column"
        justifyContent={"start"}
      >
        {/* <Typography
          gutterBottom
          fontSize={18}
          fontWeight="600"
          textAlign={"center"}
        >
          Forgot Password?
        </Typography> */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
          pb={1}
        >
          <img src={image} alt="" width={"64%"} />
        </Box>
        <Typography
          gutterBottom
          fontSize={14}
          fontWeight="600"
          paddingBottom={4}
          textAlign="center"
        >
          Enter your email to reset your password.
        </Typography>
        <ValidatorForm onSubmit={submitForm}>
          <TextValidator
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            autoComplete="email"
            label="Email"
            placeholder="Email"
            variant="outlined"
            validators={["required"]}
            errorMessages={["Email address is required"]}
          />

          <br />

          <Box
            width={"100%"}
            display="flex"
            flexDirection={"row"}
            justifyContent="space-between"
            alignItems={"center"}
          >
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => history.push("/forgot-password")}
            >
              Forgot password?
            </Button>
            <Button
              disabled={isLoading}
              disableElevation={true}
              sx={{ textTransform: "none" }}
              endIcon={
                isLoading && (
                  <CircularProgress>
                    <RefreshOutlined />
                  </CircularProgress>
                )
              }
              type="submit"
              variant="contained"
            >
              {" "}
              Send Now
            </Button>
          </Box>
        </ValidatorForm>
      </Box>
    </div>
  );
};

export default PasswordForm;
