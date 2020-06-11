import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Panel, Grid, Row, Col, Content,  } from "rsuite";
import axios from "axios";
import "./Photo.css";

const Photo = () => {
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/photo/public?t=s`)
      .then((response) => {
        setData(response.data.photo);
      })
      .catch(() => console.error("no answer"));

    return () => {
      setData([]);
    };
  }, []);

  return (
      <Content>
    <Panel header="Фото архив">
      <Grid fluid>
        <Row>
          {data &&
            data.map((item, index) => (
              <Col md={4} key={index}>
                <Panel
                  shaded
                  bordered
                  bodyFill
                  style={{
                    display: "inline-block",
                    maxWidth: 240,
                    width: item.sizes[0].width,
                  }}
                >
                  <Link to={`/photo/${item.uid}`}>
                    <img src={item.sizes[0].url} alt={item.title} />
                  </Link>
                  <Panel header={item.title}>
                    <div>{item.text}</div>
                  </Panel>
                </Panel>
              </Col>
            ))}
        </Row>
      </Grid>
    </Panel>
    </Content>
  );
};

export default Photo;
