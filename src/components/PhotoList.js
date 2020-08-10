import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Content, List, FlexboxGrid } from "rsuite";

const styleCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const titleStyle = {
  paddingBottom: 5,
  whiteSpace: "nowrap",
  fontWeight: 500,
};

const slimText = {
  fontSize: "0.9em",
  fontWeight: "lighter",
  color: "#97969B",
  paddingBottom: 5,
};

const PhotoList = ({ target, data, activePage, subsSelected }) => {
  return (
    <Content>
      <List hover>
        {data &&
          data.map((item, index) => (
            <List.Item index={index} key={item.uid}>
              <FlexboxGrid>
                <FlexboxGrid.Item colspan={4} style={styleCenter}>
                  <img src={item.sizes[0].url} alt={item.title} />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item
                  colspan={10}
                  style={{
                    ...styleCenter,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    overflow: "hidden",
                  }}
                >
                  <div style={titleStyle}>
                    <Link
                      to={{
                        pathname: `/user/photos/${item.uid}`,
                        state: {
                          activePage: activePage,
                          target: target,
                          subsSelected: subsSelected,
                        },
                      }}
                    >
                      {item.title}
                    </Link>
                  </div>
                  <p style={slimText}>{item.text}</p>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={4}>
                  {item.epoch && (
                    <div>
                      <div style={slimText}>Период</div>
                      <div style={{ fontWeight: "lighter", color: "#93aeba" }}>
                        {item.epoch.label}
                      </div>
                    </div>
                  )}
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={4}>
                  {item.submarine && (
                    <div>
                      <div style={slimText}>ПЛ</div>
                      {item.submarine.map((sub, index) => (
                        <div
                          key={index}
                          style={{ fontWeight: "lighter", color: "#16567d" }}
                        >
                          {sub.label}
                        </div>
                      ))}
                    </div>
                  )}
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </List.Item>
          ))}
      </List>
    </Content>
  );
};

PhotoList.propTypes = {
  target: PropTypes.string,
  data: PropTypes.array,
  activePage: PropTypes.number,
  subsSelected: PropTypes.string,
};

export default PhotoList;
