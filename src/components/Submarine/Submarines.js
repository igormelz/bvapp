import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Panel,
  Table,
  Popover,
  Icon,
  Whisper,
} from "rsuite";
import EditSub from "./EditSub";
import axios from "axios";
import { fmtDate } from "../../utils/helper";

const LocationCell = ({ rowData, ...props }) => {
  if (!rowData.location) return null;

  const speaker = (
    <Popover>
      <div>{`lat:${rowData.location.coordinates[0]} lon:${rowData.location.coordinates[1]}`}</div>
    </Popover>
  );

  return (
    <Table.Cell {...props}>
      <Whisper placement="auto" speaker={speaker}>
        <Icon icon="map-marker" />
      </Whisper>
    </Table.Cell>
  );
};

LocationCell.propTypes = {
  rowData: PropTypes.object,
};

const Submarines = () => {
  const { Column, HeaderCell, Cell } = Table;
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSub, setEditSub] = useState(null);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();

  const getSub = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/submarines`)
      .then((response) => {
        setSubs(
          response.data.submarine.map((x) => ({
            ...x,
            projectName: x.project.label,
            startdate: x.startdate && new Date(x.startdate),
            enddate: x.enddate && new Date(x.enddate),
            start: x.startdate && fmtDate(x.startdate),
            end: x.enddate && fmtDate(x.enddate),
          }))
        );

        setLoading(false);
      })
      .catch((e) => console.log("err:" + e));
  };

  useEffect(() => {
    getSub();
    return () => {
      setSubs([]);
    };
  }, []);

  const onSubmit = () => {
    setEditSub(null);
    setLoading(true);
    getSub();
  };

  const getData = () => {
    if (sortColumn && sortType) {
      return subs.sort((a, b) => {
        let x, y;
        if (sortColumn === "start") {
          x = a.startdate;
          y = b.startdate;
        } else if (sortColumn === "end") {
          x = a.enddate;
          y = b.enddate;
        } else {
          x = a[sortColumn] && a[sortColumn].toUpperCase();
          y = b[sortColumn] && b[sortColumn].toUpperCase();
        }
        // console.log("Sort:" + sortType + " x=" + x + " y=" + y);
        if (sortType === "asc") {
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        } else {
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        }
      });
    }
    return subs;
  };

  return (
    <Panel header="Подводные лодки">
      <Table
        loading={loading}
        data={getData()}
        autoHeight
        sortColumn={sortColumn}
        sortType={sortType}
        onRowClick={(data) => {
          setEditSub(data);
        }}
        onSortColumn={(sortColumn, sortType) => {
          setSortColumn(sortColumn);
          setSortType(sortType);
        }}
      >
        <Column width={150} sortable fixed>
          <HeaderCell>Наименование</HeaderCell>
          <Cell dataKey="label" />
        </Column>
        <Column width={200} sortable>
          <HeaderCell>Проект</HeaderCell>
          <Cell dataKey="projectName" />
        </Column>
        <Column width={100} sortable>
          <HeaderCell>Серия</HeaderCell>
          <Cell dataKey="series" />
        </Column>
        <Column width={200} sortable align="center">
          <HeaderCell>Вступление в строй</HeaderCell>
          <Cell dataKey="start" />
        </Column>
        <Column width={200} sortable align="center">
          <HeaderCell>Окончание службы</HeaderCell>
          <Cell dataKey="end" />
        </Column>
        <Column width={200}>
          <HeaderCell>Cудьба</HeaderCell>
          <Cell dataKey="fate" />
        </Column>
        <Column width={50}>
          <HeaderCell>Loc</HeaderCell>
          <LocationCell />
        </Column>
        <Column width={0}>
          <HeaderCell>id</HeaderCell>
          <Cell dataKey="uid" />
        </Column>
      </Table>
      {editSub && (
        <EditSub
          sub={editSub}
          project={{}}
          onClose={() => setEditSub(null)}
          onSubmit={onSubmit}
        />
      )}
    </Panel>
  );
};

export default Submarines;
