import React from "react";
import MenuBar from "./components/MenuBar";
import { Router, Route, Switch } from "react-router-dom";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import Home from "./views/Home";
import PingApi from "./views/PingApi";
import UploadImage from "./components/UploadImage";
import Photos from "./views/Photos";
import PhotoView from "./views/PhotoView";

import { Container, Header, Content, Footer } from "rsuite";

import "rsuite/dist/styles/rsuite-dark.css";

function App() {
  return (
      <Router history={history}>
        <Container>
          <Header>
            <MenuBar />
          </Header>
          <Content>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/photos" exact component={Photos} />
              <Route path="/photo/:id" exact component={PhotoView} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/pingapi" component={PingApi} />
              <PrivateRoute path="/upload/photo" component={UploadImage} />
            </Switch>
          </Content>
          <Footer>Footer</Footer>
        </Container>
      </Router>
  );
}

export default App;
