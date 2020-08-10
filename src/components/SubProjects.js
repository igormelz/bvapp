import React, { useState, useCallback, useEffect } from "react";
import { Panel, FlexboxGrid, IconButton, List, Icon, Button } from "rsuite";
import ProjectEdit from "../components/ProjectEdit";
import axios from "axios";

const slimText = {
  fontSize: "0.8em",
  fontWeight: "lighter",
  color: "#97969B",
  paddingBottom: 5,
  height: 24,
};
const styleCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SubProjects = () => {
  const [projects, setProjects] = useState([]);
  const [editProject, setEditProject] = useState();

  const viewProjects = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/project`)
      .then((response) => {
        setProjects(response.data.project);
      })
      .catch((e) => console.log("err project:" + e));
  }, []);

  useEffect(() => {
    viewProjects();
  }, []);

  return (
    <Panel
      header={
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item>
            <span style={{ fontSize: "1.2em" }}>Проекты (типы) ПЛ</span>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <IconButton
              icon={<Icon icon="plus-circle" />}
              placement="left"
              onClick={() => setEditProject(true)}
            >
              Добавить проект
            </IconButton>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      }
    >
      <List bordered hover>
        {projects.map((p, i) => (
          <List.Item key={i}>
            <FlexboxGrid>
              <FlexboxGrid.Item colspan={4}>
                <div>
                  <div style={slimText}>Проект</div>
                  <Button appearance="link" onClick={() => setEditProject(p)}>
                    {p.label}
                  </Button>
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={4}>
                <div>
                  <div style={slimText}>Серии</div>
                  <div style={{ padding: "8px 0px" }}>
                    {p.seriesList.join(", ")}
                  </div>
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={2} style={{ ...styleCenter }}>
                <div>
                  <div style={slimText}>Построено (в БД)</div>
                  <div style={{ padding: "8px 0px" }}>
                    {p.built}
                    <span style={{ padding: 5 }}>|</span>
                    {p.c}
                  </div>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
        ))}
      </List>
      {editProject && (
        <ProjectEdit
          project={editProject}
          onClose={() => setEditProject(null)}
        />
      )}
    </Panel>
  );
};

export default SubProjects;
