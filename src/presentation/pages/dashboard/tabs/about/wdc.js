import { ArrowBackIosNew, Edit } from "@mui/icons-material";
import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import MUIRichTextEditor from "mui-rte";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const WDC = () => {
  const { wdcData } = useSelector((state) => state.wdc);
  const history = useHistory();

  return (
    <div>
      <Container>
        <Button
          onClick={() => history.goBack()}
          startIcon={<ArrowBackIosNew />}
        >
          Back
        </Button>
        <br />
        <br />

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" gutterBottom>
            WORLD DEVELOPMENT COMMITTEE (WDC)
          </Typography>
          <IconButton
            onClick={() =>
              history.push({
                pathname: "/dashboard/about/wdc/edit",
                state: {
                  title: wdcData?.title,
                  body: wdcData?.body,
                },
              })
            }
          >
            <Edit />
          </IconButton>
        </Box>
        <Divider />
        <br />
        <Grid container spacing={2}>
          <Grid item sm={12} md={12}>
            <Box display="flex" flexDirection="column">
              {/* <img src={data?.image} alt="" /> */}
              <br />
            </Box>
          </Grid>

          <Grid item sm={12} md={12}>
            <Box display="flex" flexDirection="column">
              <Typography gutterBottom>{wdcData?.title}</Typography>
              <br />
              <MUIRichTextEditor
                readOnly
                inlineToolbar={false}
                defaultValue={wdcData?.body}
                toolbar={false}
              />
              <br />
            </Box>
          </Grid>
        </Grid>
        <br />
        <Divider />
        <br />
      </Container>
    </div>
  );
};

export default WDC;
