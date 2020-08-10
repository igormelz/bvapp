import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  Content,
  FlexboxGrid,
  Panel,
  Placeholder,
  Icon,
  Header,
  Button,
  IconButton,
  ButtonToolbar,
  Alert,
  Col,
  Navbar,
  Nav,
} from "rsuite";
import { downloadFile } from "../utils/helper";
import axios from "axios";
import { useAuthApi } from "../utils/authApi";
import { useKeycloak } from "@react-keycloak/web";
import PhotoEditor from "../components/PhotoEditor";
import PhotoPreview from "../components/PhotoPreview";
import PhotoConfirmDelete from "../components/PhotoConfirmDelete";
import { NavLink } from "../components/NavLink";

const slimText = {
  fontSize: "0.8em",
  color: "#97969b",
  fontWeight: "lighter",
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
  const authApi = useAuthApi();

  const getData = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/photo/${id}`)
      .then((response) => {
        //console.log(response.data);
        setData(response.data.photo[0]);
        setImage(response.data.photo[0].sizes.find((e) => e.type === "z"));
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
        "Только редактор может изменить данные другого пользователя"
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
    authApi
      .delete(`/photo/${id}`)
      .then(() => {
        Alert.info("Записи успешно удалены");
        history.push("/photo");
      })
      .catch((error) => {
        Alert.error(error);
      });
  };

  if (loading) {
    return (
      <Container style={{ margin: "auto", padding: "20px 60px 20px 60px" }}>
        <Placeholder.Paragraph
          style={{ marginTop: 30 }}
          graph="image"
          rows={5}
        />
      </Container>
    );
  }

  return (
    <Container style={{ margin: "auto" }}>
      <Header>
        <Navbar>
          <Navbar.Header>
            <div style={{ padding: "18px 20px", fontWeight: "bolder", overflow: 'hidden' }}>
              <Icon icon="image" /> {data.title}
            </div>
          </Navbar.Header>
          <Navbar.Body>
            <Nav pullRight>
              <NavLink
                href="/my/photo"
                icon={<Icon icon="chevron-circle-left" />}
              >
                К списку
              </NavLink>
              <Nav.Item icon={<Icon icon="edit" />}>Редактировать</Nav.Item>
              <Nav.Item icon={<Icon icon="check-square" />}>
                Опубликовать
              </Nav.Item>
            </Nav>
          </Navbar.Body>
        </Navbar>
      </Header>
      <Content style={{ padding: "20px" }}>
        <FlexboxGrid justify="space-around">
          <FlexboxGrid.Item
            componentClass={Col}
            colspan={24}
            md={12}
            style={{ display: "inline-block" }}
          >
            <img
              src={image.url}
              alt={data.title}
              style={{ maxWidth: "100%", margin: "auto" }}
            />
            <Button
              appearance="subtle"
              style={{ paddingTop: "10px" }}
              onClick={() => downloadFile(data.url)}
            >
              <Icon icon="download" /> Получить оригинал{" "}
              <span style={slimText}>
                ({data.width} x {data.height} px)
              </span>
            </Button>
            <Panel header="Лицензия">
              <a
                rel="license"
                href="http://creativecommons.org/licenses/by/4.0/"
              >
                <img
                  alt="Лицензия Creative Commons"
                  src="https://i.creativecommons.org/l/by/4.0/88x31.png"
                />
              </a>
              <br />
              Это произведение доступно по{" "}
              <a
                rel="license"
                href="http://creativecommons.org/licenses/by/4.0/"
              >
                лицензии Creative Commons «Attribution» («Атрибуция») 4.0
                Всемирная
              </a>
              .
            </Panel>
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item>
                <ButtonToolbar>
                  <IconButton
                    icon={<Icon icon="edit" />}
                    onClick={canEdit}
                    disabled={!keycloak.authenticated}
                  />
                  {keycloak.authenticated && keycloak.hasRealmRole("admin") && (
                    <IconButton
                      icon={<Icon icon="trash-o" />}
                      onClick={() => setConfirm(true)}
                    />
                  )}
                </ButtonToolbar>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
            <Panel header="Описание">
              <p>{data.text}</p>
            </Panel>
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
      </Content>
    </Container>
  );
};

export default PhotoView;
