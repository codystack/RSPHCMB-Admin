import { Button, LinearProgress } from "@mui/material";
import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useSnackbar } from "notistack";
import { arrayUnion, db, doc, updateDoc } from "../../../data/firebase";
import EditableRichText from "../../components/misc/richtext/editable";
import { arrayRemove } from "firebase/firestore";
import { useHistory } from "react-router";

const AddSubService = ({ setOpen, id, mtitle }) => {
  const history = useHistory();

  const [title, setTitle] = React.useState(mtitle);
  const [body, setBody] = React.useState("");
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

    const mRef = doc(db, "new_services", "" + id);
    try {
      await updateDoc(mRef, {
        items: arrayRemove({
          title: mtitle,
          body: "",
        }),
      });

      await updateDoc(mRef, {
        items: arrayUnion({
          title: title,
          body: body,
        }),
      });

      setIsSubmitting(false);
      setOpen(false);
      history.goBack();
      enqueueSnackbar(`Sub service updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      setIsSubmitting(false);
      enqueueSnackbar(`${error?.message || "Check your internet connection"}`, {
        variant: "error",
      });
    }
  };

  return (
    <div>
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
          disabled
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

export default AddSubService;
