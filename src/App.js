import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./utils/history";
import { Container, Header, Footer } from "rsuite";
import MenuBar from "./components/MenuBar";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import Home from "./views/Home";
import UploadImage from "./components/UploadImage";
import Photo from "./views/Photo";
import PhotoView from "./views/PhotoView";
import UserPhoto from "./views/UserPhoto";


/** import dark css */
// import 'rsuite/dist/styles/rsuite-dark.css';

function App() {
  return (
      <Router history={history}>
        <Container>
          <Header>
            <MenuBar />
          </Header>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/photo" exact component={Photo} />
              <Route path="/photo/:id" exact component={PhotoView} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/my/photo" component={UserPhoto} />
              <PrivateRoute path="/upload/photo" component={UploadImage} />
            </Switch>
          <Footer>Footer</Footer>
        </Container>
      </Router>
  );
}

export default App;
