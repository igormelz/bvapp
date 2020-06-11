import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Panel, Grid, Row, Col } from "rsuite";
import { fmtDate } from "../utils/helper";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
import "./Photo.css";

const UserPhoto = () => {
  const [keycloak, initialized] = useKeycloak();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/photo`, {
        headers: {
          Authorization: initialized ? `Bearer ${keycloak.token}` : undefined,
        },
      })
      .then((result) => {
        setData(result.data.my[0].photo);
      });

    return () => {
      setData([]);
    };
  }, [initialized, keycloak.token]);

  return (
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
                    <div className="slimText">
                      <div>{fmtDate(item.date)}</div>
                    </div>
                  </Panel>
                </Panel>
              </Col>
            ))}
        </Row>
      </Grid>
    </Panel>
  );
};

export default UserPhoto;
