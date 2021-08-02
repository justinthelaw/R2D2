import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./auth";
import Cookies from "js-cookie";

export default function ProtectedRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        //if (auth.isAuthenticated()) {
        if (true) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
}
