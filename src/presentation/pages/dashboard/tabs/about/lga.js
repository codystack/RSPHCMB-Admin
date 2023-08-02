import { Button, Container, Grid, Typography } from "@mui/material";
import React from "react";
// import { makeStyles } from "@mui/styles";
// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { lgaList } from "../../../../../util/lga";
import { Link, useHistory } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     backgroundColor: "#00B0EF",
//   },
//   header: {
//     height: "84vh",
//     backgroundRepeat: "no-repeat",
//     backgroundSize: "cover",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   rowEnd: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "end",
//     alignItems: "end",
//   },
// }));

const LGAs = () => {
  // const classes = useStyles();
  const history = useHistory();

  // let fontSize, mt, deviceType;
  // const theme = useTheme();
  // const xs = useMediaQuery(theme.breakpoints.only("xs"));
  // const sm = useMediaQuery(theme.breakpoints.only("sm"));

  // if (xs) {
  //   fontSize = 30;
  //   mt = 200;
  //   deviceType = "phone";
  // } else if (sm) {
  //   fontSize = 42;
  //   mt = 400;
  //   deviceType = "tablet";
  // } else {
  //   mt = 125;
  //   fontSize = 48;
  // }

  return (
    <div>
      <Container
        sx={{
          paddingX: 4,
        }}
      >
        <Button
          startIcon={<ArrowBackIosNew />}
          onClick={() => history.goBack()}
        >
          Back
        </Button>
        <Grid container spacing={2}>
          {lgaList?.map((elem, index) => (
            <Grid
              item
              xs={6}
              sm={6}
              md={4}
              key={index}
              display="flex"
              flexDirection="column"
              justifyContent="start"
            >
              <Typography
                variant="h6"
                fontWeight="700"
                paddingTop={2}
              >{`${elem.alphabet}`}</Typography>
              {elem?.item?.map((el, i) => (
                <Link
                  key={i}
                  to={{
                    pathname: "/dashboard/about/lga/" + el.name,
                    state: { title: el.name },
                  }}
                  style={{ textDecoration: "none" }}
                >{`${el.name}`}</Link>
              ))}
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default LGAs;
