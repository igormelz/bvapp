import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Panel, Grid, Row, Col, Icon } from "rsuite";
import axios from "axios";
import "./Photo.css";

const Home = () => {
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_PUBLIC_API_URL}/public/photo?t=s`)
      .then((response) => {
        //console.log(response);
        setData(response.data.photo);
      })
      .catch(() => console.error("no answer"));

    return () => {
      setData([]);
    };
  }, []);

  const fmtDate = (str) => {
    const d = new Date(str);
    return d.toLocaleDateString(); //+ " " + d.toLocaleTimeString();
  };

  //const fmtSize = (size) => numeral(size).format("0.0 b");

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
                      <div>
                        <Icon icon="user-circle-o" />
                        {" " + item.user.name}
                      </div>
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

export default Home;
