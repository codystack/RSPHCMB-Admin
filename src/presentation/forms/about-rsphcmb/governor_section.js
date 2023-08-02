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
import { CircularProgress } from "@mui/material";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";

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

const GovernorSection = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [formValues, setFormValues] = React.useState({
    governorName: location?.state.governorName,
    governorImage: "",
    deputyGovName: location?.state?.deputyGovName,
    deputyGovImage: "",
  });

  const [file, setFile] = React.useState(null);
  const [file2, setFile2] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewImage2, setPreviewImage2] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    if (id === "governorImage") {
      setFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        governorImage: e.target.value,
      }));
    } else if (id === "deputyGovImage") {
      setFile2(e.target.files[0]);
      setPreviewImage2(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        deputyGovImage: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const uploadNewImage = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "governor/image");
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
        console.log(error);
        enqueueSnackbar(`${error.message}`, { variant: "error" });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "about", "rsphcmb");
          try {
            await updateDoc(mRef, {
              governorName: formValues.governorName,
              deputyGovName: formValues.deputyGovName,
              updatedAt: timeNow,
              governorImage: downloadURL,
            });
            history.goBack();
            setIsLoading(false);
            enqueueSnackbar(`Updated successfully`, {
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

  const uploadNewImage2 = () => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "governor/image2");
    const uploadTask = uploadBytesResumable(storageRef, file2);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uprogress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uprogress);
      },
      (error) => {
        setIsUploading(false);
        console.log(error);
        enqueueSnackbar(`${error.message}`, { variant: "error" });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const mRef = doc(db, "about", "rsphcmb");
          try {
            await updateDoc(mRef, {
              deputyGovName: formValues.deputyGovName,
              updatedAt: timeNow,
              deputyGovImage: downloadURL,
            });
            history.goBack();
            setIsLoading(false);
            enqueueSnackbar(`Updated successfully`, {
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

  const update = async (e) => {
    setIsLoading(true);
    setFormValues({
      deputyGovName: formValues.deputyGovName
        ? formValues.deputyGovName
        : location.state?.deputyGovName,
      governorName: formValues.governorName
        ? formValues.governorName
        : location?.state?.governorName,
    });
    if (!previewImage && !previewImage2) {
      //No image is changed. So update all text
      const timeNow = new Date();
      try {
        const mRef = doc(db, "about", "rsphcmb");
        await updateDoc(mRef, {
          deputyGovName: formValues.deputyGovName,
          governorName: formValues.governorName,
          updatedAt: timeNow,
        });
        history.goBack();
        setIsLoading(false);
        enqueueSnackbar(`Updated successfully`, {
          variant: "success",
        });
      } catch (error) {
        setIsLoading(false);
        enqueueSnackbar(`${error?.message}`, {
          variant: "error",
        });
      }
    } else if (previewImage && !previewImage2) {
      uploadNewImage();
    } else if (!previewImage && previewImage2) {
      uploadNewImage2();
    } else {
      const fileRef = ref(storage, "governor/image");
      const fileRef2 = ref(storage, "governor/image2");

      setIsLoading(true);

      deleteObject(fileRef)
        .then(() => {
          //Now Delete authors photo
          deleteObject(fileRef2)
            .then(() => {
              //Both items were deleted
              const timeNow = new Date();
              let storageRef = ref(storage, "governor/image");
              let storageRef2 = ref(storage, "governor/image2");
              let uploadTask = uploadBytesResumable(storageRef, file);
              let uploadTask2 = uploadBytesResumable(storageRef2, file2);

              setIsLoading(false);
              setIsUploading(true);

              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const uprogress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setProgress(uprogress);
                },
                (error) => {
                  setIsUploading(false);
                  console.log(error);
                  enqueueSnackbar(`${error?.message}`, { variant: "error" });
                },
                () => {
                  getDownloadURL(uploadTask?.snapshot?.ref).then(
                    async (downloadURL) => {
                      try {
                        const mRef = doc(db, "about", "rsphcmb");
                        await updateDoc(mRef, {
                          deputyGovName: formValues.deputyGovName,
                          governorName: formValues.governorName,
                          updatedAt: timeNow,
                          governorImage: downloadURL,
                        });
                        const tmn = timeNow.getTime();
                        setIsUploading(true);
                        setIsLoading(false);
                        uploadTask2.on(
                          "state_changed",
                          (snapshot2) => {
                            const prog =
                              (snapshot2.bytesTransferred /
                                snapshot2.totalBytes) *
                              100;
                            setProgress(prog);
                          },
                          (error) => {
                            setIsUploading(false);
                            console.log(error);
                            enqueueSnackbar(`${error?.message}`, {
                              variant: "error",
                            });
                          },
                          () => {
                            getDownloadURL(uploadTask2?.snapshot?.ref).then(
                              async (download) => {
                                setIsUploading(false);
                                setIsLoading(true);
                                try {
                                  const mRef = doc(db, "about", "rsphcmb");
                                  await updateDoc(mRef, {
                                    updatedAt: timeNow,
                                    deputyGovImage: download,
                                  });
                                  history.goBack();
                                  setIsLoading(false);
                                  enqueueSnackbar(`Updated successfully`, {
                                    variant: "success",
                                  });
                                } catch (error) {
                                  setIsLoading(false);
                                  enqueueSnackbar(
                                    `${
                                      error?.message ||
                                      "Check your internet connection"
                                    }`,
                                    {
                                      variant: "error",
                                    }
                                  );
                                }
                              }
                            );
                          }
                        );
                      } catch (error) {
                        setIsLoading(false);
                        enqueueSnackbar(
                          `${
                            error?.message || "Check your internet connection"
                          }`,
                          {
                            variant: "error",
                          }
                        );
                      }
                    }
                  );
                }
              );
            })
            .catch((err) => {});
          // setIsLoading(false);
          // uploadNewAuthorPhoto();
        })
        .catch((error) => {
          setIsLoading(false);
          enqueueSnackbar(
            `${error?.message || "Check your internet connection"}`,
            {
              variant: "error",
            }
          );
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
      <ValidatorForm onSubmit={update}>
        <Grid container spacing={1} padding={1}>
          <Grid item xs={12} sm={6} md={7}>
            <TextValidator
              id="governorImage"
              size="small"
              variant="outlined"
              value={formValues.governorImage}
              name="governorImage"
              type="file"
              fullWidth
              disabled={isLoading}
              accept=".png, .jpg, .jpeg"
              onChange={handleChange}
              helperText="Governor's image is required"
            />
            <br />
            <TextValidator
              className={classes.mb}
              label="Governor's Name"
              multiLine={true}
              rows={3}
              size="small"
              variant="outlined"
              value={
                formValues.governorName === " "
                  ? location?.state?.governorName
                  : !formValues.governorName
                  ? ""
                  : formValues.governorName
              }
              onChange={handleChange}
              name="governorName"
              fullWidth
              validators={["required"]}
              errorMessages={["Governor's name is required"]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <div>
              <Avatar
                variant="rounded"
                alt="Passport"
                src={
                  previewImage ? previewImage : location?.state?.governorImage
                }
                className={classes.image}
              />
            </div>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={1} padding={1}>
          <Grid item xs={12} sm={6} md={7}>
            <TextValidator
              id="deputyGovImage"
              size="small"
              variant="outlined"
              value={formValues.deputyGovImage}
              name="deputyGovImage"
              type="file"
              fullWidth
              disabled={isLoading}
              accept=".png, .jpg, .jpeg"
              onChange={handleChange}
              helperText="Deputy governor's image is required"
            />
            <br />
            <TextValidator
              className={classes.mb}
              label="Deputy Governor's Name"
              multiLine={true}
              rows={3}
              size="small"
              variant="outlined"
              value={
                formValues.deputyGovName === " "
                  ? location?.state?.deputyGovName
                  : !formValues.deputyGovName
                  ? ""
                  : formValues.deputyGovName
              }
              onChange={handleChange}
              name="deputyGovName"
              fullWidth
              validators={["required"]}
              errorMessages={["Deputy governor's name is required"]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <div>
              <Avatar
                variant="rounded"
                alt="Passport"
                src={
                  previewImage2
                    ? previewImage2
                    : location?.state?.deputyGovImage
                }
                className={classes.image}
              />
            </div>
          </Grid>
        </Grid>

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

export default GovernorSection;
