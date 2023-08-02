import { Add } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React from "react";

import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
// import { CardActionArea, Divider } from "@mui/material";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
// import DeleteDialog from "../../../../components/dialogs/custom-dialog";
// import Card from "@mui/material/Card";
// import CardMedia from "@mui/material/CardMedia";
// import IconButton from "@mui/material/IconButton";
// import { Edit } from "@mui/icons-material";
// import { Delete } from "@mui/icons-material";
import Box from "@mui/system/Box";
// import { db, doc, deleteDoc } from "../../../../../data/firebase";
// import { useSnackbar } from "notistack";
// import { useHistory } from "react-router-dom";
// import EditServiceForm from "../../../../forms/services/edit_service_form";
import CreateAdminForm from "../../../../forms/users/add_user";
import { useSelector } from "react-redux";
// import UsersTable from "../../../../components/misc/table/users_table";
import UsersTablePaginated from "../../../../components/misc/table/users_table_paginated";

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

const User = () => {
  const classes = useStyles();
  // const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const { userData } = useSelector((state) => state.user);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Add New User"
        handleClose={() => setOpen(false)}
        bodyComponent={<CreateAdminForm setOpen={setOpen} />}
      />

      <div className={classes.row}>
        <div className={classes.lhsRow}>
          <Typography variant="h6" color="blue" fontSize={21}>
            Users
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
            Add User
          </Button>
        </Box>
      </div>
      <br />
      <div>
        <UsersTablePaginated list={userData} />
      </div>

      {/* <div>
        {userData && (
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {userData?.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <UserCard item={item} />
              </Grid>
            ))}
          </Grid>
        )}
        {usersList?.length < 1 && (
          <div className={classes.main}>
            <div style={{ marginTop: "auto" }}>
              <CloudOffIcon fontSize="large" />
              <Typography>No records found</Typography>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default User;
