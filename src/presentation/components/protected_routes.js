import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, ...rest }) {
  let { myData } = useSelector((state) => state.user);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (myData) {
          return children;
        } else {
          return <Redirect to={{ pathname: "/", state: { from: location } }} />;
        }
      }}
    />
  );
}
