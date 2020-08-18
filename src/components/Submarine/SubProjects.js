import React, { useState, useCallback, useEffect } from "react";
import {
  Panel,
  FlexboxGrid,
  IconButton,
  List,
  Icon,
  Whisper,
  Tooltip,
} from "rsuite";
import ProjectEdit from "./ProjectEdit";
import EditSub from "./EditSub";
import axios from "axios";

const slimText = {
  fontSize: "0.8em",
  fontWeight: "lighter",
  color: "#97969B",
  paddingBottom: 5,
  height: 24,
};
// const styleCenter = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// };

const SubProjects = () => {
  const [projects, setProjects] = useState([]);
  const [editProject, setEditProject] = useState();
  const [newSub, setNewSub] = useState();

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
  }, [viewProjects]);

  const addsub = (
    <Tooltip>
      Добавить лодку на сайт
    </Tooltip>
  );
  
  const edp = (
    <Tooltip>
      Редактировать проект
    </Tooltip>
  );

  return (
    <Panel
      header={
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item>
            <span style={{fontSize: '16px'}}>Проекты (типы) ПЛ</span>
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
                  {p.label}{" "}
                  <Whisper placement="bottom" speaker={edp}>
                    <IconButton
                      icon={<Icon icon="edit" />}
                      appearance="subtle"
                      onClick={() => setEditProject(p)}
                    />
                  </Whisper>
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={5}>
                <div>
                  <div style={slimText}>Серии</div>
                  <div style={{ padding: "8px 0px" }}>
                    {p.seriesList.join(", ")}
                  </div>
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={2}>
                <div>
                  <div style={slimText}>Построено</div>
                  <div style={{ padding: "8px 0px" }}>{p.built}</div>
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={2}>
                <div>
                  <div style={slimText}>На сайте</div>
                  <div>
                    {p.c}{" "}
                    <Whisper
                      speaker={addsub}
                      placement="auto"
                      trigger="hover"
                      key={i}
                    >
                      <IconButton
                        icon={<Icon icon="plus-circle" />}
                        appearance="subtle"
                        onClick={() => setNewSub(p)}
                      />
                    </Whisper>
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
          onSubmit={() => viewProjects()}
        />
      )}
      {newSub && (
        <EditSub
          sub={{}}
          project={newSub}
          onClose={() => setNewSub(null)}
          onSubmit={() => viewProjects()}
        />
      )}
    </Panel>
  );
};

export default SubProjects;
