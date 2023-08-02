import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import {
  db,
  ref,
  storage,
  updateDoc,
  doc,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "../../../data/firebase";
// import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/system";
import { CircularProgress, Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 5px auto",
    width: 400,
    height: 300,
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

const UpdateDownloadForm = (props) => {
  const classes = useStyles();
  let { setOpen, id, image, title } = props;
  const [formValues, setFormValues] = React.useState({
    title: title,
    res: "",
    createdAt: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const [previewImage, setPreviewImage] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    if (id === "res") {
      setFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        res: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const uploadNewImage = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "downloads/" + timeNow.getTime());
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
        enqueueSnackbar(`${error.message}`, { variant: "error" });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "downloads", "" + id);
          try {
            await updateDoc(mRef, {
              title: formValues.title,
              updatedAt: timeNow,
              res: downloadURL,
            });
            setOpen(false);
            setIsLoading(false);
            enqueueSnackbar(`Downloads updated successfully`, {
              variant: "success",
            });
          } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(`${error?.message || "Check your internet"}`, {
              variant: "error",
            });
          }
        });
      }
    );
  };

  const updateDownloads = async (e) => {
    setIsLoading(true);
    setFormValues({
      title: formValues.title ? formValues.title : title,
    });

    if (!previewImage) {
      //No image is changed. So update all text
      const timeNow = new Date();
      try {
        const mRef = doc(db, "downloads", "" + id);
        await updateDoc(mRef, {
          title: formValues.title,
          updatedAt: timeNow,
        });
        setOpen(false);
        setIsLoading(false);
        enqueueSnackbar(`Downloads updated successfully`, {
          variant: "success",
        });
      } catch (error) {
        setIsLoading(false);
        enqueueSnackbar(`${error?.message || "Check your internet"}`, {
          variant: "error",
        });
      }
    } else {
      //Change on the featured image and all texts
      const fileRef = ref(storage, "downloads/" + id);

      deleteObject(fileRef)
        .then(() => {
          setIsLoading(false);
          uploadNewImage();
        })
        .catch((error) => {
          setIsLoading(false);
          //   console.log("ErR: ", error);
        });
    }
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
      <ValidatorForm onSubmit={updateDownloads}>
        <Grid container spacing={1} padding={1}>
          <Grid item xs={12} sm={6} md={7}>
            <TextValidator
              id="res"
              size="small"
              variant="outlined"
              value={formValues.res}
              name="res"
              type="file"
              fullWidth
              disabled={isLoading}
              accept=".png, .jpg, .jpeg, .pdf, .doc"
              onChange={handleChange}
              validators={["required"]}
              errorMessages={["Download resource is required"]}
              helperText="Download resource"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <div>
              {previewImage && (
                <Avatar
                  variant="rounded"
                  alt="Passport"
                  src={previewImage ? previewImage : image}
                  className={classes.image}
                />
              )}
            </div>
          </Grid>
        </Grid>

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
          required
          validators={["required"]}
          errorMessages={["Download title is required"]}
        />

        <br />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || isUploading}
          fullWidth
        >
          Save
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default UpdateDownloadForm;
