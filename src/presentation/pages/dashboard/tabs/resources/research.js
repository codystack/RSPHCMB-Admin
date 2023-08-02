import { Add, Edit } from "@mui/icons-material";
import { Backdrop, CircularProgress, Divider, Typography } from "@mui/material";
import React from "react";

import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
import CustomDialog2 from "../../../../components/dialogs/custom-dialog";
import { db, doc, updateDoc } from "../../../../../data/firebase";
import { useSnackbar } from "notistack";
// import { useHistory } from "react-router-dom";
import AddReportForm from "../../../../forms/reports/add_report";
import { useSelector } from "react-redux";
import { ValidatorForm } from "react-material-ui-form-validator";
import RichText from "../../../../components/misc/richtext";
import { Box } from "@mui/system";
import ResearchTable from "../../../../components/misc/table/research_table";
import MUIRichTextEditor from "mui-rte";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 286,
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  main: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    margin: "auto",
    minHeight: 275,
    minWidth: 320,
    alignItems: "center",
  },
  cardMedia: {
    height: 156,
    width: "100%",
  },
  subRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "end",
    alignItems: "center",
  },
  lhsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
  },
  avatar: {
    height: 36,
    width: 36,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    padding: 4,
  },
}));

const Research = () => {
  const classes = useStyles();
  //   const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const { researchData } = useSelector((state) => state.resources);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Add New Gallery Album"
        handleClose={() => setOpen(false)}
        bodyComponent={<AddReportForm setOpen={setOpen} />}
      />
      <CustomDialog2
        open={open2}
        title="Update Research Information"
        handleClose={() => setOpen2(false)}
        bodyComponent={
          <UpdateBody body={researchData?.body} setOpen={setOpen2} />
        }
      />
      <div className={classes.row}>
        <div className={classes.lhsRow}>
          <Typography variant="h6" color="blue" fontSize={21}>
            RESEARCH
          </Typography>
        </div>
        <Button
          startIcon={<Add />}
          color="primary"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add Research FAQ
        </Button>
      </div>
      <br />
      <div>
        {researchData && (
          <Box display="flex" flexDirection="column">
            <Box
              display={"flex"}
              flexDirection="row"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Typography variant="h6">Introduction</Typography>
              <Button
                variant="text"
                startIcon={<Edit />}
                onClick={() => setOpen2(true)}
              >
                Edit
              </Button>
            </Box>
            <MUIRichTextEditor
              readOnly
              inlineToolbar={false}
              defaultValue={researchData?.body}
              toolbar={false}
            />
            <Divider />
            <br />
            <ResearchTable list={researchData?.faqs} />
          </Box>
        )}
      </div>
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
      const mRef = doc(db, "resources", "research");
      await updateDoc(mRef, {
        body: content,
        updatedAt: timeNow,
      });
      setOpen(false);
      setLoading(false);
      enqueueSnackbar(`Research updated successfully`, {
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
        <RichText
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

export default Research;
