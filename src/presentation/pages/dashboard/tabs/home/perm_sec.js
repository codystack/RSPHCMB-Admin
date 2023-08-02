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
import MUIRichTextEditor from "mui-rte";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
import CustomDialog2 from "../../../../components/dialogs/custom-dialog";
import CustomDialog3 from "../../../../components/dialogs/custom-dialog";
import CustomDialog4 from "../../../../components/dialogs/custom-dialog";
import CustomDialog5 from "../../../../components/dialogs/custom-dialog";
import { useSnackbar } from "notistack";
import {
  doc,
  getDownloadURL,
  uploadBytesResumable,
  ref,
  db,
  storage,
  updateDoc,
  deleteObject,
} from "../../../../../data/firebase";
import { makeStyles } from "@mui/styles";
import EditableRichText from "../../../../components/misc/richtext/editable";

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

const PermSec = () => {
  const { permSecData } = useSelector((state) => state.permSec);
  const history = useHistory();

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);

  return (
    <div>
      <Container>
        <CustomDialog
          title="Update Picture"
          open={open}
          handleClose={() => setOpen(false)}
          bodyComponent={
            <UpdateImage
              setOpen={setOpen}
              image={permSecData?.image}
              id={"info"}
            />
          }
        />
        <CustomDialog2
          title="Update Name"
          open={open2}
          handleClose={() => setOpen2(false)}
          bodyComponent={
            <UpdateName
              setOpen={setOpen2}
              name={permSecData?.name}
              position={permSecData?.position}
              id={"info"}
            />
          }
        />
        <CustomDialog3
          title="Update Biography"
          open={open3}
          handleClose={() => setOpen3(false)}
          bodyComponent={
            <UpdateBio
              setOpen={setOpen3}
              bio={permSecData?.biography}
              id={"info"}
            />
          }
        />

        <CustomDialog4
          title="Update Message"
          open={open4}
          handleClose={() => setOpen4(false)}
          bodyComponent={
            <UpdateMessage
              setOpen={setOpen4}
              message={permSecData?.message}
              id={"info"}
            />
          }
        />

        <CustomDialog5
          title="Update Summary"
          open={open5}
          handleClose={() => setOpen5(false)}
          bodyComponent={
            <UpdateSummary
              setOpen={setOpen5}
              summary={permSecData?.summary}
              id={"info"}
            />
          }
        />
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
              <img src={permSecData?.image} alt="" />
              <Button
                sx={{ mt: 1, textTransform: "none" }}
                variant="contained"
                onClick={() => setOpen(true)}
              >
                Update Image
              </Button>
              <br />
              <Box
                paddingY={1}
                display={"flex"}
                flexDirection="row"
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Typography>{permSecData?.name}</Typography>
                <Button
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  startIcon={<Edit />}
                  onClick={() => setOpen2(true)}
                >
                  Update
                </Button>
              </Box>
              <Divider />
              <Box
                paddingY={1}
                display={"flex"}
                flexDirection="row"
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Typography>{permSecData?.position}</Typography>
              </Box>
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
                <Typography variant="h6">BIOGRAPHY</Typography>
                <IconButton onClick={() => setOpen3(true)}>
                  <Edit />
                </IconButton>
              </Box>
              <Divider />
              <MUIRichTextEditor
                readOnly
                inlineToolbar={false}
                toolbar={false}
                defaultValue={permSecData?.biography}
              />
            </Box>
          </Grid>
        </Grid>
        <br />
        <Divider />
        <br />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">WELCOME MESSAGE</Typography>
          <IconButton onClick={() => setOpen4(true)}>
            <Edit />
          </IconButton>
        </Box>
        <Divider />
        <MUIRichTextEditor
          readOnly
          inlineToolbar={false}
          toolbar={false}
          defaultValue={permSecData?.message}
        />

        <br />
        <Divider />
        <br />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            MESSAGE SUMMARY (SHORT DESCRIPTION ON HOME PAGE)
          </Typography>
          <IconButton onClick={() => setOpen5(true)}>
            <Edit />
          </IconButton>
        </Box>
        <Divider />
        <Typography>{permSecData?.summary}</Typography>
      </Container>
    </div>
  );
};

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
    const storageRef = ref(storage, "perm-sec/image");
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
          const mRef = doc(db, "perm-sec", "" + id);
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
            enqueueSnackbar(`${error?.message}`, {
              variant: "error",
            });
          }
        });
      }
    );
  };

  const updateImage = async (e) => {
    setIsLoading(true);

    //Change on the featured image and all texts
    const fileRef = ref(storage, "perm-sec/info.png");

    deleteObject(fileRef)
      .then(() => {
        setIsLoading(false);
        uploadNewImage();
      })
      .catch((error) => {
        setIsLoading(false);
        // console.log("ErR: ", error);
      });
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

const UpdateName = (props) => {
  const classes = useStyles();
  let { setOpen, id, name, position } = props;
  const [formValues, setFormValues] = React.useState({
    name: name,
    position: position,
    image: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateName = async (e) => {
    setIsLoading(true);
    setFormValues({
      name: formValues.name ? formValues.name : name,
    });

    //No image is changed. So update all text
    const timeNow = new Date();
    try {
      const mRef = doc(db, "perm-sec", "" + id);
      await updateDoc(mRef, {
        name: formValues.name,
        position: formValues.position,
        updatedAt: timeNow,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Name updated successfully`, {
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
      <ValidatorForm onSubmit={updateName}>
        <TextValidator
          className={classes.mb}
          id="name"
          label="Name"
          size="small"
          variant="outlined"
          value={
            formValues.name === " "
              ? name
              : !formValues.name
              ? ""
              : formValues.name
          }
          onChange={handleChange}
          name="name"
          fullWidth
          validators={["required"]}
          errorMessages={["Name is required"]}
        />

        <br/>

        <TextValidator
          className={classes.mb}
          id="position"
          label="Position"
          size="small"
          variant="outlined"
          value={
            formValues.position === " "
              ? position
              : !formValues.position
              ? ""
              : formValues.position
          }
          onChange={handleChange}
          name="position"
          fullWidth
          validators={["required"]}
          errorMessages={["Position is required"]}
        />

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

const UpdateBio = (props) => {
  // const classes = useStyles();
  let { setOpen, id, bio } = props;
  const [body, setBody] = React.useState(bio);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  // const [isStartedFilling, setIsStartedFilling] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const updateName = async (e) => {
    setIsLoading(true);

    //No image is changed. So update all text
    const timeNow = new Date();
    try {
      const mRef = doc(db, "perm-sec", "" + id);
      await updateDoc(mRef, {
        biography: body,
        updatedAt: timeNow,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Biography updated successfully`, {
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
      <ValidatorForm onSubmit={updateName}>
        <EditableRichText
          value={body}
          setValue={setBody}
          error={isError}
          setError={setIsError}
          // setIsStartedFilling={setIsStartedFilling}
        />

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

const UpdateMessage = (props) => {
  // const classes = useStyles();
  let { setOpen, id, message } = props;
  const [body, setBody] = React.useState(message);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  // const [isStartedFilling, setIsStartedFilling] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const updateMessage = async (e) => {
    setIsLoading(true);

    //No image is changed. So update all text
    const timeNow = new Date();
    try {
      const mRef = doc(db, "perm-sec", "" + id);
      await updateDoc(mRef, {
        message: body,
        updatedAt: timeNow,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Message updated successfully`, {
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
      <ValidatorForm onSubmit={updateMessage}>
        <EditableRichText
          value={body}
          setValue={setBody}
          error={isError}
          setError={setIsError}
          // setIsStartedFilling={setIsStartedFilling}
        />

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

const UpdateSummary = (props) => {
  const classes = useStyles();
  let { setOpen, summary } = props;
  const [formValues, setFormValues] = React.useState({
    summary: summary,
    image: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateSummary = async (e) => {
    setIsLoading(true);
    setFormValues({
      summary: formValues.summary ? formValues.summary : summary,
    });

    //No image is changed. So update all text
    const timeNow = new Date();
    try {
      const mRef = doc(db, "perm-sec", "info");
      await updateDoc(mRef, {
        summary: formValues.summary,
        updatedAt: timeNow,
      });
      setOpen(false);
      setIsLoading(false);
      enqueueSnackbar(`Summary updated successfully`, {
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
      <ValidatorForm onSubmit={updateSummary}>
        <TextField
          id="outlined-multiline-static"
          multiline
          label="Summary"
          placeholder="Type summary here..."
          size="small"
          variant="outlined"
          value={formValues.summary}
          onChange={handleChange}
          name="summary"
          rows={5}
          fullWidth
          required
          className={classes.mb}
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

export default PermSec;
