import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (!initialized || keycloak.authenticated) {
      return;
    }
    keycloak.login({ redirectUri: window.location.pathname });
    // eslint-disable-next-line
  }, [keycloak, path]);

  const render = (props) =>
    keycloak.authenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
