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
} from "../../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/system";
import { CircularProgress, Divider } from "@mui/material";
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

const UpdateCovid19Form = (props) => {
  const classes = useStyles();
  let {
    setOpen,
    id,
    heading,
    image1,
    image2,
    image3,
    excerpt1,
    excerpt2,
    excerpt3,
    title1,
    desc1,
    title2,
    desc2,
    title3,
    desc3,
    buttonText1,
    buttonText2,
    buttonText3,
    actionUrl1,
    actionUrl2,
    actionUrl3,
  } = props;
  const [formValues, setFormValues] = React.useState({
    heading: heading,
    image1: image1,
    image2: image2,
    image3: image3,
    excerpt1: excerpt1,
    excerpt2: excerpt2,
    excerpt3: excerpt3,
    title1: title1,
    title2: title2,
    title3: title3,
    desc1: desc1,
    desc2: desc2,
    desc3: desc3,
    buttonText1: buttonText1,
    buttonText2: buttonText2,
    buttonText3: buttonText3,
    actionUrl1: actionUrl1,
    actionUrl2: actionUrl2,
    actionUrl3: actionUrl3,
  });
  const [file, setFile] = React.useState(null);
  // const [file2, setFile2] = React.useState(null);
  // const [file3, setFile3] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");
  // const [previewImage2, setPreviewImage2] = React.useState("");
  // const [previewImage3, setPreviewImage3] = React.useState("");

  // const [isError, setIsError] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // const [isStartedFilling, setIsStartedFilling] = React.useState(false);

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
    const storageRef = ref(storage, "home-covid/" + timeNow.getTime());
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
          const mRef = doc(db, "home-covid", "" + id);
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

  const updateCovid = async (e) => {
    setIsLoading(true);
    setFormValues({
      desc1: formValues.desc1 ? formValues.desc1 : desc1,
      desc2: formValues.desc2 ? formValues.desc2 : desc2,
      desc3: formValues.desc3 ? formValues.desc3 : desc3,
      excerpt1: formValues.excerpt1 ? formValues.excerpt1 : excerpt1,
      excerpt2: formValues.excerpt2 ? formValues.excerpt2 : excerpt2,
      excerpt3: formValues.excerpt3 ? formValues.excerpt3 : excerpt3,
      heading: formValues.heading ? formValues.heading : heading,
      image1: formValues.image1 ? formValues.image1 : image1,
      image2: formValues.image2 ? formValues.image2 : image2,
      image3: formValues.image3 ? formValues.image3 : image3,
      title1: formValues.title1 ? formValues.title1 : title1,
      title2: formValues.title2 ? formValues.title2 : title2,
      title3: formValues.title3 ? formValues.title3 : title3,
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
      const fileRef = ref(storage, "home-banner/" + id);

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
      <ValidatorForm onSubmit={updateCovid}>
        <TextValidator
          className={classes.mb}
          id="heading"
          label="Section heading"
          size="small"
          variant="outlined"
          value={
            formValues.heading === " "
              ? heading
              : !formValues.heading
              ? ""
              : formValues.heading
          }
          onChange={handleChange}
          name="heading"
          fullWidth
          validators={["required"]}
          errorMessages={["Section heading is required"]}
        />

        <Grid container spacing={2}>
          <Grid item sm={4} md={4}>
            <TextValidator
              className={classes.mb}
              label="Description Line1"
              size="small"
              variant="outlined"
              value={
                formValues.desc1 === " "
                  ? desc1
                  : !formValues.desc1
                  ? ""
                  : formValues.desc1
              }
              onChange={handleChange}
              name="desc1"
              fullWidth
              validators={["required"]}
              errorMessages={["Description Line1 is required"]}
            />
          </Grid>
          <Grid item sm={4} md={4}>
            <TextValidator
              className={classes.mb}
              label="Description Line2"
              size="small"
              variant="outlined"
              value={
                formValues.desc2 === " "
                  ? desc2
                  : !formValues.desc2
                  ? ""
                  : formValues.desc2
              }
              onChange={handleChange}
              name="desc2"
              fullWidth
              validators={["required"]}
              errorMessages={["Description Line2 is required"]}
            />
          </Grid>
          <Grid item sm={4} md={4}>
            <TextValidator
              className={classes.mb}
              label="Description Line3"
              size="small"
              variant="outlined"
              value={
                formValues.desc3 === " "
                  ? desc3
                  : !formValues.desc3
                  ? ""
                  : formValues.desc3
              }
              onChange={handleChange}
              name="desc3"
              fullWidth
              validators={["required"]}
              errorMessages={["Description Line3 is required"]}
            />
          </Grid>
        </Grid>

        <Divider />

        <Grid container spacing={1} padding={1}>
          <Grid item xs={12} sm={4} md={4}>
            <div>
              <Box display={"flex"} flexDirection="row">
                <TextValidator
                  id="image1"
                  size="small"
                  variant="outlined"
                  value={formValues.image1}
                  name="image1"
                  type="file"
                  fullWidth
                  disabled={isLoading}
                  accept=".png, .jpg, .jpeg"
                  onChange={handleChange}
                  helperText="Featured image1"
                />

                <div>
                  <Avatar
                    variant="rounded"
                    alt="Passport"
                    src={previewImage ? previewImage : image1}
                    className={classes.image}
                  />
                </div>
              </Box>
              <TextValidator
                className={classes.mb}
                label="Card 1 title"
                placeholder="Card 1 title"
                size="small"
                variant="outlined"
                value={formValues.title1}
                onChange={handleChange}
                name="title1"
                fullWidth
                validators={["required"]}
                errorMessages={["Card 1 title is required"]}
              />
              <br />
              <TextValidator
                className={classes.mb}
                label="Card 1 excerpt"
                placeholder="Card 1 excerpt"
                size="small"
                variant="outlined"
                value={formValues.excerpt1}
                onChange={handleChange}
                name="excerpt1"
                fullWidth
                validators={["required"]}
                errorMessages={["Card 1 excerpt is required"]}
              />
              <TextValidator
                className={classes.mb}
                label="Button text"
                placeholder="Button text"
                size="small"
                variant="outlined"
                value={formValues.buttonText1}
                onChange={handleChange}
                name="buttonText1"
                fullWidth
                validators={["required"]}
                errorMessages={["Button text 1 is required"]}
              />
              <TextValidator
                className={classes.mb}
                label="Button URL"
                placeholder="Button URL"
                size="small"
                variant="outlined"
                type="url"
                value={formValues.actionUrl1}
                onChange={handleChange}
                name="actionUrl1"
                fullWidth
                validators={["required"]}
                errorMessages={["Button URL link is required"]}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <div>
              <Box display={"flex"} flexDirection="row">
                <TextValidator
                  id="image2"
                  size="small"
                  variant="outlined"
                  value={formValues.image2}
                  name="image2"
                  type="file"
                  fullWidth
                  disabled={isLoading}
                  accept=".png, .jpg, .jpeg"
                  onChange={handleChange}
                  helperText="Featured image2"
                />

                <div>
                  {/* <Avatar
                    variant="rounded"
                    alt="Passport"
                    src={previewImage2 ? previewImage2 : image2}
                    className={classes.image}
                  /> */}
                </div>
              </Box>
              <TextValidator
                className={classes.mb}
                label="Card 2 title"
                placeholder="Card 2 title"
                size="small"
                variant="outlined"
                value={formValues.title2}
                onChange={handleChange}
                name="title2"
                fullWidth
                validators={["required"]}
                errorMessages={["Card 2 title is required"]}
              />
              <br />
              <TextValidator
                className={classes.mb}
                label="Card 2 excerpt"
                placeholder="Card 2 excerpt"
                size="small"
                variant="outlined"
                value={formValues.excerpt2}
                onChange={handleChange}
                name="excerpt2"
                fullWidth
                validators={["required"]}
                errorMessages={["Card 2 excerpt is required"]}
              />
              <TextValidator
                className={classes.mb}
                label="Button text"
                placeholder="Button text"
                size="small"
                variant="outlined"
                value={formValues.buttonText2}
                onChange={handleChange}
                name="buttonText2"
                fullWidth
                validators={["required"]}
                errorMessages={["Button text 2 is required"]}
              />
              <TextValidator
                className={classes.mb}
                label="Button URL"
                placeholder="Button URL"
                size="small"
                variant="outlined"
                type="url"
                value={formValues.actionUrl2}
                onChange={handleChange}
                name="actionUrl2"
                fullWidth
                validators={["required"]}
                errorMessages={["Button2 URL link is required"]}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <div>
              <Box display={"flex"} flexDirection="row">
                <TextValidator
                  id="image3"
                  size="small"
                  variant="outlined"
                  value={formValues.image3}
                  name="image3"
                  type="file"
                  fullWidth
                  disabled={isLoading}
                  accept=".png, .jpg, .jpeg"
                  onChange={handleChange}
                  helperText="Featured image3"
                />

                <div>
                  {/* <Avatar
                    variant="rounded"
                    alt="Passport"
                    src={previewImage3 ? previewImage3 : image3}
                    className={classes.image}
                  /> */}
                </div>
              </Box>
              <TextValidator
                className={classes.mb}
                label="Card 3 title"
                placeholder="Card 3 title"
                size="small"
                variant="outlined"
                value={formValues.title3}
                onChange={handleChange}
                name="title3"
                fullWidth
                validators={["required"]}
                errorMessages={["Card 3 title is required"]}
              />
              <br />
              <TextValidator
                className={classes.mb}
                label="Card 3 excerpt"
                placeholder="Card 3 excerpt"
                size="small"
                variant="outlined"
                value={formValues.excerpt3}
                onChange={handleChange}
                name="excerpt3"
                fullWidth
                validators={["required"]}
                errorMessages={["Card 3 excerpt is required"]}
              />
              <TextValidator
                className={classes.mb}
                label="Button text"
                placeholder="Button text"
                size="small"
                variant="outlined"
                value={formValues.buttonText3}
                onChange={handleChange}
                name="buttonText3"
                fullWidth
                validators={["required"]}
                errorMessages={["Button text 3 is required"]}
              />
              <TextValidator
                className={classes.mb}
                label="Button URL"
                placeholder="Button URL"
                size="small"
                variant="outlined"
                type="url"
                value={formValues.actionUrl3}
                onChange={handleChange}
                name="actionUrl3"
                fullWidth
                validators={["required"]}
                errorMessages={["Button 3 URL link is required"]}
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

export default UpdateCovid19Form;
