import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { Avatar, CircularProgress, Grid, Typography } from "@mui/material";
import {
  db,
  ref,
  storage,
  updateDoc,
  doc,
  uploadBytesResumable,
  getDownloadURL,
} from "../../../data/firebase";

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

const AddSubAlbumForm = (props) => {
  const classes = useStyles();
  let { setOpen, id, list } = props;
  const [formValues, setFormValues] = React.useState({
    desc: "",
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

  const addRecord = async (e) => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "gallery/" + timeNow.getTime());
    const uploadTask = uploadBytesResumable(storageRef, file);
    // setIsLoading(true);
    list = Object.assign([], list);

    const mRef = doc(db, "gallery", "" + id);

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
        // console.log(error);
        enqueueSnackbar(`${error?.message}`, { variant: "error" });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            await list?.push({
              desc: formValues.text,
              image: downloadURL,
            });

            await updateDoc(mRef, {
              items: [...list],
            });
            setOpen(false);
            setIsLoading(false);
            enqueueSnackbar(`Gallery item added successfully`, {
              variant: "success",
            });
          } catch (error) {
            setIsLoading(false);
            enqueueSnackbar(`${error?.message || "Check your internet!"}`, {
              variant: "error",
            });
          }
          // setDoc(doc(db, "gallery", `${timeNow.getTime()}`), {
          //   id: timeNow.getTime(),
          //   title: formValues.title,
          //   image: downloadURL,
          //   items: [],
          // })
          //   .then((res) => {
          //     setOpen(false);
          //     setIsLoading(false);
          //     enqueueSnackbar(`New Gallery added successfully`, {
          //       variant: "success",
          //     });
          //   })
          //   .catch((error) => {
          //     setIsLoading(false);
          //   });
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
      <ValidatorForm onSubmit={addRecord}>
        <TextValidator
          label="Text"
          size="small"
          variant="outlined"
          value={formValues.text}
          onChange={handleChange}
          name="text"
          fullWidth
          required
          validators={["required"]}
          errorMessages={["Text is required"]}
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

export default AddSubAlbumForm;
