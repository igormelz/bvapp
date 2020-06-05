import React, { useEffect, useState, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  FlexboxGrid,
  Panel,
  Placeholder,
  Icon,
  Tooltip,
  Whisper,
  IconButton,
  PanelGroup,
  ButtonToolbar,
  Alert,
} from "rsuite";
import axios from "axios";
import { useApi } from "../utils/api";
import { useKeycloak } from "@react-keycloak/web";
import "./Photo.css";
import PhotoEditor from "../components/PhotoEditor";
import PhotoConfirmDelete from "../components/PhotoConfirmDelete";

const Card = (props) => (
  <Panel {...props} header="Photo">
    <Placeholder.Graph width={320} height={240} />
  </Panel>
);

const fmtTime = (str) => {
  const d = new Date(str * 1000);
  return d.toLocaleDateString();
};

const initState = {
  loading: true,
  photo: {},
};


const reducer = (state, action) => {
  switch(action.type) {
    case 'start': 
    return { ...state, loading: true };
    case 'update':
      return { ...state, loading: false, photo: action.payload };
    default: 
      return state;
  }
};

const PhotoView = () => {
  const [keycloak] = useKeycloak();
  const history = useHistory();
  const { id } = useParams();
  const [ state, dispatch ] = useReducer(reducer, initState);
  //const [loading, setLoading] = useState(true);
  //const [data, setData] = useState();
  const [editor, setEditor] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const axiosInstance = useApi("https://api.balticvaryag.ru");


  const getData = () => {
    dispatch({ type: 'start'});
    axios
      .get(`https://api.balticvaryag.ru/public/photo/${id}`)
      .then((response) => {
        dispatch({ type: 'update', payload: response.data.photo[0] });
      })
      .catch(() => console.error("no answer"));
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [id]);

  const canEdit = async () => {
    console.log("CanEdit");
    if (!keycloak.authenticated) {
      Alert.warning("Для внесения изменений необходимо войти");
      return;
    }
    const { sub } = await keycloak.loadUserInfo();
    if (sub !== state.photo.user.id && !keycloak.hasRealmRole("admin")) {
      Alert.warning(
        "Только редактор может редактирать данные другого пользователя"
      );
      return;
    }
    setEditor(state.photo);
  };

  const canDelete = () => {
    setConfirm(null);
    axiosInstance
      .delete(`/secure/photo/${id}`)
      .then(() => {
        Alert.info("Записи успешно удалены");
        history.push("/photos");
      })
      .catch((error) => {
        Alert.error(error);
      });
  };

  const downloadFile = async (url) => {
    const fileName = url.substring(url.lastIndexOf("/") + 1);
    const { data } = await axios.get(url, { responseType: "blob" });
    const blob = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = blob;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  if (state.loading) {
    return (
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item colspan={6}>
          <Card />
        </FlexboxGrid.Item>
      </FlexboxGrid>
    );
  }

  // const pStyle = {
  //   display: "inline-block",
  //   //backgroundImage: 'url(' + data.img[0].url + ')',
  //   width: data.img[0].width,
  // };

  return (
    <div style={{ margin: 20 }}>
      {/* photo */}
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item>
          <Panel
            shaded
            style={{ display: "inline-block", width: state.photo.img[0].width }}
          >
            <img
              src={state.photo.img[0].url}
              height={state.photo.img[0].height}
              alt={state.photo.title}
            />
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      {/* text */}
      <FlexboxGrid justify="space-around">
        <FlexboxGrid.Item colspan={18}>
          <PanelGroup accordion>
            <Panel header={state.photo.title} defaultExpanded>
              {!state.photo.text && <Placeholder.Paragraph />}
              {state.photo.text && <p>{state.photo.text}</p>}
            </Panel>
            <Panel header="Источник">
              <Placeholder.Paragraph />
            </Panel>
            <Panel header="Лицензия">
              <Placeholder.Paragraph />
            </Panel>
          </PanelGroup>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={3}>
          <div>
            <div className="slimText">Загружено</div>
            <div>{fmtTime(state.photo.date)}</div>
            <div className="slimText">Пользователем</div>
            <div>
              <Icon icon="user-circle-o" />
              {" " + state.photo.user.name}
            </div>
            <div style={{ paddingTop: 5 }}>
              <ButtonToolbar>
                <Whisper
                  trigger="hover"
                  preventOverflow
                  placement="autoVertical"
                  speaker={
                    <Tooltip>
                      {keycloak.authenticated
                        ? "Редактировать описание"
                        : "Для редактирования войдите на сайт"}
                    </Tooltip>
                  }
                >
                  <IconButton
                    icon={<Icon icon="edit" />}
                    onClick={canEdit}
                    circle
                    disabled={!keycloak.authenticated}
                  />
                </Whisper>
                <Whisper
                  placement="autoVertical"
                  trigger="hover"
                  preventOverflow
                  speaker={<Tooltip>Загрузить оригинал</Tooltip>}
                >
                  <IconButton
                    icon={<Icon icon="download" />}
                    onClick={() => downloadFile(state.photo.location)}
                    circle
                  />
                </Whisper>
                {keycloak.authenticated && keycloak.hasRealmRole("admin") && (
                  <Whisper
                    placement="autoVertical"
                    trigger="hover"
                    preventOverflow
                    speaker={<Tooltip>Удалить</Tooltip>}
                  >
                    <IconButton
                      icon={<Icon icon="trash-o" />}
                      circle
                      onClick={() => setConfirm(true)}
                    />
                  </Whisper>
                )}
              </ButtonToolbar>
            </div>
          </div>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      {editor && (
        <PhotoEditor
          photo={editor}
          onClose={() => setEditor(null)}
          onSubmit={() => setEditor(null) && getData()}
        />
      )}
      {confirm && (
        <PhotoConfirmDelete
          onConfirm={canDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

export default PhotoView;
