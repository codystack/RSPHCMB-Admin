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
} from "../../../data/firebase";
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

const AddTeamMember = (props) => {
  const classes = useStyles();
  let { setOpen } = props;
  const [formValues, setFormValues] = React.useState({
    name: "",
    position: "",
    image: "",
  });
  const [file, setFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [bio, setBio] = React.useState();
  const [isError, setIsError] = React.useState(false);
  // const [isStartedFilling, setIsStartedFilling] = React.useState(false);
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

  const addNewMember = (e) => {
    setIsUploading(true);
    const timeNow = new Date();
    //First upload image to firebase storage then save to firestore
    const storageRef = ref(storage, "team-members/" + timeNow.getTime());
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
        enqueueSnackbar(`${error?.message || "Check your internet"}`, {
          variant: "error",
        });
      },
      () => {
        setIsUploading(false);
        setIsLoading(true);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDoc(doc(db, "team-members", `${timeNow.getTime()}`), {
            id: timeNow.getTime(),
            name: formValues.name,
            image: downloadURL,
            position: formValues.position,
            biography: bio,
          })
            .then((res) => {
              setOpen(false);
              setIsLoading(false);
              enqueueSnackbar(`New team member added successfully`, {
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
      <ValidatorForm onSubmit={addNewMember}>
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
              accept=".png, .jpg, .jpeg,"
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
          label="Name"
          size="small"
          variant="outlined"
          value={formValues.name}
          onChange={handleChange}
          name="name"
          fullWidth
          validators={["required"]}
          errorMessages={["Member's name is required"]}
        />
        <br />
        <TextValidator
          label="Position"
          size="small"
          variant="outlined"
          value={formValues.position}
          onChange={handleChange}
          name="position"
          fullWidth
          validators={["required"]}
          errorMessages={["Member's position is required"]}
        />
        <br />
        <RichText
          value={bio}
          setValue={setBio}
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

export default AddTeamMember;
