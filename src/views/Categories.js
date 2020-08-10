import React, { useState, useCallback } from "react";
import {
  Container,
  Content,
  Nav,
  Icon,
  Sidebar,
  Sidenav,
  Tree,
  Panel,
} from "rsuite";
import axios from "axios";
import EditEpoch from "../components/EditEpoch";

import SubProjects from "../components/SubProjects";

const headerStyles = {
  padding: 18,
  fontSize: 16,
  height: 56,
  background: "#34c3ff",
  color: " #fff",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const Categories = () => {
  const [showProjects, setShowProjects] = useState(false);
  const [showEpoch, setShowEpoch] = useState(false);
  const [epoch, setEpoch] = useState();
  const [editEpoch, setEditEpoch] = useState();

  const viewEpoch = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/epoch`)
      .then((response) => {
        setEpoch(response.data.epoch);
        setShowProjects(false);
        setShowEpoch(true);
      })
      .catch((e) => console.log("err epoch:" + e));
  }, []);

  const canEditEpoch = (epoch) => {
    setEditEpoch(epoch);
  };

  return (
    <Container>
      <Sidebar style={{ display: "flex", flexDirection: "column" }} width={200}>
        <Sidenav.Header>
          <div style={headerStyles}>Справочники</div>
        </Sidenav.Header>
        <Sidenav appearance="subtle">
          <Sidenav.Body>
            <Nav>
              <Nav.Item
                icon={<Icon icon="ship" />}
                eventKey="1"
                onClick={() => {
                  setShowEpoch(false);
                  setShowProjects(true);
                }}
              >
                Типы подлодок
              </Nav.Item>
              <Nav.Item
                icon={<Icon icon="calendar" />}
                onClick={viewEpoch}
                eventKey="2"
              >
                Эпохи
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </Sidebar>
      <Content>
        {showEpoch && (
          <Panel header="Исторические эпохи">
            <Tree
              data={epoch}
              defaultExpandAll
              cascade={false}
              valueKey="uid"
              onSelect={(node) => canEditEpoch(node)}
            />
          </Panel>
        )}
        {showProjects && <SubProjects />}
      </Content>
      {editEpoch && (
        <EditEpoch epoch={editEpoch} onClose={() => setEditEpoch(null)} />
      )}
    </Container>
  );
};

export default Categories;
