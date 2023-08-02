import React from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemText,
  Fade,
  Backdrop,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomDialogEdit from "../dialogs/custom-dialog";
import CustomDialogDelete from "../dialogs/custom-dialog";
import { ValidatorForm } from "react-material-ui-form-validator";
import { TextValidator } from "react-material-ui-form-validator";
import { Box } from "@mui/system";
import { updateDoc, db, doc } from "../../../data/firebase";

//Facilities Table Action Button
const ActionButton2 = ({ selected, index, setIsPerforming, list, lgaID }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const openAction = Boolean(anchorEl);
  // const { enqueueSnackbar } = useSnackbar();
  //   const { notifications, userData } = useSelector((state) => state.user);
  const handleMoreAction = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMoreAction = () => setAnchorEl(null);

  // const { data: scholarData } = useSWR('/applicants/scholars/' + selected.row._id, APIService.authFetcher);

  return (
    <>
      <IconButton
        aria-label="actions"
        aria-controls="fade-menu"
        aria-haspopup="true"
        onClick={handleMoreAction}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={openAction}
        onClose={handleCloseMoreAction}
        TransitionComponent={Fade}
        elevation={1}
      >
        <MenuItem onClick={() => setOpenUpdate(true)}>
          <ListItemText primary="Edit" />
        </MenuItem>
        <CustomDialogEdit
          title={"Update " + selected?.name + "'s data "}
          bodyComponent={
            <UpdateView setOpen={setOpenUpdate} name={selected?.name} />
          }
          open={openUpdate}
          handleClose={() => setOpenUpdate(false)}
        />
        <MenuItem onClick={() => setOpenDelete(true)}>
          <ListItemText primary="Delete" />
        </MenuItem>
        <CustomDialogDelete
          title={"Delete " + selected?.name + "'s data "}
          bodyComponent={
            <DeleteView
              setOpen={setOpenDelete}
              name={selected?.name}
              id={index}
              lgaID={lgaID}
              list={list}
              index={index}
            />
          }
          open={openDelete}
          handleClose={() => setOpenDelete(false)}
        />
      </Menu>
    </>
  );
};

const UpdateView = (props) => {
  let { name } = props;

  const [formValues, setFormValues] = React.useState({
    name: name,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const submit = (e) => {
    setIsLoading(true);
  };

  return (
    <div>
      <Backdrop style={{ zIndex: 1200 }} open={isLoading}>
        {isLoading ? (
          <CircularProgress
            size={90}
            thickness={3.0}
            style={{ color: "white" }}
          />
        ) : (
          <div />
        )}
      </Backdrop>
      <ValidatorForm onSubmit={submit}>
        <TextValidator
          name="name"
          fullWidth
          placeholder="Name"
          label="Name"
          size="small"
          variant="outlined"
          value={formValues.name}
          onChange={handleChange}
        />

        <br />
        <Button variant="contained" type="submit" fullWidth>
          Update
        </Button>
      </ValidatorForm>
    </div>
  );
};

const DeleteView = (props) => {
  let { list, lgaID, name, index, setOpen } = props;

  const [isLoading, setLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const deleteRow = async () => {
    setLoading(true);
    const mRef = doc(db, "lgas", "" + lgaID);
    try {
      await updateDoc(mRef, {
        facilities: list?.filter((el, key) => key !== index),
      });
      setLoading(false);
      setOpen(false);
      enqueueSnackbar(`Row deleted successfully`, {
        variant: "success",
      });
    } catch (error) {
      // setIsLoading(false);
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
        variant: "error",
      });
    }
  };

  return (
    <div>
      <Typography gutterBottom>
        Are you sure you want to delete {name} from table?
      </Typography>
      <br />
      <Box
        display="flex"
        flexDirection={"row"}
        justifyContent="end"
        alignItems={"center"}
      >
        <Button
          variant="contained"
          color="error"
          sx={{ textTransform: "none", mx: 2 }}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>

        <Button
          disabled={isLoading}
          variant="contained"
          sx={{ textTransform: "none" }}
          onClick={deleteRow}
        >
          Delete
        </Button>
      </Box>
    </div>
  );
};

export default ActionButton2;
