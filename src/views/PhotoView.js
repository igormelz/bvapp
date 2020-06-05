import React, { useEffect, useState } from "react";
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
  Col,
} from "rsuite";
import axios from "axios";
import { useApi } from "../utils/api";
import { useKeycloak } from "@react-keycloak/web";
import "./Photo.css";
import PhotoEditor from "../components/PhotoEditor";
import PhotoPreview from "../components/PhotoPreview";
import PhotoConfirmDelete from "../components/PhotoConfirmDelete";

const Card = (props) => (
  <Panel {...props} header="Photo">
    <Placeholder.Graph width={320} height={240} />
  </Panel>
);

const fmtTime = (str) => {
  const d = new Date(str);
  return d.toLocaleDateString();
};

const PhotoView = () => {
  const [keycloak] = useKeycloak();
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [image, setImage] = useState();
  const [preview, setPreview] = useState();
  const [editor, setEditor] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const axiosInstance = useApi(process.env.REACT_APP_SECURE_API_URL);

  const getData = () => {
    axios
      .get(`${process.env.REACT_APP_PUBLIC_API_URL}/public/photo/${id}`)
      .then((response) => {
        //console.log(response.data);
        setData(response.data.photo[0]);
        setImage(response.data.photo[0].sizes.find((e) => e.type === "m"));
        setLoading(false);
      })
      .catch(() => console.error("no answer"));
  };

  useEffect(() => {
    getData();

    return () => {
      setData([]);
    };
    // eslint-disable-next-line
  }, [id]);

  const canEdit = async () => {
    console.log("CanEdit");
    if (!keycloak.authenticated) {
      Alert.warning("Для внесения изменений необходимо войти");
      return;
    }
    const { sub } = await keycloak.loadUserInfo();
    if (sub !== data.user.id && !keycloak.hasRealmRole("admin")) {
      Alert.warning(
        "Только редактор может редактирать данные другого пользователя"
      );
      return;
    }
    setEditor(data);
  };

  const reloadData = () => {
    setEditor(null);
    getData();
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

  if (loading) {
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
      <FlexboxGrid justify="space-around">
        <FlexboxGrid.Item colspan={24} componentClass={Col} md={8}>
          <Panel style={{ display: "inline-block", width: image.width }}>
            <Whisper
              placement="bottom"
              trigger="hover"
              speaker={<Tooltip>Click to preview</Tooltip>}
            >
              <div
                style={{ cursor: "pointer " }}
                onClick={() =>
                  setPreview(data.sizes.find((e) => e.type === "z"))
                }
              >
                <img src={image.url} height={image.height} alt={data.title} />
              </div>
            </Whisper>
            <Panel>
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item>
                  <div>
                    <div className="slimText">Загружено</div>
                    <div>{fmtTime(data.date)}</div>
                  </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <div>
                    <div className="slimText">Пользователем</div>
                    <div>
                      <Icon icon="user-circle-o" />
                      {" " + data.user.name}
                    </div>
                  </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
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
                        onClick={() => downloadFile(data.url)}
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
                          onClick={() => setConfirm(true)}
                        />
                      </Whisper>
                    )}
                  </ButtonToolbar>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </Panel>
          </Panel>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24} componentClass={Col} md={8}>
          <PanelGroup accordion>
            <Panel header={data.title} defaultExpanded>
              {!data.text && <Placeholder.Paragraph />}
              {data.text && <p>{data.text}</p>}
            </Panel>
            <Panel header="Инофрмация об источнике">
              <Placeholder.Paragraph />
            </Panel>
            <Panel header="Tags">
              <Placeholder.Paragraph />
            </Panel>
          </PanelGroup>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      {editor && (
        <PhotoEditor
          photo={editor}
          onClose={() => setEditor(null)}
          onSubmit={reloadData}
        />
      )}
      {confirm && (
        <PhotoConfirmDelete
          onConfirm={canDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
      {preview && (
        <PhotoPreview
          title={data.title}
          image={preview}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
};

export default PhotoView;
