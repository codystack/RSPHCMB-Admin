import { Add, ArrowBackIos, Delete } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
import DeleteDialog from "../../../../components/dialogs/custom-dialog";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";

import CloudOffIcon from "@mui/icons-material/CloudOff";
import { db, doc, deleteDoc, onSnapshot } from "../../../../../data/firebase";
import AddSubAlbumForm from "../../../../forms/gallery/add_sub_album";
import UpdateSubAlbumForm from "../../../../forms/gallery/update_sub_album";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 286,
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

const ItemCard = (props) => {
  const { item, index, list } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const deleteService = async () => {
    setOpenDelete(false);
    try {
      await deleteDoc(doc(db, "gallery", "" + item?.id));
      enqueueSnackbar(`Item deleted successfully`, {
        variant: "success",
      });
    } catch (error) {
      console.log("ERR: Del: ", error);
      enqueueSnackbar(`Item not deleted. Try again`, {
        variant: "error",
      });
    }
  };

  const deleteBody = (
    <div>
      <Typography variant="body2" gutterBottom>
        {`Are you sure you want to delete this item?`}
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
      <DeleteDialog
        open={openDelete}
        title="Delete Gallery Album"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <CustomDialog
        open={open}
        title="Update Gallery Items"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <UpdateSubAlbumForm setOpen={setOpen} id={index} list={list} />
        }
      />
      <Card elevation={3} className={classes.root}>
        <div className={classes.rowHeader}>
          <div className={classes.subRow}>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => setOpenDelete(true)}
            >
              <Delete />
            </IconButton>
          </div>
          {/* <IconButton aria-label="edit" onClick={() => setOpen(true)}>
            <Edit />
          </IconButton> */}
        </div>
        <CardActionArea>
          <CardMedia image={item?.image} className={classes.cardMedia} />
          <Divider />
          <div className={classes.row}>
            <Typography
              pt={2}
              fontSize={16}
              color="black"
              paddingLeft={1}
              textAlign="start"
              fontWeight="bold"
            >
              {item?.desc?.length > 100
                ? item?.desc?.substring(0, 98) + "..."
                : item?.desc}
            </Typography>
          </div>
        </CardActionArea>
      </Card>
    </>
  );
};

const GalleryInfo = () => {
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    onSnapshot(doc(db, "gallery", "" + location?.state?.id), (doc) => {
      // console.log("Current data: ", doc.data());
      setItems(doc.data()?.items);
    });
  }, [items, location?.state?.id]);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Add New Album Item"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <AddSubAlbumForm
            setOpen={setOpen}
            list={location?.state?.items || items}
            id={location?.state?.id}
          />
        }
      />
      <div className={classes.row}>
        <div className={classes.lhsRow}>
          <Button
            variant="text"
            startIcon={<ArrowBackIos />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Typography variant="h6" color="blue" fontSize={21}>
            GALLERY ALBUM
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add Sub Album
        </Button>
      </div>
      <br />
      <div>
        {items && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {items?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <ItemCard item={item} index={index} list={items} />
              </Grid>
            ))}
          </Grid>
        )}
        {items?.length < 1 && (
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

export default GalleryInfo;
