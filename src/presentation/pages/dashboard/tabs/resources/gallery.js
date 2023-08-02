import { Add, Edit } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React from "react";

import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { CardActionArea, Divider } from "@mui/material";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
import DeleteDialog from "../../../../components/dialogs/custom-dialog";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import { Delete } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { db, doc, deleteDoc } from "../../../../../data/firebase";
import { useSnackbar } from "notistack";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import AddGalleryForm from "../../../../forms/gallery/add_gallery";
import UpdateGalleryForm from "../../../../forms/gallery/update_gallery";

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
  const { item } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const deleteService = async () => {
    setOpenDelete(false);
    // const fileRef = ref(storage, "gallery/" + item?.id);

    // deleteObject(fileRef)
    //   .then(async () => {
    // Images deleted now delete from firestore,
    try {
      await deleteDoc(doc(db, "gallery", "" + item?.id));
      enqueueSnackbar(`Item deleted successfully`, {
        variant: "success",
      });
    } catch (error) {
      // console.log("ERR: Del: ", error);
      enqueueSnackbar(`Item not deleted. Try again`, {
        variant: "error",
      });
    }
    // })
    // .catch((err) => {});
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
      <DeleteDialog
        open={openDelete}
        title="Delete Gallery Album"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <CustomDialog
        open={open}
        title="Update Gallery Album"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <UpdateGalleryForm
            setOpen={setOpen}
            title={item?.title}
            id={item?.id}
            image={item?.image}
          />
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
          <IconButton aria-label="edit" onClick={() => setOpen(true)}>
            <Edit />
          </IconButton>
        </div>
        <CardActionArea
          onClick={() =>
            history.push({
              pathname: "/dashboard/resources/gallery/" + item?.id,
              state: {
                title: item?.title,
                image: item?.res,
                date: item?.createdAt,
                id: item?.id,
                items: item?.items,
              },
            })
          }
        >
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
              {item?.title?.length > 75
                ? item?.title?.substring(0, 75) + "..."
                : item?.title}
            </Typography>
          </div>
        </CardActionArea>
      </Card>
    </>
  );
};

const Gallery = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { galleryData } = useSelector((state) => state.resources);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Add New Gallery Album"
        handleClose={() => setOpen(false)}
        bodyComponent={<AddGalleryForm setOpen={setOpen} />}
      />
      <div className={classes.row}>
        <div className={classes.lhsRow}>
          <Typography variant="h6" color="blue" fontSize={21}>
            GALLERY
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add Album
        </Button>
      </div>
      <br />
      <div>
        {galleryData && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {galleryData?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <ItemCard item={item} />
              </Grid>
            ))}
          </Grid>
        )}
        {galleryData?.length < 1 && (
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

export default Gallery;
