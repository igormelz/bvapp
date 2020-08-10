import React, { useState, useEffect } from "react";
import { TreePicker } from "rsuite";
import axios from "axios";

const PhotoEpoch = ({ id }) => {
  const [epoch, setEpoch] = useState(id);
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/epoch`)
      .then((response) => {
        setData(response.epoch);
        console.log(response.epoch);
      })
      .catch(() => console.error("no answer"));

    return () => {
      setData([]);
    };
  }, []);

  return (
    <TreePicker
      data={data}
      defaultExpandAll
      searchable={false}
      placeholder="Исторический период"
      valueKey="uid"
      style={{ width: 246 }}
      value={epoch}
      onSelect={(node, value, event) => setEpoch(value)}
    />
  );
};

export default PhotoEpoch;
