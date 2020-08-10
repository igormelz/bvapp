import React, { useEffect, useState } from "react";
import {
  Placeholder,
  Container,
  Header,
} from "rsuite";
import axios from "axios";
import PhotoList from "../components/PhotoList";

const Photo = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public?t=s`)
      .then((response) => {
        setData(response.data.photo);
        setLoading(false);
      })
      .catch(() => console.error("no answer"));

    return () => {
      setData([]);
    };
  }, []);

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
    <Container style={{ padding: "20px 60px 20px 60px" }}>
      <Header>
        <h3>Фото архив</h3>
      </Header>
      <PhotoList target="/photo" data={data}/>
    </Container>
  );
};

export default Photo;
