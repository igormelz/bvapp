import React, { useState } from "react";
import { Uploader, Alert } from "rsuite";
import { useKeycloak } from "@react-keycloak/web";

const styles = {
  lineHeight: "400px",
};

const UploadImage = ({ history }) => {
  const { keycloak, initialized } = useKeycloak();
  const [title, setTitle] = useState({});

  const authHeader = {
    Authorization: initialized ? `Bearer ${keycloak.token}` : undefined,
  };

  const updateTitle = (e) => {
    if (Array.isArray(e) && e.length > 0) {
      const name = e[e.length - 1].name;
      setTitle({ title: encodeURI(name) });
    }
  };

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <Uploader
      draggable
      action={`${process.env.REACT_APP_API_URL}/photo/upload`}
      headers={authHeader}
      data={title}
      accept="image/*"
      onChange={updateTitle}
      onSuccess={(response) => {
        console.log(response);
        history.push("/my/photo/" + response);
      }}
      onError={(err) => {
        // console.log(err);
        Alert.error(err.response);
      }}
    >
      <div style={styles}>Нажмите или перетащите файл для начала загрузки</div>
    </Uploader>
  );
};
export default UploadImage;
