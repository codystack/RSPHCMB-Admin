import React from "react";
import { Drawer as MUIDrawer } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DashBoardIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from "@mui/styles";
import logo from "../../../../assets/images/logo_white.svg";

import { useSnackbar } from "notistack";
import Skeleton from "@mui/material/Skeleton";

import { auth } from "../../../../data/firebase";
import { useDispatch } from "react-redux";
import { setMyData } from "../../../../data/redux/slice/user";
import {
  ContactMail,
  ContactSupportOutlined,
  Help,
  Home,
  Interests,
  Lan,
  Logout,
  Person,
} from "@mui/icons-material";

// import pattern from "../../../../assets/images/pattern.png";

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
    backgroundColor: "#18113C",
  },
  toolbar: theme.mixins.toolbar,
  listRoot: {
    width: "86%",
    padding: theme.spacing(1),
  },
}));

const ListItema = withStyles({
  root: {
    "&$selected": {
      backgroundColor: "#FFFFFF",
      color: "black",
    },
    "&$selected:hover": {
      backgroundColor: "#221B44",
      color: "black",
    },
    "&:hover": {
      backgroundColor: "#00B0EF",
      color: "white",
    },
  },
  selected: {},
})(ListItem);

const Drawer2 = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedIndex2, setSelectedIndex2] = React.useState(0);
  // const { userStatus, userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // const container =
  //   props.window !== undefined ? () => window().document.body : undefined;

  const drawerItems = [
    {
      text: "Overview",
      icon: (
        <DashBoardIcon
          style={selectedIndex === 0 ? { color: "black" } : { color: "white" }}
        />
      ),
      to: "/dashboard/",
    },
    {
      text: "Home",
      icon: (
        <Home
          style={selectedIndex === 1 ? { color: "black" } : { color: "white" }}
        />
      ),
      to: "/dashboard/home",
    },
    {
      text: "About",
      icon: (
        <Help
          style={selectedIndex === 2 ? { color: "black" } : { color: "white" }}
        />
      ),
      to: "/dashboard/about",
    },
    {
      text: "Services",
      icon: (
        <Lan
          style={selectedIndex === 3 ? { color: "black" } : { color: "white" }}
        />
      ),
      to: "/dashboard/services",
    },
    {
      text: "Resources",
      icon: (
        <Interests
          style={selectedIndex === 4 ? { color: "black" } : { color: "white" }}
        />
      ),
      to: "/dashboard/resources",
    },
    {
      text: "Contact",
      icon: (
        <ContactMail
          style={selectedIndex === 5 ? { color: "black" } : { color: "white" }}
        />
      ),
      to: "/dashboard/contact",
    },
    // {
    //   text: "Others",
    //   icon: (
    //     <AddCircleOutline
    //       style={selectedIndex === 6 ? { color: "black" } : { color: "white" }}
    //     />
    //   ),
    //   to: "/dashboard/others",
    // },
    {
      text: "Users",
      icon: (
        <PeopleOutlinedIcon
          style={selectedIndex === 6 ? { color: "black" } : { color: "white" }}
        />
      ),
      to: "/dashboard/users",
    },
    {
      text: "Enquiries",
      icon: (
        <ContactSupportOutlined
          style={selectedIndex === 7 ? { color: "black" } : { color: "white" }}
        />
      ),
      to: "/dashboard/enquiries",
    },
  ];

  const subDrawerItems = [
    {
      text: "Account",
      icon: (
        <Person
          style={selectedIndex2 === 0 ? { color: "white" } : { color: "black" }}
        />
      ),
      to: "/dashboard/account",
    },
    {
      text: "Log out",
      icon: (
        <Logout
          style={selectedIndex2 === 1 ? { color: "white" } : { color: "red" }}
        />
      ),
      to: "/dashboard/",
    },
  ];

  const handleListItemClick = (to, index) => {
    history.push(to);
    setSelectedIndex(index);
  };

  const handleListItemClick2 = (to, index) => {
    history.push(to);
    setSelectedIndex2(index);
  };

  const signOut = async () => {
    props.handleBackdrop(true);
    try {
      await auth.signOut();
      dispatch(setMyData(null));
      props.handleBackdrop(false);
      enqueueSnackbar(`Successfully logged out`, { variant: "success" });
      history.replace({
        pathname: "/",
      });
    } catch (err) {
      enqueueSnackbar(`${err?.message || "Check your internet connection."}`, {
        variant: "error",
      });
    } finally {
      history.go(0);
    }
  };

  const myDrawer = (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        // backgroundImage: "url(" + pattern + ")",
        // backgroundRepeat: "no-repeat",
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        zIndex: 100,
      }}
    >
      <br />
      <Divider />
      <div
        className={classes.toolbar}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={logo}
          style={{ width: "75%", margin: "auto" }}
          alt="site logo"
        />
      </div>
      <Divider />
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <List className={classes.listRoot}>
          {drawerItems.map((item, index) => {
            const { text, icon, to } = item;
            if (4 > 2) {
              return (
                <ListItema
                  button
                  key={index}
                  selected={selectedIndex === index}
                  onClick={() => handleListItemClick(to, index)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItema>
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

      <div
        style={{
          flexDirection: "column",
          marginTop: "auto",
          marginRight: "auto",
          justifyContent: "left",
          alignItems: "start",
          width: "100%",
          padding: 16,
          zIndex: 1000,
        }}
      >
        <List className={classes.listRoot}>
          {subDrawerItems.map((item, index) => {
            const { text, icon, to } = item;
            if (2 > 1) {
              return (
                <ListItem
                  sx={{ width: "96%" }}
                  button
                  key={index}
                  selected={selectedIndex2 === index}
                  onClick={() =>
                    index === 0 ? handleListItemClick2(to, index) : signOut()
                  }
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText
                    primary={text}
                    color="white"
                    sx={{ color: index === 0 ? "white" : "red" }}
                  />
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
      variant="permanent"
      open
      classes={{ paper: classes.drawerPaper }}
    >
      {myDrawer}
    </MUIDrawer>
  );
};

export default Drawer2;
