import { ArrowBackIosNew, Delete, Edit } from "@mui/icons-material";
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
import { useHistory, useLocation } from "react-router-dom";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { arrayRemove, db, doc, updateDoc } from "../../../../../data/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 256,
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  main: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    margin: "auto",
    minHeight: 275,
    minWidth: 320,
    alignItems: "center",
  },
  cardMedia: {
    height: 156,
    width: "100%",
  },
  subRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "end",
    alignItems: "center",
  },
  lhsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
  },
  avatar: {
    height: 36,
    width: 36,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    padding: 4,
  },
}));

const ServiceInfo = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  let { data, index, serviceId } = location.state;
  const { enqueueSnackbar } = useSnackbar();

  const deleteService = async () => {
    setOpen(false);
    const mRef = doc(db, "new_services", "" + serviceId);
    try {
      await updateDoc(mRef, {
        items: arrayRemove(data),
      });

      enqueueSnackbar(`Service deleted successfully`, {
        variant: "success",
      });
      history.goBack();
    } catch (error) {
      // console.log("ERR: Del: ", error);
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
        variant: "error",
      });
    }
  };

  const deleteBody = (
    <div>
      <Typography variant="body2" gutterBottom>
        {`Are you sure you want to delete ${data?.title} ?`}
      </Typography>
      <br />
      <div className={classes.subRow}>
        <Button
          size="small"
          variant="contained"
          style={{ marginRight: 4 }}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>

        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={deleteService}
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <CustomDialog
        open={open}
        title="Delete this item"
        handleClose={() => setOpen(false)}
        bodyComponent={deleteBody}
      />
      <Container>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            onClick={() => history.goBack()}
            startIcon={<ArrowBackIosNew />}
          >
            Back
          </Button>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {data?.title}
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="start"
            alignItems="center"
          >
            <IconButton
              onClick={() =>
                history.push({
                  pathname: "/dashboard/services/" + index + "/edit",
                  state: {
                    data: data,
                    serviceId: serviceId,
                  },
                })
              }
            >
              <Edit />
            </IconButton>
            <Button onClick={() => setOpen(true)} startIcon={<Delete />}>
              Delete
            </Button>
          </Box>
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
              <MUIRichTextEditor
                readOnly
                inlineToolbar={false}
                defaultValue={data?.body}
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

export default ServiceInfo;
