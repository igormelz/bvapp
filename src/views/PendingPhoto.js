import React, { useState, useEffect } from "react";
import { Placeholder, Container, Header } from "rsuite";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
import PhotoList from "../components/PhotoList";


const PendingPhoto = () => {
  const [keycloak, initialized] = useKeycloak();
  const [ loading, setLoading ] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/photo/review`, {
        headers: {
          Authorization: initialized ? `Bearer ${keycloak.token}` : undefined,
        },
      })
      .then((result) => {
        setData(result.data.photo);
        setLoading(false);
      });

    return () => {
      setData([]);
    };
  }, [initialized, keycloak.token]);

  if (loading) {
    return (
      <div>
        <Placeholder.Paragraph style={{ marginTop: 30 }} graph="image" />
        <Placeholder.Paragraph style={{ marginTop: 30 }} graph="image" />
        <Placeholder.Paragraph style={{ marginTop: 30 }} graph="image" />
      </div>
    );
  }

  return (
    <Container style={{ padding: '20px 60px 20px 60px' }}>
      <Header>
        <h3>Мои фото</h3>
      </Header>
      <PhotoList target="/my/photo" data={data}/> 
    </Container>
  );
};

export default PendingPhoto;
