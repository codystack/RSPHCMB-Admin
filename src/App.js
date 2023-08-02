import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./presentation/pages/login";
import ForgotPassword from "./presentation/pages/password";
import ProtectedRoute from "./presentation/components/protected_routes";

import { useDispatch } from "react-redux";
import { query, db, collection, onSnapshot, doc, auth } from "./data/firebase/";
import { setUserID } from "./data/redux/slice/user";

import ScrollToTop from "./util/scroll";

import { setTeamData } from "./data/redux/slice/team";
import { setPermSecData } from "./data/redux/slice/perm_sec";
import { setWDCData } from "./data/redux/slice/wdc";
import { setPartnersData } from "./data/redux/slice/partners";
import {
  setResearchData,
  setReportsData,
  setDownloadsData,
  setGalleryData,
} from "./data/redux/slice/resources";
import { setLGAsData } from "./data/redux/slice/lga";
import Dashboard from "./presentation/pages/dashboard";
import DemoPolicy from "./presentation/forms/demo/demo";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    try {
      const user = auth.currentUser;
      if (user) {
        onSnapshot(doc(db, "users", "" + user.uid), (doc) => {
          dispatch(setUserID(user?.uid));
        });
      }
    } catch (err) {
      // console.log(err);
    }
  }, [dispatch]);

  React.useEffect(() => {
    const teamQuery = query(collection(db, "team-members"));
    onSnapshot(teamQuery, (querySnapshot) => {
      const teams = [];
      querySnapshot.forEach((doc) => {
        teams.push(doc.data());
      });
      dispatch(setTeamData(teams));
    });

    const partnersQuery = query(collection(db, "partners"));
    onSnapshot(partnersQuery, (querySnapshot) => {
      const partners = [];
      querySnapshot.forEach((doc) => {
        partners.push(doc.data());
      });
      dispatch(setPartnersData(partners));
    });

    onSnapshot(doc(db, "perm-sec", "info"), (doc) => {
      // console.log("Current data: ", doc.data());
      dispatch(setPermSecData(doc.data()));
    });

    onSnapshot(doc(db, "contents", "wdc"), (doc) => {
      // console.log("Current data: ", doc.data());
      dispatch(setWDCData(doc.data()));
    });

    onSnapshot(doc(db, "resources", "research"), (doc) => {
      // console.log("Current data: ", doc.data());
      dispatch(setResearchData(doc.data()));
    });

    const reportsQuery = query(collection(db, "reports"));
    onSnapshot(reportsQuery, (querySnapshot) => {
      const reports = [];
      querySnapshot.forEach((doc) => {
        reports.push(doc.data());
      });
      dispatch(setReportsData(reports));
    });

    const downloadsQuery = query(collection(db, "downloads"));
    onSnapshot(downloadsQuery, (querySnapshot) => {
      const downloads = [];
      querySnapshot.forEach((doc) => {
        downloads.push(doc.data());
      });
      dispatch(setDownloadsData(downloads));
    });

    const galleryQuery = query(collection(db, "gallery"));
    onSnapshot(galleryQuery, (querySnapshot) => {
      const gallery = [];
      querySnapshot.forEach((doc) => {
        gallery.push(doc.data());
      });
      dispatch(setGalleryData(gallery));
    });

    const LGAsQuery = query(collection(db, "lgas"));
    onSnapshot(LGAsQuery, (querySnapshot) => {
      const lgas = [];
      querySnapshot.forEach((doc) => {
        lgas.push(doc.data());
      });
      dispatch(setLGAsData(lgas));
    });
  });

  return (
    <div className="App">
      <Router>
        <div>
          <ScrollToTop />
          <Switch>
            <Route path="/" exact>
              <Login />
            </Route>
            <Route path="/policia" exact>
              <DemoPolicy />
            </Route>

            <Route path="/forgot-password" exact>
              <ForgotPassword />
            </Route>
            <ProtectedRoute path="/dashboard">
              <Dashboard />
            </ProtectedRoute>
            {/* <Route
              path="//*"
              element={
                <ProtectedRoute>
                  < />
                </ProtectedRoute>
              }
            /> */}
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
