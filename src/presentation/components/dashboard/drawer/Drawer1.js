import React from "react";
import { Drawer as MUIDrawer } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DashBoardIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
// import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import logo from "../../../../assets/images/logo_white.svg";

// import { useSnackbar } from "notistack";
import Skeleton from "@mui/material/Skeleton";

// import { auth } from "../../../../data/firebase";
// import { useDispatch } from "react-redux";
// import { setUserData, setMyData } from "../../../../data/redux/slice/user";
import { Logout, Settings } from "@mui/icons-material";

const drawerWidth = 270;
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: "275px",
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  listRoot: {
    width: "100%",
    padding: theme.spacing(1),
  },
}));

const Drawer1 = (props) => {
  const classes = useStyles();
  const { mobileOpen, setMobileOpen } = props;
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  // const dispatch = useDispatch();
  const history = useHistory();
  // const { enqueueSnackbar } = useSnackbar();

  const container =
    props.window !== undefined ? () => window().document.body : undefined;

  const drawerItems = [
    {
      text: "Overview",
      icon: (
        <DashBoardIcon
          style={selectedIndex === 0 ? { color: "#white" } : { color: "black" }}
        />
      ),
      to: "/dashboard/",
    },
    {
      text: "Home",
      icon: (
        <SchoolOutlinedIcon
          style={selectedIndex === 1 ? { color: "white" } : { color: "black" }}
        />
      ),
      to: "/dashboard/home",
    },
    {
      text: "About",
      icon: (
        <PeopleOutlinedIcon
          style={selectedIndex === 2 ? { color: "white" } : { color: "black" }}
        />
      ),
      to: "/dashboard/about",
    },
    {
      text: "Services",
      icon: (
        <PersonOutlineIcon
          style={
            selectedIndex === 3 ? { color: "#4C3992" } : { color: "black" }
          }
        />
      ),
      to: "/dashboard/services",
    },
    {
      text: "Resources",
      icon: (
        <PersonOutlineIcon
          style={
            selectedIndex === 3 ? { color: "#4C3992" } : { color: "black" }
          }
        />
      ),
      to: "/dashboard/resources",
    },
    {
      text: "Contact",
      icon: (
        <PersonOutlineIcon
          style={
            selectedIndex === 3 ? { color: "#4C3992" } : { color: "black" }
          }
        />
      ),
      to: "/dashboard/contact",
    },
    {
      text: "Others",
      icon: (
        <PersonOutlineIcon
          style={
            selectedIndex === 3 ? { color: "#4C3992" } : { color: "black" }
          }
        />
      ),
      to: "/dashboard/others",
    },
    {
      text: "Users",
      icon: (
        <PersonOutlineIcon
          style={selectedIndex === 3 ? { color: "black" } : { color: "white" }}
        />
      ),
      to: "/dashboard/users",
    },
    {
      text: "Enquiries",
      icon: (
        <PersonOutlineIcon
          style={selectedIndex === 3 ? { color: "black" } : { color: "white" }}
        />
      ),
      to: "/dashboard/enquiries",
    },
  ];

  const subDrawerItems = [
    {
      text: "Account",
      icon: (
        <Settings
          style={selectedIndex === 9 ? { color: "white" } : { color: "black" }}
        />
      ),
      to: "/dashboard/settings",
    },
    {
      text: "Log out",
      icon: (
        <Logout
          style={selectedIndex === 10 ? { color: "white" } : { color: "black" }}
        />
      ),
      to: "/dashboard/",
    },
  ];

  const handleListItemClick = (to, index) => {
    history.push(to);
    setSelectedIndex(index);
    setMobileOpen(!mobileOpen);
  };

  // const signOut = async () => {
  //   props.handleBackdrop(true);
  //   // try {
  //   //   await auth.signOut();
  //   //   dispatch(setUserData(null));
  //   //   props.handleBackdrop(false);
  //   //   enqueueSnackbar(`Successfully logged out`, { variant: "success" });
  //   //   history.replace({
  //   //     pathname: "/login",
  //   //   });
  //   // } catch (err) {
  //   //   enqueueSnackbar(`${err?.message || "Check your internet connection."}`, {
  //   //     variant: "error",
  //   //   });
  //   // }
  //   // finally {
  //   //   history.go(0);
  //   // }
  // };

  const myDrawer = (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className={classes.toolbar}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <a href="/">
          <img src={logo} style={{ width: 100 }} alt="site logo" />
        </a>
      </div>

      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <List className={classes.listRoot}>
          {drawerItems.map((item, index) => {
            const { text, icon, to } = item;
            if (2 > 1) {
              return (
                <ListItem
                  button
                  key={index}
                  selected={selectedIndex === index}
                  onClick={() => handleListItemClick(to, index)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              );
            } else {
              return (
                <Skeleton
                  key={index}
                  component="li"
                  variant="rect"
                  animation="wave"
                  height={30}
                  style={{ margin: 10 }}
                />
              );
            }
          })}
        </List>
      </div>
      <br />
      <div
        style={{
          flexDirection: "column",
          marginTop: "auto",
          marginRight: "auto",
          justifyContent: "left",
          alignItems: "start",
          padding: 16,
        }}
      >
        <Divider />
        <List className={classes.listRoot}>
          {subDrawerItems.map((item, index) => {
            const { text, icon, to } = item;
            if (2 > 1) {
              return (
                <ListItem
                  button
                  key={index}
                  selected={selectedIndex === index}
                  onClick={() => handleListItemClick(to, index)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              );
            } else {
              return (
                <Skeleton
                  key={index}
                  component="li"
                  variant="rect"
                  animation="wave"
                  height={30}
                  style={{ margin: 10 }}
                />
              );
            }
          })}
        </List>
      </div>
    </div>
  );

  return (
    <MUIDrawer
      variant={props.drawerVariant}
      container={container}
      className={classes.drawer}
      anchor={props.anchor}
      open={mobileOpen}
      onClose={props.handleDrawerToggle}
      classes={{ paper: classes.drawerPaper }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {myDrawer}
    </MUIDrawer>
  );
};

export default Drawer1;
