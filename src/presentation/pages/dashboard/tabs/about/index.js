import {
  Button,
  Card,
  CardContent,
  // CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 120,
  },
  image: {
    height: 144,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
  },
}));

const CardItem = (props) => {
  const classes = useStyles();
  const { title, excerpt, to } = props;
  const history = useHistory();

  return (
    <Card elevation={4} className={classes.root}>
      <CardContent>
        <Typography variant="h6" color="#18113C">
          {title}
        </Typography>
        <br />
        <div className={classes.row}>
          <div className={classes.column}>
            <Typography variant="body1" color="#18113C">
              {excerpt}
            </Typography>
          </div>
          <div>
            <Button
              size="small"
              variant="contained"
              onClick={() => history.push(to)}
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const About = () => {
  let list = [
    {
      title: "About RSPHCMB",
      desc: "Manage RSPHCMB",
      to: "/dashboard/about/rsphcmb",
    },
    {
      title: "Board of Trustees",
      desc: "Manage Board of Trustees",
      to: "/dashboard/about/bot",
    },
    {
      title: "Departments",
      desc: "Manage Departments",
      to: "/dashboard/about/departments",
    },
    {
      title: "Local Government Areas",
      desc: "Manage Rivers State LGAs data",
      to: "/dashboard/about/lga",
    },
    {
      title: "Health Centres",
      desc: "Manage Health Centres data",
      to: "/dashboard/about/health_centres",
    },
    {
      title: "WDC",
      desc: "Manage WDC data",
      to: "/dashboard/about/wdc",
    },
  ];

  return (
    <div>
      <Container>
        <Box display={"flex"} flexDirection="column">
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {list?.map((_, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <CardItem
                  image={list[index].image}
                  title={list[index].title}
                  excerpt={list[index].desc}
                  to={list[index].to}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default About;
