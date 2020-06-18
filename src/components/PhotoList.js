import React from "react"
import { Link } from "react-router-dom"
import { Content, List, FlexboxGrid, Panel } from "rsuite"

const styleCenter = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

const PhotoList = ({target, data}) => (
<Content>
<List>
  {data &&
    data.map((item, index) => (
      <List.Item index={index} key={item.uid}>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={6} style={styleCenter}>
            <Link to={`${target}/${item.uid}`}>
              <img src={item.sizes[0].url} alt={item.title} />
            </Link>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <Panel
              header={
                <Link to={`${target}/${item.uid}`}>{item.title}</Link>
              }
            >
              <p>{item.text}</p>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </List.Item>
    ))}
</List>
</Content>
);

export default PhotoList;