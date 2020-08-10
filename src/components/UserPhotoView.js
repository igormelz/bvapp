import React, { useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import {
  Container,
  Content,
  FlexboxGrid,
  Placeholder,
  Icon,
  Header,
  Divider,
  Alert,
  Col,
  Navbar,
  Nav,
  Dropdown,
  Notification,
} from "rsuite";
import axios from "axios";
import { useAuthApi } from "../utils/authApi";
import { useKeycloak } from "@react-keycloak/web";
import PhotoPreview from "./PhotoPreview";
import PhotoEditor from "./PhotoEditor";
import PhotoConfirmDelete from "./PhotoConfirmDelete";
import PhotoConfirmPublish from "./PhotoConfirmPublish";

const slimText = {
  fontSize: "0.8em",
  color: "#97969b",
  fontWeight: "lighter",
};

const PhotoView = () => {
  const [keycloak] = useKeycloak();
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState();
  const [image, setImage] = useState();
  const [editable, setEditable] = useState(true);
  const [preview, setPreview] = useState();
  const [confirm, setConfirm] = useState(null);
  const [publish, setPublish] = useState(null);
  const authApi = useAuthApi();

  const showStatus = (status) => {
    if (status === 1) {
      Notification.info({
        title: "Статус",
        placement: "bottomStart",
        description: "В ожидании проверки редакторами",
      });
    } else if (status === 2) {
      Notification.success({
        title: "Статус",
        placement: "bottomStart",
        description: "Опубликован",
      });
    } else {
      Notification.warning({
        title: "Статус",
        placement: "bottomStart",
        description: "Черновик. Заполните мета данные для публикации",
      });
    }
  };

  const getPhoto = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/photo/${id}`)
      .then((response) => {
        //console.log(response.photo);
        setPhoto(response.data.photo[0]);
        setImage(response.data.photo[0].sizes.find((e) => e.type === "z"));
        showStatus(response.data.photo[0].status);
        if (
          response.data.photo[0].status === 1 ||
          response.data.photo[0].status === 2
        ) {
          setEditable(false);
        }
        setLoading(false);
      })
      .catch(() => console.error("no answer"));
  };

  useEffect(() => {
    getPhoto();
    return () => {
      setPhoto([]);
    };
    // eslint-disable-next-line
  }, [id]);

  // const canEdit = async () => {
  //   console.log("CanEdit");
  //   if (!keycloak.authenticated) {
  //     Alert.warning("Для внесения изменений необходимо войти");
  //     return;
  //   }
  //   const { sub } = await keycloak.loadUserInfo();
  //   if (sub !== data.user.id && !keycloak.hasRealmRole("admin")) {
  //     Alert.warning(
  //       "Только редактор может изменить данные другого пользователя"
  //     );
  //     return;
  //   }
  //   setEditor(data);
  // };

  // const reloadData = () => {
  //   setEditor(null);
  //   getData();
  // };

  const goBack = () => {
    if (location.state && location.state.target) {
    history.push(location.state.target, location.state );
    } else {
      history.push("/user/photos");
    }
  }

  // const addReview = () => {
  //   authApi
  //     .post("/photo/review", {
  //       comment: "готово к проверке",
  //       uid: id,
  //     })
  //     .then(() => {
  //       console.log("SUCCESS");
  //       Alert.info("Изменения сохранены");
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       Alert.error("Something wrong");
  //     });
  // };

  const canReview = () => {
    setPublish(null);
    authApi
      .put(`/photo/ready/${id}`)
      .then(() => {
        Alert.info("Фото в ожидании проверки другими пользователями");
        history.goBack();
      })
      .catch((error) => {
        Alert.error(error);
      });
  };

  const canPublish = () => {
    setPublish(null);
    authApi
      .put(`/photo/publish/${id}`)
      .then(() => {
        Alert.info("Фото опубликовано");
        history.goBack();
      })
      .catch((error) => {
        Alert.error(error);
      });
  };

  const canDelete = () => {
    setConfirm(null);
    authApi
      .delete(`/photo/${id}`)
      .then(() => {
        Alert.info("Записи успешно удалены");
        history.goBack();
      })
      .catch((error) => {
        Alert.error(error);
      });
  };

  if (loading) {
    return (
      <Container style={{ padding: "20px 60px 20px 60px" }}>
        <Placeholder.Paragraph
          style={{ marginTop: 30 }}
          graph="image"
          rows={5}
        />
      </Container>
    );
  }

  return (
    <Container style={{ padding: "20px 60px 20px 60px" }}>
      <Header>
        <Navbar>
          <Navbar.Body>
            <Nav>
              <Nav.Item
                onClick={goBack}
                icon={<Icon icon="chevron-circle-left" />}
              >
              К списку
              </Nav.Item>
            </Nav>
            <Nav pullRight>
              {!editable && (
                <Nav.Item
                  icon={<Icon icon="edit" />}
                  onClick={() => setEditable(true)}
                >
                  Редактировать
                </Nav.Item>
              )}
              {!keycloak.hasRealmRole("admin") &&
                (!photo.status || photo.status === 0) && (
                  <Nav.Item
                    icon={<Icon icon="search-peoples" />}
                    onClick={canReview}
                  >
                    На проверку
                  </Nav.Item>
                )}
              {keycloak.hasRealmRole("admin") && !photo.published && (
                <Nav.Item
                  icon={<Icon icon="share" />}
                  onClick={() => setPublish(true)}
                >
                  Опубликовать
                </Nav.Item>
              )}
              <Dropdown icon={<Icon icon="more" />}>
                <Dropdown.Item
                  icon={<Icon icon="trash-o" />}
                  onClick={() => setConfirm(true)}
                >
                  Удалить
                </Dropdown.Item>
              </Dropdown>
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
              alt={photo.title}
              style={{ maxWidth: "100%", marginLeft : "auto", marginRight: "auto", height: "auto" }}
              onClick={() => setPreview(image)}
            />
            <dl>
              <dt>Размер оригинала</dt>
              <dd>
                {photo.width} x {photo.height} px
              </dd>
              <dt>Эскизы</dt>
              <dd style={slimText}>
                {photo.sizes.map((s, index) => (
                  <span key={index}>
                    {s.width}x{s.height},{" "}
                  </span>
                ))}
              </dd>
            </dl>
            <Divider />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
            <PhotoEditor onDone={()=>setEditable(false)} editable={editable} photo={photo} api={authApi} />
          </FlexboxGrid.Item>
        </FlexboxGrid>
        {confirm && (
          <PhotoConfirmDelete
            onConfirm={canDelete}
            onCancel={() => setConfirm(null)}
          />
        )}
        {publish && (
          <PhotoConfirmPublish
            onConfirm={canPublish}
            onCancel={() => setPublish(null)}
          />
        )}
        {preview && (
          <PhotoPreview
            title={photo.title}
            image={preview}
            onClose={() => setPreview(null)}
          />
        )}
      </Content>
    </Container>
  );
};

export default PhotoView;
