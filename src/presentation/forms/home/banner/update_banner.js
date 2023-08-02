import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import {
  db,
  ref,
  storage,
  doc,
  uploadBytesResumable,
  getDownloadURL,
  updateDoc,
} from "../../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";

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

const UpdateBannerForm = (props) => {
  const classes = useStyles();
  let { setOpen, id, title, img, description } = props;
  const [formValues, setFormValues] = React.useState({
    title: title,
    image: "",
    description: description,
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
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "home-banner/" + timeNow.getTime());
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
          const mRef = doc(db, "home-banner", "" + id);
          try {
            await updateDoc(mRef, {
              title: formValues.title,
              description: formValues.description,
              updatedAt: timeNow,
              image: downloadURL,
            });
            setOpen(false);
            setIsLoading(false);
            enqueueSnackbar(`Banner updated successfully`, {
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

  const updateBanner = async (e) => {
    setIsLoading(true);
    setFormValues({
      title: formValues.title ? formValues.title : title,
      description: formValues.description
        ? formValues.description
        : description,
    });

    if (!previewImage) {
      //No image is changed. So update all text
      const timeNow = new Date();
      try {
        const mRef = doc(db, "home-banner", "" + id);
        await updateDoc(mRef, {
          title: formValues.title,
          description: formValues.description,
          updatedAt: timeNow,
        });
        setOpen(false);
        setIsLoading(false);
        enqueueSnackbar(`Banner updated successfully`, {
          variant: "success",
        });
      } catch (error) {
        setIsLoading(false);
        enqueueSnackbar(`${error?.message}`, {
          variant: "error",
        });
      }
    } else {
      //Change on the featured image and all texts
      uploadNewImage();
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
      <ValidatorForm onSubmit={updateBanner}>
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
                src={previewImage ? previewImage : img}
                className={classes.image}
              />
            </div>
          </Grid>
        </Grid>

        <TextValidator
          className={classes.mb}
          id="title"
          label="Service title"
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
          errorMessages={["Service title is required"]}
        />
        <br />
        <TextValidator
          className={classes.mb}
          id="description"
          multiLine={true}
          rows={2}
          rowsMax={3}
          label="Banner description"
          placeholder="Type description here..."
          size="small"
          variant="outlined"
          value={formValues.description}
          onChange={handleChange}
          name="description"
          fullWidth
          validators={["required"]}
          errorMessages={["Banner description is required"]}
        />

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

export default UpdateBannerForm;
