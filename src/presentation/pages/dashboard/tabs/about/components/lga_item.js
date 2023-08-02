import { Add, ArrowBackIosNew, Edit } from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
// import MUIRichTextEditor from "mui-rte";
import React from "react";
import { TextValidator } from "react-material-ui-form-validator";
import { ValidatorForm } from "react-material-ui-form-validator";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import CommitteeTable from "../../../../../components/misc/table/comm_table";
import FacilitiesTable from "../../../../../components/misc/table/facility_table";
import {
  updateDoc,
  uploadBytesResumable,
  db,
  ref,
  doc,
  storage,
  getDownloadURL,
} from "../../../../../../data/firebase";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import CustomDialog from "../../../../../components/dialogs/custom-dialog";
import CustomDialog2 from "../../../../../components/dialogs/custom-dialog";
import CustomDialog3 from "../../../../../components/dialogs/custom-dialog";
import CustomDialog4 from "../../../../../components/dialogs/custom-dialog";
import NewCommitteeForm from "../../../../../forms/lga/committee/add_committee";
import NewFacilityForm from "../../../../../forms/lga/facilities/add_facility";

const LGAItem = () => {
  const history = useHistory();
  const location = useLocation();

  const { LGAsData } = useSelector((state) => state.lgas);
  // const [lgaFacilities, setLGAFacilities] = React.useState();
  const [lgaItem, setLGAItem] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);

  React.useEffect(() => {
    let faci = LGAsData?.filter((it) => it?.lga === location.state?.title);
    // setLGAFacilities(faci[0]?.facilities);
    setLGAItem(faci[0]);
    // console.log("Facility: ", faci);
  }, [LGAsData, location.state?.title]);

  return (
    <div>
      <CustomDialog
        title="Update Featured Image"
        open={open}
        handleClose={() => setOpen(false)}
        bodyComponent={
          <UpdateImage
            setOpen={setOpen}
            image={lgaItem?.image}
            id={lgaItem?.id}
          />
        }
      />
      <CustomDialog2
        title=" Update Background Information Text. "
        open={open2}
        handleClose={() => setOpen2(false)}
        bodyComponent={
          <UpdateTitle
            setOpen={setOpen2}
            title={lgaItem?.bg_info}
            id={lgaItem?.id}
          />
        }
      />
      <CustomDialog3
        title="Add New Committee Record"
        open={open3}
        handleClose={() => setOpen3(false)}
        bodyComponent={
          <NewCommitteeForm
            setOpen={setOpen3}
            id={lgaItem?.id}
            list={lgaItem?.committees}
          />
        }
      />
      <CustomDialog4
        title="Add New Facility Record"
        open={open4}
        handleClose={() => setOpen4(false)}
        bodyComponent={
          <NewFacilityForm
            setOpen={setOpen4}
            id={lgaItem?.id}
            list={lgaItem?.facilities}
          />
        }
      />
      <Container>
        <Button
          onClick={() => history.goBack()}
          startIcon={<ArrowBackIosNew />}
        >
          Back
        </Button>
        <br />
        <br />

        <Box
          display={"flex"}
          flexDirection="row"
          justifyContent={"end"}
          alignItems="center"
        >
          <Button startIcon={<Edit />} onClick={() => setOpen2(true)}>
            Edit
          </Button>
        </Box>
        <Divider />
        <br />
        <Grid container spacing={2}>
          <Grid item sm={6} md={5}>
            <Box display="flex" flexDirection="column">
              <img src={lgaItem?.image} alt="" width={"100%"} />
              <Button
                sx={{ mt: 1, textTransform: "none" }}
                variant="contained"
                onClick={() => setOpen(true)}
              >
                Update Image
              </Button>
              <br />
            </Box>
          </Grid>

          <Grid item sm={6} md={7}>
            <Box display="flex" flexDirection="column">
              <Typography gutterBottom>BACKGROUND INFORMATION</Typography>
              <Typography gutterBottom>{lgaItem?.bg_info}</Typography>
              <br />
              <br />
              <Typography gutterBottom>PHC TECHNICAL COMMITTEES</Typography>
              <Typography gutterBottom>{lgaItem?.comm_desc}</Typography>
              <br />
            </Box>
          </Grid>
        </Grid>

        <br />
        <br />
        <br />
        <Box
          display={"flex"}
          flexDirection="row"
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Typography gutterBottom>COMMITTEES</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen3(true)}
          >
            Add New
          </Button>
        </Box>
        <Divider />
        <br />
        <Box>
          <CommitteeTable list={lgaItem?.committees} id={lgaItem?.id} />
        </Box>

        <br />
        <br />
        <br />
        <br />
        <br />
        <Box
          display={"flex"}
          flexDirection="row"
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Typography gutterBottom>FACILITIES</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen4(true)}
          >
            Add New
          </Button>
        </Box>
        <Divider />
        <br />
        <Box>
          <FacilitiesTable list={lgaItem?.facilities} id={lgaItem?.id} />
        </Box>
      </Container>
    </div>
  );
};

