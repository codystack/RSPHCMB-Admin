import React from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
// import Avatar from "@mui/material/Avatar";
// import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { db, doc, updateDoc } from "../../../../data/firebase";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";

// const useStyles = makeStyles((theme) => ({
//   image: {
//     margin: "0px auto 15px auto",
//     width: 128,
//     height: 128,
//   },
// }));

const NewCommitteeForm = (props) => {
  // const classes = useStyles();
  let { setOpen, id, list } = props;
  const [formValues, setFormValues] = React.useState({
    name: "",
    designation: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [comms, setComms] = React.useState([]);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (list) {
      console.log(`SJHS: ${list}`);
      setComms(list);

      setIsLoading(false);
    }
  }, [list, comms]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const addRecord = async (e) => {
    // const timeNow = new Date();
    setIsLoading(true);
    list = Object.assign([], list);
    list?.push({
      name: formValues.name,
      designation: formValues.designation,
    });
    const mRef = doc(db, "lgas", "" + id);

    // console.log(`GYS: ${list?.length}`);
    // list?.forEach((element) => {
    //   console.log("ELEM", element);
    // });

    try {
      await updateDoc(mRef, {
        committees: [...list],
      }).then(() => {
        setOpen(false);
        setIsLoading(false);
        enqueueSnackbar(`Committee added successfully`, {
          variant: "success",
        });
      });
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(`${error?.message || "Check your internet!"}`, {
        variant: "error",
      });
    }

    // setDoc(doc(db, "lgas/", `${id}`), {
    //   committees: {
    //     name: formValues.name,
    //     designation: formValues.designation,
    //   },
    // })
    //   .then((res) => {
    //     setOpen(false);
    //     setIsLoading(false);
    //     enqueueSnackbar(`New committee record added successfully`, {
    //       variant: "success",
    //     });
    //   })
    //   .catch((error) => {
    //     setIsLoading(false);
    //   });
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
      <ValidatorForm onSubmit={addRecord}>
        <TextValidator
          label="Name"
          size="small"
          variant="outlined"
          value={formValues.name}
          onChange={handleChange}
          name="name"
          fullWidth
          validators={["required"]}
          errorMessages={["Name is required"]}
        />
        <br />

        <TextValidator
          label="Designation"
          size="small"
          variant="outlined"
          value={formValues.designation}
          onChange={handleChange}
          name="designation"
          fullWidth
          validators={["required"]}
          errorMessages={["Designation is required"]}
        />
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

export default NewCommitteeForm;
