import React from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import Button from "@mui/material/Button";
import { db, doc, updateDoc } from "../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";
// import RichText from "../../components/misc/richtext";
import { useLocation, useHistory } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import EditableRichText from "../../components/misc/richtext/editable";

const WhoWeAreContent = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [isLoading, setIsLoading] = React.useState(false);

  const [body, setBody] = React.useState(location.state?.content);
  const [isError, setIsError] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // const [isStartedFilling, setIsStartedFilling] = React.useState(false);

  const updateData = async (e) => {
    setIsLoading(true);

    //No image is changed. So update all text
    const timeNow = new Date();
    try {
      const mRef = doc(db, "about", "rsphcmb");
      await updateDoc(mRef, {
        who_we_are: body,
        updatedAt: timeNow,
      });
      history.goBack();
      setIsLoading(false);
      enqueueSnackbar(`Data updated successfully`, {
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
      <Button startIcon={<ArrowBackIosNew />} onClick={() => history.goBack()}>
        Back
      </Button>
      <br />
      <br />
      <ValidatorForm onSubmit={updateData}>
        <EditableRichText
          value={body}
          setValue={setBody}
          error={isError}
          setError={setIsError}
          // setIsStartedFilling={setIsStartedFilling}
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

export default WhoWeAreContent;
