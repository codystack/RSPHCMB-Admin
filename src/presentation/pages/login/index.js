import { Box, Card } from "@mui/material";
import React from "react";
import image from "../../../assets/images/wave_bg.svg";

import LoginForm from "../../forms/login";

const Login = () => {
  return (
    <Box
      height="100vh"
      width={"100vh"}
      display={"flex"}
      flexDirection="column"
      justifyContent={"center"}
      alignItems="center"
    >
      <div
        style={{
          width: "100vw",
          height: "99vh",
          backgroundImage: "url(" + image + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card style={{ margin: "auto", width: "26vw" }}>
          <LoginForm />
        </Card>
      </div>
    </Box>
  );
};

export default Login;
