import { Add, ArrowBackIosNew, Delete, Edit } from "@mui/icons-material";
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useSnackbar } from "notistack";
import { useHistory, useLocation } from "react-router-dom";
import CustomDialog from "../../../../../components/dialogs/custom-dialog";
import UpdateDialog from "../../../../../components/dialogs/custom-dialog";
import DeleteDialog from "../../../../../components/dialogs/custom-dialog";
// import AddFunctionForm from "../../../../../forms/department/add_function";
import {
  doc,
  db,
  deleteDoc,
  query,
  where,
  onSnapshot,
  collection,
} from "../../../../../../data/firebase";

import { useSelector } from "react-redux";
import UpdateFunctionForm from "../../../../../forms/department/update_function";
import AddDeptFunctionForm from "../../../../../forms/department/add_dept_function";

const Item = (props) => {
  let { setLoading, item, index } = props;

  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const deleteFunct = async (item) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "dept-functions", "" + item?.id));
      enqueueSnackbar(`Item deleted successfully`, {
        variant: "success",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("ERR: Del: ", error);
      enqueueSnackbar(`Item not deleted. Try again`, {
        variant: "error",
      });
    }
  };

  return (
    <div>
      <DeleteDialog
        open={open2}
        title="Delete Department Function"
        handleClose={() => setOpen2(false)}
        bodyComponent={
          <div>
            <Typography>
              Are you sure you want to delete this function?
            </Typography>
            <Box
              display="flex"
              flexDirction="row"
              justifyContent={"end"}
              alignItems="center"
            >
              <Button
                sx={{ mx: 1 }}
                variant="contained"
                onClick={() => setOpen2(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "red" }}
                onClick={() => deleteFunct(item)}
              >
                Delete
              </Button>
            </Box>
          </div>
        }
      />
      <UpdateDialog
        open={open3}
        title="Update Department Function"
        handleClose={() => setOpen3(false)}
        bodyComponent={
          <UpdateFunctionForm
            func={item?.function}
            id={item?.id}
            setOpen={setOpen3}
          />
        }
      />
      <Box
        py={1}
        display={"flex"}
        flexDirection="row"
        justifyContent={"start"}
        alignItems="center"
      >
        <Typography pr={2}>{index + 1}.</Typography>
        <Box
          display={"flex"}
          flexDirection="row"
          justifyContent={"start"}
          alignItems="center"
        >
          <Typography pl={2} flex={1}>
            {item?.function}
          </Typography>
          <IconButton onClick={() => setOpen2(true)}>
            <Delete />
          </IconButton>

          <IconButton onClick={() => setOpen3(true)}>
            <Edit />
          </IconButton>
        </Box>
      </Box>
      <Divider />
    </div>
  );
};

const DepartmentInfo = () => {
  const history = useHistory();
  const location = useLocation();

  const [open, setOpen] = React.useState(false);
  const [functions, setFunctions] = React.useState();
  const [isLoading, setLoading] = React.useState(false);

  const { deptFunctions } = useSelector((state) => state.departments);

  React.useEffect(() => {
    // const res = deptFunctions?.filter(
    //   (el) => el?.departments === location?.state?.id
    // );
    // setFunctions(res);

    const q = query(
      collection(db, "dept-functions"),
      where("department", "==", location.state?.id)
    );
    onSnapshot(q, (querySnapshot) => {
      const fn = [];
      querySnapshot.forEach((doc) => {
        fn.push(doc.data());
      });
      setFunctions(fn);
      // dispatch(setDeptFunctions(fn));
    });
  }, [deptFunctions, functions, location.state?.id]);

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
      <CustomDialog
        open={open}
        title="Add Department Function"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <AddDeptFunctionForm deptId={location?.state?.id} setOpen={setOpen} />
        }
      />

      <Container>
        <Box
          py={2}
          display="flex"
          flexDirction="row"
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Button
            startIcon={<ArrowBackIosNew />}
            variant="text"
            onClick={() => history.goBack()}
          >
            Back
          </Button>
        </Box>
        <Typography variant="h5" gutterBottom={true}>
          {location.state?.title}{" "}
        </Typography>
        <Typography gutterBottom={true}>
          {location.state?.description}{" "}
        </Typography>
        <br />
        <Divider />
        <br />
        <Box
          display={"flex"}
          flexDirection="row"
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Typography variant="h6">Functions of Department</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Add Function
          </Button>
        </Box>
        <Typography
          gutterBottom
          hidden={(location?.state?.functions || functions)?.length < 1}
        >
          Below are the roles/functions of the department
        </Typography>
        <br />
        {functions?.map((item, index) => (
          <Container key={index}>
            <Item setLoading={setLoading} item={item} index={index} />
          </Container>
        ))}
        {functions?.length < 1 && (
          <Box
            padding={10}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems={"center"}
          >
            <Typography>No records found</Typography>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default DepartmentInfo;
