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
  deleteObject,
  updateDoc,
} from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/system";
import { CircularProgress, TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import EditableRichText from "../../components/misc/richtext/editable";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 15px auto",
    width: 210,
    height: 200,
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

const VisionSection = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [formValues, setFormValues] = React.useState({
    vision: location?.state.vision,
    image: "",
    // mission: location?.state.mission,
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [missionBody, setMissionBody] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState("");
  const [isError, setIsError] = React.useState(false);
  const [isStartedFilling, setIsStartedFilling] = React.useState(false);

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

  React.useEffect(() => {
    if (isStartedFilling) {
      //Do nothing
    }
  }, [isStartedFilling]);

  const uploadNewImage = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "rsphcmb_who_we_are/vision_image");
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
          const mRef = doc(db, "about", "rsphcmb");
          try {
            await updateDoc(mRef, {
              vision: formValues.vision,
              mission: missionBody,
              updatedAt: timeNow,
              visionImage: downloadURL,
            });
            setIsLoading(false);
            enqueueSnackbar(`Data updated successfully`, {
              variant: "success",
            });
            history.goBack();
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

  const updateData = async (e) => {
    setIsLoading(true);
    setFormValues({
      vision: formValues.vision ? formValues.vision : location?.state.vision,
      mission: missionBody,
    });

    if (!previewImage) {
      //No image is changed. So update all text
      const timeNow = new Date();
      try {
        const mRef = doc(db, "about", "rsphcmb");
        await updateDoc(mRef, {
          vision: formValues.vision,
          mission: missionBody,
          updatedAt: timeNow,
        });
        setIsLoading(false);
        enqueueSnackbar(`Service updated successfully`, {
          variant: "success",
        });
        history.goBack();
      } catch (error) {
        setIsLoading(false);
        enqueueSnackbar(`${error?.message}`, {
          variant: "error",
        });
      }
    } else {
      //Change only the featured image and all texts
      const fileRef = ref(storage, "rsphcmb_who_we_are/vision_image");

      deleteObject(fileRef)
        .then(() => {
          setIsLoading(false);
          uploadNewImage();
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("ErR: ", error);
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
      <Button startIcon={<ArrowBackIosNew />} onClick={() => history.goBack()}>
        Back
      </Button>
      <br />
      <ValidatorForm onSubmit={updateData}>
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
                src={previewImage ? previewImage : location?.state?.image}
                className={classes.image}
              />
            </div>
          </Grid>
        </Grid>

        <TextField
          id="outlined-multiline-static"
          multiline
          value={
            formValues.vision === " "
              ? location?.state?.vision
              : !formValues.vision
              ? ""
              : formValues.vision
          }
          onChange={handleChange}
          name="vision"
          rows={3}
          fullWidth
          required
          className={classes.mb}
          label="Vision"
        />
        <br />
        <br />

        <EditableRichText
          value={missionBody}
          setValue={setMissionBody}
          error={isError}
          setError={setIsError}
          setIsStartedFilling={setIsStartedFilling}
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

export default VisionSection;
