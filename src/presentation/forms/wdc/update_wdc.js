import { Button, LinearProgress } from "@mui/material";
import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useSnackbar } from "notistack";
import { db, doc, updateDoc } from "../../../data/firebase";
import { useLocation, useHistory } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import EditableRichText from "../../components/misc/richtext/editable";

const UpdateWDC = () => {
  const location = useLocation();
  const history = useHistory();

  const [title, setTitle] = React.useState(location?.state?.title);
  const [body, setBody] = React.useState(location?.state?.body);
  const [isError, setIsError] = React.useState(false);
  // const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // const [isStartedFilling, setIsStartedFilling] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    // setIsStartedFilling(true);
    const { value } = e.target;
    setTitle(value);
    // setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // console.log("LO", body);

    const mRef = doc(db, "contents", "wdc");
    try {
      await updateDoc(mRef, {
        title: title,
        body: body,
      });
      setIsSubmitting(false);
      //   console.log("SUCCESS MSGs", resp);
      enqueueSnackbar(`WDC updated successfully`, {
        variant: "success",
      });
      history.goBack();
    } catch (error) {
      setIsSubmitting(false);
      enqueueSnackbar(`${error?.message || "Error updating record"}`, {
        variant: "error",
      });
      //   console.log("ERROR MSGs", error);
    }
  };

  return (
    <div>
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

export default UpdateWDC;
