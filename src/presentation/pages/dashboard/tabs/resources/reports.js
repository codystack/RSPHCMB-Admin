import { Add } from "@mui/icons-material";
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
import { Edit } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { Grid } from "@mui/material";
import {
  onSnapshot,
  query,
  collection,
  db,
  doc,
  deleteDoc,
} from "../../../../../data/firebase";
import { useSnackbar } from "notistack";
import CloudOffIcon from "@mui/icons-material/CloudOff";
// import { useHistory } from "react-router-dom";
// import AddDownloadForm from "../../../../forms/downloads/add_downloads";
// import UpdateDownloadForm from "../../../../forms/downloads/update_downloads";
import UpdateReportForm from "../../../../forms/reports/update_report";
import AddReportForm from "../../../../forms/reports/add_report";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 300,
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
  // const history = useHistory();

  const deleteService = async () => {
    setOpenDelete(false);
    // const fileRef = ref(storage, "reports/" + item?.id);

    // deleteObject(fileRef)
    //   .then(async () => {
    // Images deleted now delete from firestore,
    try {
      await deleteDoc(doc(db, "reports", "" + item?.id));
      enqueueSnackbar(`Item deleted successfully`, {
        variant: "success",
      });
    } catch (error) {
      console.log("ERR: Del: ", error);
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
      <CustomDialog
        open={open}
        title="Update Reports"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <UpdateReportForm
            id={item?.id}
            image={item?.res}
            title={item?.title}
            content={item?.body}
            setOpen={setOpen}
          />
        }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete Report"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <Card elevation={3} className={classes.root}>
        <div className={classes.rowHeader}>
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
        //   onClick={() =>
        //     history.push({
        //       pathname: "/dashboard/resources/reports/" + item?.id,
        //       state: {
        //         title: item?.title,
        //         image: item?.res,
        //         date: item?.createdAt,
        //         id: item?.id,
        //       },
        //     })
        //   }
        >
          <CardMedia image={item?.image} className={classes.cardMedia} />
          <Divider />
          <div className={classes.row}>
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
          </div>
        </CardActionArea>
      </Card>
    </>
  );
};

const Reports = () => {
  const classes = useStyles();
  // const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [reportsList, setReportsList] = React.useState(null);

  React.useEffect(() => {
    const q = query(collection(db, "reports"));
    onSnapshot(q, (querySnapshot) => {
      const reports = [];
      querySnapshot.forEach((doc) => {
        let dat = doc.data();
        reports?.push(dat);
      });
      setReportsList(reports);
    });
  }, []);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Add New Report"
        handleClose={() => setOpen(false)}
        bodyComponent={<AddReportForm setOpen={setOpen} />}
      />
      <div className={classes.row}>
        <div className={classes.lhsRow}>
          <Typography variant="h6" color="blue" fontSize={21}>
            REPORTS
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add Report
        </Button>
      </div>
      <br />
      <div>
        {reportsList && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {reportsList?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <ItemCard item={item} />
              </Grid>
            ))}
          </Grid>
        )}
        {reportsList?.length < 1 && (
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

export default Reports;
