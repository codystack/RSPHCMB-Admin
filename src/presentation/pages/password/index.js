import { Box, Card } from "@mui/material";
import React from "react";
import image from "../../../assets/images/wave_bg.svg";
import PasswordForm from "../../forms/password";

const ForgotPassword = () => {
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
          <Box
            paddingY={8}
            paddingX={4}
            display="flex"
            flexDirection="column"
            justifyContent={"start"}
          >
            <PasswordForm />
            {/* <Typography
              gutterBottom
              fontSize={11}
              fontWeight="400"
              paddingBottom={4} 
              textAlign={"center"}
            >
              
            </Typography>
            <TextField variant="outlined" placeholder="Email" />
            <br />
            <br />
            <Box
              width={"100%"}
              display="flex"
              flexDirection={"row"}
              justifyContent="space-between"
              alignItems={"center"}
            >
              <Button variant="contained">Send Password Reset</Button>
            </Box> */}
          </Box>
        </Card>
      </div>
    </Box>
  );
};

export default ForgotPassword;
