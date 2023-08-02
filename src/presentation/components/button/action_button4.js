import React from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemText,
  Fade,
  // Backdrop,
  // CircularProgress,
  // Button,
  // Typography,
} from "@mui/material";
// import { useSnackbar } from "notistack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomDialogView from "../dialogs/custom-dialog";
// import CustomDialogEdit from "../dialogs/custom-dialog";
// import CustomDialogDelete from "../dialogs/custom-dialog";
// import { ValidatorForm } from "react-material-ui-form-validator";
// import { TextValidator } from "react-material-ui-form-validator";
// import { Box } from "@mui/system";
import Preview from "../preview";

const ActionButton4 = ({ selected, index }) => {
  //For enquiry.

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openView, setOpenView] = React.useState(false);

  const openAction = Boolean(anchorEl);
  //   const { enqueueSnackbar } = useSnackbar();
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
        <MenuItem onClick={() => setOpenView(true)}>
          <ListItemText primary="View" />
        </MenuItem>
        <CustomDialogView
          title={"Row Preview Information"}
          bodyComponent={<Preview type="enquiries" data={selected} />}
          open={openView}
          handleClose={() => setOpenView(false)}
        />
      </Menu>
    </>
  );
};

// const UpdateView = (props) => {
//   // let { setOpen, name } = props;

//   const [formValues, setFormValues] = React.useState({
//     name: name,
//   });
//   const [isLoading, setIsLoading] = React.useState(false);

//   const { enqueueSnackbar } = useSnackbar();

//   const handleChange = (e) => {
//     let { name, value } = e.target;
//     setFormValues((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const submit = (e) => {
//     setIsLoading(true);
//   };

//   return (
//     <div>
//       <Backdrop style={{ zIndex: 1200 }} open={isLoading}>
//         {isLoading ? (
//           <CircularProgress
//             size={90}
//             thickness={3.0}
//             style={{ color: "white" }}
//           />
//         ) : (
//           <div />
//         )}
//       </Backdrop>
//       <ValidatorForm onSubmit={submit}>
//         <TextValidator
//           name="name"
//           fullWidth
//           placeholder="Name"
//           label="Name"
//           size="small"
//           variant="outlined"
//           value={formValues.name}
//           onChange={handleChange}
//         />

//         <br />
//         <Button variant="contained" type="submit" fullWidth>
//           Update
//         </Button>
//       </ValidatorForm>
//     </div>
//   );
// };

// const DeleteView = (props) => {
//   let { name, id, setOpen } = props;

//   const handleDelete = () => {};

//   return (
//     <div>
//       <Typography gutterBottom>
//         Are you sure you want to delete {name} from table?
//       </Typography>
//       <br />
//       <Box
//         display="flex"
//         flexDirection={"row"}
//         justifyContent="end"
//         alignItems={"center"}
//       >
//         <Button
//           variant="contained"
//           color="error"
//           sx={{ textTransform: "none", mx: 2 }}
//           onClick={() => setOpen(false)}
//         >
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           sx={{ textTransform: "none" }}
//           onClick={handleDelete}
//         >
//           Delete
//         </Button>
//       </Box>
//     </div>
//   );
// };

export default ActionButton4;