const CircularProgressWithLabel = (props) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        {...props}
        size={90}
        thickness={3.0}
        style={{ color: "green" }}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="body1"
          component="div"
          style={{ color: "white", fontFamily: "roboto" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 15px auto",
    width: 128,
    height: 100,
  },
  mb: {
    marginBottom: 10,
  },
}));

const UpdateImage = (props) => {
  const classes = useStyles();
  let { image, setOpen, id } = props;
  const [formValues, setFormValues] = React.useState({
    image: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    if (id === "image") {
      setFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        image: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const uploadNewImage = () => {
    setIsUploading(true);
    // const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "lgas/" + id);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uprogress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uprogress);
      },
      (error) => {
        setIsUploading(false);
        // console.log(error);
        enqueueSnackbar(`${error?.message}`, { variant: "error" });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "lgas", "" + id);
          try {
            await updateDoc(mRef, {
              image: downloadURL,
            });
            setOpen(false);
            setIsLoading(false);
            enqueueSnackbar(`Image updated successfully`, {
              variant: "success",
            });
          } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(`${error?.message}`, {
              variant: "error",
            });
          }
        });
      }
    );
  };

  const updateImage = async (e) => {
    setIsLoading(true);
    uploadNewImage();
  };

  return (
    <div>
      <Backdrop style={{ zIndex: 1200 }} open={isUploading || isLoading}>
        {isUploading ? <CircularProgressWithLabel value={progress} /> : <div />}
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
      <ValidatorForm onSubmit={updateImage}>
        <Grid container spacing={1} padding={1}>
          <Grid item xs={12} sm={6} md={7}>
            <TextValidator
              id="image"
              size="small"
              variant="outlined"
              value={formValues.image}
              name="image"
              type="file"
              fullWidth
              disabled={isLoading}
              accept=".png, .jpg, .jpeg"
              onChange={handleChange}
              helperText="Featured image"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <div>
              <Avatar
                variant="rounded"
                alt="Passport"
                src={previewImage ? previewImage : image}
                className={classes.image}
              />
            </div>
          </Grid>
        </Grid>
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isUploading}
          fullWidth
        >
          Update
        </Button>
      </ValidatorForm>
    </div>
  );
};

const UpdateTitle = (props) => {
  const classes = useStyles();
  let { setOpen, title, id } = props;
  const [formValues, setFormValues] = React.useState({
    title: title,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateName = async (e) => {
    setIsLoading(true);
    setFormValues({
      title: formValues.title ? formValues.title : title,
    });

    try {
      const mRef = doc(db, "lgas", "" + id);
      await updateDoc(mRef, {
        bg_info: formValues.title,
      }).then(() => {
        setOpen(false);
        setIsLoading(false);
        enqueueSnackbar(`Updated successfully`, {
          variant: "success",
        });
      });
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
        variant: "error",
      });
    }
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
      <ValidatorForm onSubmit={updateName}>
        <TextField
          id="outlined-multiline-static"
          multiline
          label="Background Information"
          placeholder="Type here..."
          size="small"
          variant="outlined"
          value={
            formValues.title === " "
              ? title
              : !formValues.title
              ? ""
              : formValues.title
          }
          onChange={handleChange}
          name="title"
          rows={10}
          fullWidth
          required
          className={classes.mb}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update Bg Info
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default LGAItem;
