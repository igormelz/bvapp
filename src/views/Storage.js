import React, { useState, useRef, useEffect, Fragment } from "react";
import { Panel,IconButton, Button, Icon, Alert, Table } from "rsuite";
import { useApi } from "../utils/api";
import axios from "axios";
import numeral from "numeral";

const FileTypeCell = ({ rowData, dataKey, ...props }) => {
  return (
    <Table.Cell {...props}>
      <Icon icon={rowData[dataKey] ? "file-image-o" : "file-o"} />
    </Table.Cell>
  );
};

const FileSizeCell = ({ rowData, dataKey, ...props }) => {
  return (
    <Table.Cell {...props}>
      <span>{numeral(rowData[dataKey]).format("0.0 b")}</span>
    </Table.Cell>
  );
};

const Storage = () => {
  const { Column, HeaderCell, Cell } = Table;
  const [showResult, setShowResult] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [data, setData] = useState([]);
  //const [apiMessage, setApiMessage] = useState("");
  const axiosInstance = useApi();
  const fileInput = useRef(null);

  useEffect(() => {
    setShowLoading(true);
    axios
      .get("http://localhost:8080/public/storage")
      .then((response) => {
        setData(response.data.files);
        setShowLoading(false);
        setShowResult(false);
      })
      .catch(() => console.error("no answer"));
      
    return () => {
      setData([]);
    }
  },[showResult]);

  const callApi = async (data, name, size) => {
    try {
      setShowLoading(true);
      const response = await axiosInstance.post(
        `/api/admin/storage?name=${name}&size=${size}`,
        data
      );
      const responseData = await response.data;
      console.log(responseData);
      setShowLoading(false);
      Alert.success("Uploaded file" + name);
      setShowResult(true);
      // setApiMessage("/api/public/storage/" + name);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = (event) => {
    console.log(event.target.files[0]);
    const formData = new FormData();
    formData.append("file", event.target.files[0], event.target.files[0].name);
    callApi(formData, event.target.files[0].name, event.target.files[0].size);
  };

  const deleteId = (id) => {
    console.log("Try delete:" + id);
    setShowLoading(true);
    axiosInstance.delete(`/api/admin/storage/${id}`).then(() => {
      Alert.info("Deleted");
      setShowLoading(false);
      setShowResult(true);
    }).catch(() =>{
      Alert.error("Can not delete");
    })
  }

  // const fmtTime = (str) => {
  //   const d = new Date(str);
  //   return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  // };

  return (
    <Panel header="File Storage">
      <Fragment>
        <input
          type="file"
          onChange={uploadFile}
          ref={fileInput}
          style={{ display: "none" }}
        />
        <Button onClick={() => fileInput.current.click()} loading={showLoading}>
          <Icon icon="upload" /> Upload file
        </Button>
      </Fragment>
      <Panel>
        <Table
          data={data}
          height={400}
          loading={showLoading}
          onRowClick={(data) => {
            console.log(data);
          }}
        >
          <Column align="center" fixed>
            <HeaderCell>Type</HeaderCell>
            <FileTypeCell dataKey="File.media" />
          </Column>
          <Column width={300}>
            <HeaderCell>File</HeaderCell>
            <Cell dataKey="File.name" />
          </Column>
          <Column align="right">
            <HeaderCell>Size</HeaderCell>
            <FileSizeCell dataKey="File.size" />
          </Column>
          <Column width={120} fixed="right">
            <HeaderCell>Action</HeaderCell>

            <Cell>
              {rowData => {
                return (
                  <IconButton appearance="primary" icon={<Icon icon="trash-o"/>} onClick={() => deleteId(rowData.uid) }/>
                );
              }}
            </Cell>
          </Column>
        </Table>
      </Panel>
    </Panel>
  );
};

export default Storage;
