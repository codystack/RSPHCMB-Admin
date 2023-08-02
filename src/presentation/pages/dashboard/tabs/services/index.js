import { Add } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React from "react";

import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { CardActionArea, Divider } from "@mui/material";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
import CustomDialog2 from "../../../../components/dialogs/custom-dialog";
import DeleteDialog from "../../../../components/dialogs/custom-dialog";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import { Edit } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { Grid } from "@mui/material";
import Box from "@mui/system/Box";
import {
  onSnapshot,
  query,
  collection,
  db,
  doc,
  deleteDoc,
} from "../../../../../data/firebase";
import { useSnackbar } from "notistack";
import NewServiceForm from "../../../../forms/services/new_service_form";
import CloudOffIcon from "@mui/icons-material/CloudOff";

import MUIRichTextEditor from "mui-rte";
import EditServiceForm from "../../../../forms/services/edit_service_form";
import FeaturedServiceForm from "../../../../forms/services/set_featured_service";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 320,
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

const ServiceItemCard = (props) => {
  const { item, type } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // const history = useHistory();

  const deleteService = async () => {
    setOpenDelete(false);

    try {
      await deleteDoc(
        doc(
          db,
          type === "featured" ? "services-featured" : "services",
          "" + item?.id
        )
      );
      enqueueSnackbar(`Item deleted successfully`, {
        variant: "success",
      });
    } catch (error) {
      // console.log("ERR: Del: ", error);
      enqueueSnackbar(`Item not deleted. Try again`, {
        variant: "error",
      });
    }
  };

  const deleteBody = (
    <div>
      <Typography variant="body2" gutterBottom>
        {`Are you sure you want to delete ${item?.title} ?`}
      </Typography>
      <br />
      <div className={classes.subRow}>
        <Button
          size="small"
          variant="contained"
          style={{ marginRight: 4 }}
          onClick={() => setOpenDelete(false)}
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
    <>
      <CustomDialog
        open={open}
        title="Update Service"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <EditServiceForm
            setOpen={setOpen}
            img={item?.image}
            title={item?.title}
            id={item?.id}
            body={item?.body}
            summary={item?.summary}
            type={type}
          />
        }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete Service"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <Card elevation={3} className={classes.root}>
        <div className={classes.rowHeader}>
          <div className={classes.lhsRow}>
            <Typography variant="body2" fontSize={14}>
              {item?.title}
            </Typography>
          </div>
          <div className={classes.subRow}>
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => setOpen(true)}
            >
              <Edit />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => setOpenDelete(true)}
            >
              <Delete />
            </IconButton>
          </div>
        </div>
        <CardActionArea
        // onClick={() =>
        //   history.push({
        //     pathname: "/dashboard/service/" + item?.id,
        //     state: {
        //       title: item?.title,
        //       image: item?.image,
        //       body: item?.body,
        //       summary: item?.summary,
        //       date: item?.createdAt,
        //       id: item?.id,
        //     },
        //   })
        // }
        >
          <CardMedia image={item?.image} className={classes.cardMedia} />
          <Divider />
          {/* <div className={classes.row}>
            <Typography
              fontSize={16}
              color="black"
              paddingLeft={1}
              textAlign="start"
              fontWeight="bold"
            >
              {item?.title?.length > 75
                ? item?.title?.substring(0, 75) + "..."
                : item?.title}
            </Typography>
          </div> */}
          {type === "featured" ? (
            <Box paddingX={2}>
              <MUIRichTextEditor
                readOnly
                inlineToolbar={false}
                style={{ width: "100%", textAlign: "center" }}
                defaultValue={item?.body}
                toolbar={false}
              />
            </Box>
          ) : (
            <Typography
              justifyContent="stretch"
              textAlign="left"
              gutterBottom
              fontSize={12}
              color="black"
              paddingLeft={1}
              paddingBottom={1}
            >
              {item?.summary}
            </Typography>
          )}
        </CardActionArea>
      </Card>
    </>
  );
};

const Services = () => {
  const classes = useStyles();
  // const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [serviceList, setServiceList] = React.useState(null);
  const [featured, setFeatured] = React.useState(null);

  React.useEffect(() => {
    const q = query(collection(db, "services"));
    onSnapshot(q, (querySnapshot) => {
      const service = [];
      querySnapshot.forEach((doc) => {
        let dat = doc.data();
        service?.push(dat);
      });
      setServiceList(service);
    });

    onSnapshot(doc(db, "featured", "service"), (doc) => {
      // console.log("Current data: ", doc.data());
      setFeatured(doc.data());
      // dispatch(setPermSecData(doc.data()));
    });
  }, []);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Add New Service"
        handleClose={() => setOpen(false)}
        bodyComponent={<NewServiceForm setOpen={setOpen} />}
      />
      <CustomDialog2
        open={open2}
        title="Set Featured Service"
        handleClose={() => setOpen2(false)}
        bodyComponent={<FeaturedServiceForm setOpen={setOpen2} />}
      />
      <div className={classes.row}>
        <div className={classes.lhsRow}>
          <Typography variant="h6" color="blue" fontSize={21}>
            Services
          </Typography>
        </div>
        <Box
          display={"flex"}
          flexDirection="row"
          justifyContent="end"
          alignItems={"center"}
        >
          <Button
            sx={{ mx: 2 }}
            startIcon={<Add />}
            color="primary"
            variant="contained"
            onClick={() => setOpen2(true)}
          >
            Featured Service
          </Button>
          <Button
            startIcon={<Add />}
            color="primary"
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Add Service
          </Button>
        </Box>
      </div>
      <br />
      <div>
        <div>
          <Typography variant="h6" gutterBottom>
            Featured Service
          </Typography>
          <ServiceItemCard item={featured} type={"featured"} />
        </div>
        <br />
        <br />
        <Typography variant="h6" gutterBottom>
          Services
        </Typography>
        {serviceList && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {serviceList?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <ServiceItemCard item={item} type="service" />
              </Grid>
            ))}
          </Grid>
        )}
        {serviceList?.length < 1 && (
          <div className={classes.main}>
            <div style={{ marginTop: "auto" }}>
              <CloudOffIcon fontSize="large" />
              <Typography>No records found</Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
