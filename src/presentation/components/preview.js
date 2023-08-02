import { Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const Preview = (props) => {
  let { type, data } = props;
  const [body, setBody] = React.useState(null);

  React.useLayoutEffect(() => {
    if (type === "user") {
      setBody(
        <Box display="flex" flexDirection={"column"} justifyContent="start">
          <Grid container spacing={2}>
            <Grid item sm={6} md={6}>
              <Typography>FIRSTNAME</Typography>
              <Typography variant="h6">{data?.firstname}</Typography>
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography>LASTNAME</Typography>
              <Typography variant="h6">{data?.lastname}</Typography>
            </Grid>
          </Grid>
          <br />
          <Divider />
          <br />
          <Grid container spacing={2}>
            <Grid item sm={6} md={6}>
              <Typography>EMAIL</Typography>
              <Typography variant="h6">{data?.email}</Typography>
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography>PHONE NUMBER</Typography>
              <Typography variant="h6">{data?.phone}</Typography>
            </Grid>
          </Grid>
          <br />
          <Divider />
          <br />
          <Grid container spacing={2}>
            <Grid item sm={6} md={6}>
              <Typography>ROLE</Typography>
              <Typography variant="h6">{data?.role}</Typography>
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography>CREATED ON</Typography>
              <Typography variant="h6">{data?.createdAt}</Typography>
            </Grid>
          </Grid>
        </Box>
      );
    } else if (type === "committee") {
      setBody(
        <Box display="flex" flexDirection={"column"} justifyContent="start">
          <Grid container spacing={2}>
            <Grid item sm={6} md={6}>
              <Typography>NAME</Typography>
              <Typography variant="h6">{data?.name}</Typography>
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography>DESIGNATION</Typography>
              <Typography variant="h6">{data?.designation}</Typography>
            </Grid>
          </Grid>
          <br />
          <Divider />
          <br />
          <Grid container spacing={2}>
            <Grid item sm={6} md={6}>
              <Typography>ADDED ON</Typography>
              <Typography variant="h6">{data?.createdAt}</Typography>
            </Grid>
          </Grid>
          <br />
          <Divider />
          <br />
        </Box>
      );
    } else if (type === "enquiries") {
      setBody(
        <Box display="flex" flexDirection={"column"} justifyContent="start">
          <Grid container spacing={2}>
            <Grid item sm={6} md={6}>
              <Typography>NAME</Typography>
              <Typography variant="h6">{data?.fullname}</Typography>
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography>EMAIL</Typography>
              <Typography variant="h6">{data?.email}</Typography>
            </Grid>
          </Grid>
          <br />
          <Divider />
          <br />
          <Grid container spacing={2}>
            <Grid item sm={6} md={6}>
              <Typography>PHONE NUMBER</Typography>
              <Typography variant="h6">{data?.phone}</Typography>
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography>SUBJECT</Typography>
              <Typography variant="h6">{data?.subject}</Typography>
            </Grid>
          </Grid>
          <br />
          <Typography>{data?.request}</Typography>
          <Divider />
          <br />
        </Box>
      );
    }
  }, [
    data?.createdAt,
    data?.designation,
    data?.email,
    data?.firstname,
    data?.fullname,
    data?.lastname,
    data?.name,
    data?.phone,
    data?.request,
    data?.role,
    data?.subject,
    type,
  ]);

  return body;
};

export default Preview;
