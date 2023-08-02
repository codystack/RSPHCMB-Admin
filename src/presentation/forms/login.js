import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useHistory } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import CircularProgress from "@mui/material/CircularProgress";
import { RefreshOutlined } from "@mui/icons-material";

import { useDispatch } from "react-redux";
import { setMyData, setUserData } from "../../data/redux/slice/user";
import {
  db,
  doc,
  setPersistence,
  browserSessionPersistence,
  auth,
  onSnapshot,
} from "../../data/firebase";
import { signInUser } from "../../domain/service";
import image from "../../assets/images/logo.svg";

const LoginForm = () => {
  const history = useHistory();
  const [formValues, setFormValues] = React.useState({
    email: "",
    password: "",
  });
  const [showCode, setShowCode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitForm = async (e) => {
    setIsLoading(true);
    setPersistence(auth, browserSessionPersistence)
      .then((re) => {
        signInUser(formValues.email, formValues.password)
          .then(async (resp) => {
            //Now get user data
            onSnapshot(doc(db, "users", "" + resp?.user?.uid), (doc) => {
              // console.log("Current data: ", doc.data());
              // console.log("Current User ID: ", resp?.user?.uid);
              // dispatch(setUserID(resp?.user?.uid));
              dispatch(setMyData(doc.data()));
              dispatch(setUserData(doc.data()));
              history.push("/dashboard");
            });
          })
          .catch((err) => {
            console.log("LOGIN ERR: ", err);
          });
        //
      })
      .catch((error) => {
        // console.log("LOGIN CODE: ", error?.code);
      });
  };

  return (
    <div>
      <Box
        paddingTop={5}
        paddingBottom={8}
        paddingX={4}
        display="flex"
        flexDirection="column"
        justifyContent={"start"}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
          pb={1}
        >
          <img src={image} alt="" width={"60%"} />
        </Box>
        <Typography
          gutterBottom
          fontSize={18}
          fontWeight="600"
          paddingBottom={4}
          textAlign="center"
        >
          Sign into your account
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

          <TextValidator
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showCode ? "text" : "password"}
            id="password"
            onChange={handleChange}
            value={formValues.password}
            autoComplete="current-password"
            placeholder="Password"
            variant="outlined"
            validators={["required"]}
            errorMessages={["Password is required"]}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle code"
                    onClick={() => setShowCode(!showCode)}
                    onMouseDown={() => setShowCode(!showCode)}
                    edge="end"
                  >
                    {showCode ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <br />
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
              Sign in
            </Button>
          </Box>
        </ValidatorForm>
      </Box>
    </div>
  );
};

export default LoginForm;
