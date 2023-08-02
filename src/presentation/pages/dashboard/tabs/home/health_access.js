import { ArrowBackIosNew, Edit } from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { ValidatorForm } from "react-material-ui-form-validator";
import { TextValidator } from "react-material-ui-form-validator";
import {
  updateDoc,
  db,
  doc,
  ref,
  uploadBytesResumable,
  storage,
  getDownloadURL,
} from "../../../../../data/firebase";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
import CustomDialog2 from "../../../../components/dialogs/custom-dialog";
import CustomDialog3 from "../../../../components/dialogs/custom-dialog";

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

const HealthAccess = () => {
  const { healthAccess } = useSelector((state) => state.homepage);
  const history = useHistory();

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  return (
    <div>
      <CustomDialog
        title="Update Picture"
        open={open}
        handleClose={() => setOpen(false)}
        bodyComponent={
          <UpdateImage
            setOpen={setOpen}
            image={healthAccess?.image}
            id={"info"}
          />
        }
      />
      <CustomDialog2
        title="Update Title"
        open={open2}
        handleClose={() => setOpen2(false)}
        bodyComponent={
          <UpdateTitle
            setOpen={setOpen2}
            title={healthAccess?.title}
            id={"info"}
          />
        }
      />
      <CustomDialog3
        title="Update Description"
        open={open3}
        handleClose={() => setOpen3(false)}
        bodyComponent={
          <UpdateDescription
            setOpen={setOpen3}
            description={healthAccess?.description}
            id={"info"}
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
        <Grid container spacing={2}>
          <Grid item sm={6} md={5}>
            <Box display="flex" flexDirection="column">
              <img src={healthAccess?.image} alt="" width="100%" />
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
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">TITLE</Typography>
                <IconButton onClick={() => setOpen2(true)}>
                  <Edit />
                </IconButton>
              </Box>
              <Divider />
              <Typography>{healthAccess?.title}</Typography>
              <br />
              <br />
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">DESCRIPTION</Typography>
                <IconButton onClick={() => setOpen3(true)}>
                  <Edit />
                </IconButton>
              </Box>
              <Divider />
              <Typography>{healthAccess?.description}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

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
    const storageRef = ref(storage, "home/" + id);
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
          const mRef = doc(db, "home", "health-access");
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
            enqueueSnackbar(
              `${error?.message || "Check your internet connection"}`,
              {
                variant: "error",
              }
            );
          }
        });
      }
    );
  };

  const updateImage = async (e) => {
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
  let { setOpen, title } = props;
  const [formValues, setFormValues] = React.useState({
    title: title,
    image: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateTitle = async (e) => {
    setIsLoading(true);
    setFormValues({
      title: formValues.title ? formValues.title : title,
    });

    //No image is changed. So update all text
    const timeNow = new Date();
    try {
      const mRef = doc(db, "home", "health-access");
      await updateDoc(mRef, {
        title: formValues.title,
        updatedAt: timeNow,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Title updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(`${error?.message}`, {
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
      <ValidatorForm onSubmit={updateTitle}>
        <TextValidator
          className={classes.mb}
          id="title"
          label="Title"
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
          fullWidth
          validators={["required"]}
          errorMessages={["Title is required"]}
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update
        </Button>
      </ValidatorForm>
    </div>
  );
};

const UpdateDescription = (props) => {
  let { setOpen, description } = props;
  const [formValues, setFormValues] = React.useState({
    description: description,
    image: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const update = async (e) => {
    setIsLoading(true);
    setFormValues({
      description: formValues.description
        ? formValues.description
        : description,
    });

    //No image is changed. So update all text
    const timeNow = new Date();
    try {
      const mRef = doc(db, "home", "health-access");
      await updateDoc(mRef, {
        description: formValues.description,
        updatedAt: timeNow,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Description updated successfully`, {
        variant: "success",
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
      <ValidatorForm onSubmit={update}>
        <TextField
          id="outlined-multiline-static"
          label="Description"
          multiline
          name="description"
          rows={4}
          fullWidth
          required
          onChange={handleChange}
          value={formValues.description}
          sx={{ marginY: 2 }}
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Update
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default HealthAccess;
