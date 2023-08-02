import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import {
  db,
  ref,
  storage,
  setDoc,
  doc,
  uploadBytesResumable,
  getDownloadURL,
} from "../../../data/firebase/";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/system";
import { CircularProgress, Grid } from "@mui/material";
import { Typography } from "@mui/material";
import RichText from "../../components/misc/richtext";

const useStyles = makeStyles((theme) => ({
  image: {
    margin: "0px auto 15px auto",
    width: 128,
    height: 128,
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

const NewServiceForm = (props) => {
  const classes = useStyles();
  let { setOpen } = props;
  const [formValues, setFormValues] = React.useState({
    title: "",
    summary: "",
    image: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewPassport, setPreviewPassport] = React.useState("");
  const [serviceBody, setServiceBody] = React.useState(null);
  const [isError, setIsError] = React.useState(false);
  // const [isStartedFilling, setIsStartedFilling] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    if (id === "image") {
      setFile(e.target.files[0]);
      setPreviewPassport(URL.createObjectURL(e.target.files[0]));
      setFormValues((prevData) => ({
        ...prevData,
        image: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const createService = (e) => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "services/img_" + timeNow.getTime());
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uprogress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        setProgress(uprogress);
      },
      (error) => {
        // Handle unsuccessful uploads
        setIsUploading(false);
        console.log(error);
        enqueueSnackbar(`${error.message}`, { variant: "error" });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDoc(doc(db, "services", `${timeNow.getTime()}`), {
            id: timeNow.getTime(),
            title: formValues.title,
            image: downloadURL,
            summary: formValues.summary,
            body: serviceBody,
          })
            .then((res) => {
              setOpen(false);
              setIsLoading(false);
              enqueueSnackbar(`New service added successfully`, {
                variant: "success",
              });
            })
            .catch((error) => {
              setIsLoading(false);
            });
        });
      }
    );
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
      <ValidatorForm onSubmit={createService}>
        <TextValidator
          id="title"
          label="Service name"
          size="small"
          variant="outlined"
          value={formValues.title}
          onChange={handleChange}
          // onBlur={handleBlur}
          name="title"
          fullWidth
          validators={["required"]}
          errorMessages={["Name of service is required"]}
        />
        <br />
        <Grid container spacing={2}>
          <Grid item sm={6} md={6}>
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
              validators={["required"]}
              errorMessages={["Featured image is required"]}
              helperText="Upload featured image"
            />
          </Grid>
          <Grid item sm={6} md={6}>
            <div>
              {previewPassport && (
                <Avatar
                  variant="rounded"
                  alt="Passport"
                  src={previewPassport}
                  className={classes.image}
                />
              )}
            </div>
          </Grid>
        </Grid>

        <br />
        <TextValidator
          className={classes.mb}
          id="summary"
          multiLine
          rows={2}
          rowsMax={3}
          label="Service summary"
          placeholder="Type summary here..."
          size="small"
          variant="outlined"
          value={formValues.summary}
          onChange={handleChange}
          name="summary"
          fullWidth
          validators={["required"]}
          errorMessages={["Service summary is required"]}
        />
        <br />

        <RichText
          value={serviceBody}
          setValue={setServiceBody}
          error={isError}
          setError={setIsError}
          // setIsStartedFilling={setIsStartedFilling}
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

export default NewServiceForm;
