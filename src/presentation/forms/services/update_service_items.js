import {
  Backdrop,
  Button,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useSnackbar } from "notistack";
import { db, doc, updateDoc } from "../../../data/firebase";
import { useLocation, useHistory } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import EditableRichText from "../../components/misc/richtext/editable";
import { arrayRemove, arrayUnion } from "firebase/firestore";

const UpdateServiceItems = () => {
  const location = useLocation();
  const history = useHistory();

  const [title, setTitle] = React.useState(location?.state?.data.title);
  const [body, setBody] = React.useState(location?.state?.data.body);
  const [isError, setIsError] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { value } = e.target;
    setTitle(value);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // console.log("LO", body);

    const mRef = doc(db, "new_services", "" + location.state?.serviceId);
    try {
      await updateDoc(mRef, {
        items: arrayRemove(location.state?.data),
      });

      await updateDoc(mRef, {
        items: arrayUnion({ title: title, body: body }),
      });

      setIsSubmitting(false);
      enqueueSnackbar(`Service updated successfully`, {
        variant: "success",
      });
      history.goBack();
    } catch (error) {
      setIsSubmitting(false);
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
        variant: "error",
      });
      //   console.log("ERROR MSGs", error);
    }
  };

  return (
    <div>
      <Backdrop style={{ zIndex: 1200 }} open={isSubmitting}>
        {isSubmitting ? (
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
      <br />
      <ValidatorForm
        onSubmit={submitForm}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <TextValidator
          fullWidth
          size="small"
          placeholder="Title"
          name="title"
          required
          label="Title"
          value={title}
          onChange={handleChange}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Title is required"]}
        />
        <br />
        <EditableRichText
          value={body}
          setValue={setBody}
          error={isError}
          setError={setIsError}
          // setIsStartedFilling={setIsStartedFilling}
        />
        {isSubmitting && <LinearProgress />}
        <br />

        <Button
          color="primary"
          variant="contained"
          type="submit"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </ValidatorForm>
    </div>
  );
};

export default UpdateServiceItems;
