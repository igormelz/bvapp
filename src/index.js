import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import Keycloak from "keycloak-js";
import { KeycloakProvider } from "@react-keycloak/web";
import App from "./App";


const keycloak = new Keycloak({
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  url: process.env.REACT_APP_KEYCLOAK_URL,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
});

const onKeycloakEvent = (event, error) => {
  console.log('onKeycloakEvent', event, error)
}

ReactDOM.render(
  <KeycloakProvider keycloak={keycloak} initConfig={{ onLoad: "check-sso" }} onEvent={onKeycloakEvent}>
    <App />
  </KeycloakProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
