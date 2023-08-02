import { Add } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React from "react";

import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
import DeleteDialog from "../../../../components/dialogs/custom-dialog";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import { Edit } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { Grid } from "@mui/material";
import Box from "@mui/system/Box";
import { db, doc, deleteDoc } from "../../../../../data/firebase";
import { useSnackbar } from "notistack";
import CloudOffIcon from "@mui/icons-material/CloudOff";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UpdateService from "../../../../forms/services/update_service";
import AddService from "../../../../forms/services/add_service";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 256,
    width: "100%",
  },
  content: {
    padding: 5,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
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

const ItemCard = (props) => {
  const { item } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // const history = useHistory();
  const [mItems, setMItems] = React.useState([]);

  React.useEffect(() => {
    if (item) {
      let newArray = [];

      // Declare an empty object
      let uniqueObject = {};

      // Loop for the array elements
      for (let i in item?.items) {
        // Extract the title
        let objTitle = item?.items[i]?.title;

        // Use the title as the index
        uniqueObject[objTitle] = item?.items[i];
      }

      // Loop to push unique object into array
      for (var i in uniqueObject) {
        newArray.push(uniqueObject[i]);
      }

      let result = newArray.sort((a, b) => a.title.localeCompare(b.title));

      setMItems(result);
    }
  }, [item]);

  const deleteService = async () => {
    setOpenDelete(false);

    try {
      await deleteDoc(doc(db, "new_services", "" + item?.id));
      enqueueSnackbar(`Item deleted successfully`, {
        variant: "success",
      });
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
        title="Update Service Information"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <UpdateService
            setOpen={setOpen}
            title={item?.title}
            id={item?.id}
            image={item?.image}
            priority={item?.orderNo}
          />
        }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete Service"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <Card
        elevation={3}
        className={classes.root}
        sx={{
          backgroundImage: "url(" + item?.image + ")",
          backgroundRepeat: "no-repeat",
          backdropFilter: "blur(5)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className={classes.content}>
          <div className={classes.rowHeader}>
            <div className={classes.lhsRow}>
              <Typography
                fontSize={18}
                color="black"
                paddingLeft={1}
                textAlign="start"
                fontWeight="bold"
              >
                {item?.title?.length > 75
                  ? item?.orderNo + item?.title?.substring(0, 75) + "..."
                  : item?.orderNo + ". " + item?.title}
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

          <Box padding={1}>
            {mItems && (
              <Grid
                container
                spacing={{ xs: 0, md: 0 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {mItems?.map((elem, index) => (
                  <Grid item xs={12} sm={6} md={6} key={index}>
                    <Box
                      paddingX={2}
                      display="flex"
                      flexDirection="row"
                      justifyContent={"start"}
                      alignItems="normal"
                    >
                      <Box
                        mt={0.75}
                        bgcolor={"black"}
                        width={10}
                        height={10}
                        borderRadius={5}
                      />
                      <Link
                        to={{
                          pathname: "/dashboard/services/:" + index,
                          state: {
                            serviceId: item?.id,
                            data: elem,
                            index: index,
                          },
                        }}
                      >
                        <Typography gutterBottom paddingX={1} fontWeight="bold">
                          {elem?.title}
                        </Typography>
                      </Link>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </div>
      </Card>
    </>
  );
};

const NServices = () => {
  const classes = useStyles();
  // const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const { newServiceData } = useSelector((state) => state.service);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Add New Service"
        handleClose={() => setOpen(false)}
        bodyComponent={<AddService setOpen={setOpen} />}
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
        {newServiceData && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {newServiceData?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <ItemCard item={item} type="service" />
              </Grid>
            ))}
          </Grid>
        )}
        {newServiceData?.length < 1 && (
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

export default NServices;
