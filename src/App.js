import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./utils/history";
import { Container, Footer } from "rsuite";
import MenuBar from "./components/MenuBar";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import Home from "./views/Home";
import UploadImage from "./components/UploadImage";
import Photo from "./views/Photo";
import PhotoView from "./views/PhotoView";
import UserPhotoView from "./components/UserPhotoView";
import SubMap from "./components/SubMap";
import UserPhoto from "./views/UserPhoto";
import Categories from "./views/Categories";
import Heroes from "./views/Heroes";
import SubmarineList from "./views/SubmarineList";
import SubProjects from "./components/SubProjects";

/** import dark css */
// import 'rsuite/dist/styles/rsuite-dark.css';

function App() {
  return (
    <Router history={history}>
      <Container style={{ margin: "0px 20px 0px 20px" }}>
        <MenuBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/photo" exact component={Photo} />
          <Route path="/map" exact component={SubMap} />
          <Route path="/submariners" exact component={Heroes} />
          <Route path="/projects" exact component={SubProjects} />
          <Route path="/submarine/:id" exact component={SubmarineList} />
          <Route path="/photo/:id" exact component={PhotoView} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute exact path="/user/photos">
            <UserPhoto
              apipath="/photo/user"
              target="/user/photos"
              title="Мои фото"
            />
          </PrivateRoute>
          <PrivateRoute exact path="/user/photos/waiting">
            <UserPhoto
              apipath="/photo/review"
              target="/user/photos"
              title="На проверку"
            />
          </PrivateRoute>
          <PrivateRoute exact path="/user/photos/all">
            <UserPhoto
              apipath="/photo/admin"
              target="/user/photos/all"
              title="Фото из песочницы (все пользователи)"
            />
          </PrivateRoute>
          <PrivateRoute path="/user/photos/:id" component={UserPhotoView} />
          <PrivateRoute path="/upload/photo" component={UploadImage} />
          <PrivateRoute path="/categories" component={Categories} />
        </Switch>
        <Footer>Footer</Footer>
      </Container>
    </Router>
  );
}

export default App;
