import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sidenav, Sidebar, TreePicker, SelectPicker } from "rsuite";

const users = [
  { label: 'All', value: 0},
  { label: 'Me', value: 1},
  { label: 'Some', value: 2},
]

const UserPhotoSubnav = ({ filterEpoch }) => {
  const [expand, setExpand] = useState(true);
  const [epochData, setEpochData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/epoch`)
      .then((response) => {
        setEpochData(response.data.epoch);
      })
      .catch(() => console.error("no answer"));

    return () => {
      setEpochData([]);
    };
  }, []);

  return (
    <Sidebar
      style={{ display: "flex", flexDirection: "column" }}
      width={expand ? 260 : 56}
      collapsible
    >
      <Sidenav expanded={expand}>
        <Sidenav.Body>
          <SelectPicker
            searchable={false}
            data={users}
            block
            placeholder="Пользователи"
          />
          <TreePicker
            data={epochData}
            valueKey="uid"
            cascade={false}
            cascade="false"
            searchable={false}
            block
            placeholder="Фильтр по периоду"
            onChange={(v, e) => filterEpoch(v)}
          />
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};

export default UserPhotoSubnav;
