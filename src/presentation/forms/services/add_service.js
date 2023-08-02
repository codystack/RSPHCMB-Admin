import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {
  db,
  doc,
  setDoc,
  getDownloadURL,
  uploadBytesResumable,
  ref,
  storage,
} from "../../../data/firebase/";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { makeStyles } from "@mui/styles";
import Box from "@mui/system/Box";
import { Avatar, CircularProgress, Typography } from "@mui/material";

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

const AddService = (props) => {
  const classes = useStyles();
  let { setOpen } = props;
  const [formValues, setFormValues] = React.useState({
    title: "",
    orderNo: "",
    image: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [previewPassport, setPreviewPassport] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    if (id === "image") {
      try {
        if (e.target.files[0]) {
          setFile(e.target.files[0]);
          setPreviewPassport(URL.createObjectURL(e.target.files[0]));
        } else {
          setPreviewPassport("");
        }
      } catch (e) {}
      setFormValues((prevData) => ({
        ...prevData,
        image: e.target.value,
      }));
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const createService = async (e) => {
    const timeNow = new Date();
    setIsLoading(true);

    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "new_services/" + timeNow.getTime());
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
          setDoc(doc(db, "new_services", `${timeNow.getTime()}`), {
            id: timeNow.getTime(),
            title: formValues.title,
            orderNo: parseInt(`${formValues.orderNo}`),
            items: [],
            image: downloadURL,
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
              enqueueSnackbar(
                `${error?.message || "Check your internet connection"}`,
                {
                  variant: "error",
                }
              );
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
        <TextValidator
          id="title"
          label="Service name"
          size="small"
          variant="outlined"
          value={formValues.title}
          onChange={handleChange}
          name="title"
          fullWidth
          validators={["required"]}
          errorMessages={["Name of service is required"]}
        />
        <br />

        <TextValidator
          id="orderNo"
          label="Priority"
          size="small"
          variant="outlined"
          value={formValues.orderNo}
          onChange={handleChange}
          name="orderNo"
          type="number"
          fullWidth
          validators={["required"]}
          errorMessages={["Enter the priority number"]}
        />
        <br />

        <Typography gutterBottom>
          Once done, open the service to add sub service items.
        </Typography>
        <br />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
        >
          Save
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default AddService;
