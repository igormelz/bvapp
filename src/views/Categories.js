import React from "react";
import { createClient, Provider } from 'urql';
import {
  Container,
  Content,
  Nav,
  Icon,
  Sidebar,
  Sidenav,
} from "rsuite";

import HistEpoch from "../components/Types/HistEpoch";
import SubProjects from "../components/Submarine/SubProjects";
import Submarines from "../components/Submarine/Submarines";
import { NavLink } from "../components/NavLink";
import { Switch, Route } from "react-router-dom";
import Fleet from "../components/Types/Fleet";

const headerStyles = {
  padding: 18,
  fontSize: 16,
  height: 56,
  background: "#34c3ff",
  color: " #fff",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const client = createClient({
  url: 'http://83.68.33.151:8080/graphql',
});


const Categories = () => (
  <Provider value={client}>
  <Container>
    <Sidebar style={{ display: "flex", flexDirection: "column" }} width={200}>
      <Sidenav.Header>
        <div style={headerStyles}>Справочники</div>
      </Sidenav.Header>
      <Sidenav appearance="subtle">
        <Sidenav.Body>
          <Nav>
            <NavLink href="/admin/epoch" icon={<Icon icon="calendar" />} eventKey="1">
              Эпохи
            </NavLink>
            <NavLink href="/admin/project" icon={<Icon icon="tasks" />} eventKey="2">
              Проекты
            </NavLink>
            <NavLink href="/admin/submarines" icon={<Icon icon="ship" />} eventKey="3">
              Лодки
            </NavLink>
            <NavLink href="/admin/fleet" icon={<Icon icon="ship" />} eventKey="4">
              Флоты
            </NavLink>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
    <Content>
      <Switch>
        <Route path="/admin/epoch" exact component={HistEpoch}/>
        <Route path="/admin/project" exact component={SubProjects}/>
        <Route path="/admin/submarines" exact component={Submarines}/>
        <Route path="/admin/fleet" exact component={Fleet}/>
      </Switch>
    </Content>
  </Container>
  </Provider>
);

export default Categories;
