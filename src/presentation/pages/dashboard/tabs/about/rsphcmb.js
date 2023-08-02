import { Add, ArrowBackIosNew, Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import MUIRichTextEditor from "mui-rte";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { db, deleteDoc, doc } from "../../../../../data/firebase";
import CustomDialog from "../../../../components/dialogs/custom-dialog";
import DeleteDialog from "../../../../components/dialogs/custom-dialog";
import AddTeamMember from "../../../../forms/about-rsphcmb/add_team";
import UpdateTeamForm from "../../../../forms/about-rsphcmb/update_team";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 320,
  },
  image: {
    height: 144,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardMedia: {
    height: 175,
    width: "100%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
  },
}));

const CardItem = (props) => {
  const classes = useStyles();
  const { image, name, position, id, biography } = props;
  // const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const deleteService = async () => {
    setOpenDelete(false);
    // const fileRef = ref(storage, "team-members/" + id);

    // deleteObject(fileRef)
    //   .then(async () => {
    //     // Images deleted now delete from firestore,
    try {
      await deleteDoc(doc(db, "team-members", "" + id));
      enqueueSnackbar(`Item deleted successfully`, {
        variant: "success",
      });
    } catch (error) {
      // console.log("ERR: Del: ", error);
      enqueueSnackbar(`Item not deleted. Try again`, {
        variant: "error",
      });
    }
    // })
    // .catch((err) => {});
  };

  const deleteBody = (
    <div>
      <Typography variant="body2" gutterBottom>
        {`Are you sure you want to delete ${name} ?`}
      </Typography>
      <br />
      <div className={classes.subRow}>
        <Button
          size="small"
          variant="contained"
          style={{ marginRight: 4 }}
          onClick={() => setOpenDelete(false)}
        >
          Cancel
        </Button>

        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={deleteService}
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <CustomDialog
        open={open}
        title="Update Team Member"
        handleClose={() => setOpen(false)}
        bodyComponent={
          <UpdateTeamForm
            setOpen={setOpen}
            image={image}
            name={name}
            id={id}
            biography={biography}
            position={position}
          />
        }
      />
      <DeleteDialog
        open={openDelete}
        title="Delete Team Member"
        handleClose={() => setOpenDelete(false)}
        bodyComponent={deleteBody}
      />
      <Card elevation={4} className={classes.root}>
        <Box
          display="flex"
          flexDirection={"row"}
          justifyContent="end"
          alignItems={"center"}
        >
          <IconButton onClick={() => setOpenDelete(true)}>
            <Delete color="error" />
          </IconButton>

          <IconButton onClick={() => setOpen(true)}>
            <Edit />
          </IconButton>
        </Box>
        <CardMedia image={image} className={classes.cardMedia} />
        <CardContent>
          <Typography variant="h6" color="#18113C">
            {name}
          </Typography>
          <div className={classes.row}>
            <div className={classes.column}>
              <Typography variant="body1" color="#18113C">
                {position}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const RSPHCMB = () => {
  const { data } = useSelector((state) => state.rsphcmb);
  const { teamMembersData } = useSelector((state) => state.teams);
  const history = useHistory();
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <CustomDialog
        open={open}
        title="Add New Team Member"
        handleClose={() => setOpen(false)}
        bodyComponent={<AddTeamMember setOpen={setOpen} />}
      />
      <Container>
        <Button
          onClick={() => history.goBack()}
          startIcon={<ArrowBackIosNew />}
        >
          Back
        </Button>
        <br />
        <br />
        <Typography variant="h6" gutterBottom>
          WHO WE ARE
        </Typography>
        <Divider />
        <br />
        <Grid container spacing={2}>
          <Grid item sm={6} md={5}>
            <Box display="flex" flexDirection="column">
              <img src={data?.image} alt="" />
              <Button
                sx={{ mt: 1, textTransform: "none" }}
                variant="contained"
                onClick={() =>
                  history.push({
                    pathname: "/dashboard/about/rsphcmb/who_we_are_image",
                    state: {
                      image: data?.image,
                    },
                  })
                }
              >
                Update Image
              </Button>
              <br />
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
                <Typography gutterBottom>CONTENT</Typography>
                <IconButton
                  onClick={() =>
                    history.push({
                      pathname: "/dashboard/about/rsphcmb/who_we_are_content",
                      state: {
                        content: data?.who_we_are,
                      },
                    })
                  }
                >
                  <Edit />
                </IconButton>
              </Box>
              <MUIRichTextEditor
                readOnly
                inlineToolbar={false}
                defaultValue={data?.who_we_are}
                toolbar={false}
              />
              <br />
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
          <Typography variant="h6" gutterBottom>
            VISION & MISSION STATEMENT
          </Typography>
          <IconButton
            onClick={() =>
              history.push({
                pathname: "/dashboard/about/rsphcmb/vision_mission_edit",
                state: {
                  vision: data?.vision,
                  mission: data?.mission,
                  image: data?.visionImage,
                },
              })
            }
          >
            <Edit />
          </IconButton>
        </Box>
        <Divider />
        <Grid container spacing={2}>
          <Grid item sm={6} md={7}>
            <br />
            <Box display="flex" flexDirection="column">
              <Typography gutterBottom>VISION STATEMENT</Typography>
              <Typography gutterBottom>{data?.vision}</Typography>
              <br />
              <Typography gutterBottom>MISSION STATEMENT</Typography>
              <MUIRichTextEditor
                readOnly
                inlineToolbar={false}
                defaultValue={data?.mission}
                toolbar={false}
              />
            </Box>
          </Grid>

          <Grid item sm={6} md={5}>
            <br />
            <Box display="flex" flexDirection="column">
              <img src={data?.visionImage} alt="" width={"90%"} />
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
          <Typography variant="h6" gutterBottom>
            GOVERNOR & DEPUTY
          </Typography>
          <IconButton
            onClick={() =>
              history.push({
                pathname: "/dashboard/about/rsphcmb/governor_edit",
                state: {
                  governorName: data?.governorName,
                  governorImage: data?.governorImage,
                  deputyGovName: data?.deputyGovName,
                  deputyGovImage: data?.deputyGovImage,
                },
              })
            }
          >
            <Edit />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          <Grid item sm={6} md={6}>
            <br />
            <Box display="flex" flexDirection="column">
              <Typography fontWeight={"600"} gutterBottom>
                GOVERNOR
              </Typography>
              <img src={data?.governorImage} alt="" width={"75%"} />
              <br />
              <Typography gutterBottom>{data?.governorName}</Typography>
              <Typography gutterBottom>Governor, Rivers State</Typography>
            </Box>
          </Grid>

          <Grid item sm={6} md={6}>
            <br />
            <Box display="flex" flexDirection="column">
              <Typography fontWeight={"600"} gutterBottom>
                DEPUTY GOVERNOR
              </Typography>
              <img src={data?.deputyGovImage} alt="" width={"75%"} />
              <br />
              <Typography gutterBottom>{data?.deputyGovName}</Typography>
              <Typography gutterBottom>
                Deputy Governor, Rivers State
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <br />
        <Divider />
        <br />
        <Box
          display={"flex"}
          flexDirection="row"
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Typography variant="h6">TEAM MEMBERS</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ textTransform: "none" }}
            onClick={() => setOpen(true)}
          >
            Add Member
          </Button>
        </Box>
        <br />
        <Grid
          container
          spacing={{ xs: 2, md: 2 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {teamMembersData?.map((_, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <CardItem
                image={teamMembersData[index]?.image}
                name={teamMembersData[index]?.name}
                id={teamMembersData[index]?.id}
                position={teamMembersData[index]?.position}
                biography={teamMembersData[index]?.biography}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default RSPHCMB;
