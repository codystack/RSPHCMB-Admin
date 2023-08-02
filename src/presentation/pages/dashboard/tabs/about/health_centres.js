import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Edit from "@mui/icons-material/Edit";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
import { useSnackbar } from "notistack";
import { updateDoc, db, doc } from "../../../../../data/firebase/";
import { ValidatorForm } from "react-material-ui-form-validator";
import MUIRichTextEditor from "mui-rte";
import { useSelector } from "react-redux";
import EditableRichText from "../../../../components/misc/richtext/editable";

const HealthCentres = () => {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);

  const { data } = useSelector((state) => state.healthcentre);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Update Health Centre Introduction"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <UpdateBody body={data?.introduction} setOpen={setOpen} />
        }
      />
      <Container sx={{ py: 4 }}>
        <Box
          display={"flex"}
          flexDirection="row"
          justifyContent="start"
          alignItems={"center"}
        >
          <Button
            variant="text"
            startIcon={<ArrowBackIosNew />}
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          <Typography gutterBottom variant="h5" component={"h1"}>
            Health Centre
          </Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection="row"
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Typography variant="h6">Introduction</Typography>
          <IconButton onClick={() => setOpen(true)}>
            <Edit />
          </IconButton>
        </Box>
        <MUIRichTextEditor
          readOnly
          inlineToolbar={false}
          defaultValue={data?.introduction}
          toolbar={false}
        />
      </Container>
    </div>
  );
};

const UpdateBody = (props) => {
  let { body, setOpen } = props;
  const [content, setContent] = React.useState(body);
  const [isError, setError] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  // const [isStartedFilling, setIsStartedFilling] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const updateData = async (e) => {
    setLoading(true);

    const timeNow = new Date();
    try {
      const mRef = doc(db, "about", "health-centres");
      await updateDoc(mRef, {
        introduction: content,
        updatedAt: timeNow,
      });
      setOpen(false);
      setLoading(false);
      enqueueSnackbar(`Introduction updated successfully`, {
        variant: "success",
      });
    } catch (error) {
      setLoading(false);
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
      <ValidatorForm onSubmit={updateData}>
        <EditableRichText
          value={content}
          setValue={setContent}
          error={isError}
          setError={setError}
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

export default HealthCentres;
