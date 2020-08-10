import React, { useState, useEffect } from "react";
import {
  Content,
  Header,
  Container,
  Table,
  FlexboxGrid,
  SelectPicker,
} from "rsuite";
import axios from "axios";

const Heroes = () => {
  const { Column, HeaderCell, Cell } = Table;
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [sub, setSub] = useState([]);
  const [subSelect, setSubSelect] = useState();

  const getHeroes = (sub) => {
    let url = `${process.env.REACT_APP_API_URL}/public/submariner`;
    if (sub) {
      url = `${process.env.REACT_APP_API_URL}/public/submariner/submarine/${sub}`;
    }
    axios
      .get(url)
      .then((response) => {
        setHeroes(
          response.data.heroes.map((h) => ({
            ...h,
            submarine: h.submarine[0].label,
          }))
        );
        setLoading(false);
      })
      .catch((e) => console.log("err get heroes:" + e));
  };

  const getSub = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/submariner/submarine`)
      .then((response) => {
        setSub(
          response.data.hs.map((h) => ({
            uid: h.uid,
            label: h.label + " (" + h.c + ")",
            project: h.project.label,
          }))
        );
      })
      .catch((e) => console.log("err get sub:" + e));
  };

  useEffect(()=>{
    getSub();
    return () => {
      setSub([]);
    }
  },[]);

  useEffect(() => {
    getHeroes(subSelect);
    return () => {
      setHeroes([]);
    };
  }, [subSelect]);

  const getData = () => {
    if (sortColumn && sortType) {
      return heroes.sort((a, b) => {
        let x = a[sortColumn]; //.toUpperCase();
        let y = b[sortColumn]; //.toUpperCase();
        // if (sortColumn === "start") {
        //   x = a.startdate;
        //   y = b.startdate;
        // }
        // if (sortColumn === "end") {
        //   x = a.enddate;
        //   y = b.enddate;
        // }
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
    return heroes;
  };

  return (
    <Container>
      <Header>
        <h4>Герои подводники</h4>
        <FlexboxGrid>
          <FlexboxGrid.Item>
            <SelectPicker
              data={sub}
              groupBy="project"
              valueKey="uid"
              placeholder="Выбрать ПЛ"
              value={subSelect}
              onChange={(v) => setSubSelect(v)}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Header>
      <Content>
        <Table
          virtualized
          autoHeight
          loading={loading}
          data={getData()}
          sortColumn={sortColumn}
          sortType={sortType}
          // onRowClick={(data) => {
          //   setEditSub(data);
          // }}
          onSortColumn={(sortColumn, sortType) => {
            setSortColumn(sortColumn);
            setSortType(sortType);
          }}
        >
          <Column width={300} sortable fixed>
            <HeaderCell>ФИО</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column width={250} sortable>
            <HeaderCell>Звание</HeaderCell>
            <Cell dataKey="rank" />
          </Column>
          <Column width={250} sortable>
            <HeaderCell>Должность</HeaderCell>
            <Cell dataKey="position" />
          </Column>
          <Column width={150} sortable>
            <HeaderCell>ПЛ</HeaderCell>
            <Cell dataKey="submarine" />
          </Column>
          <Column width={0}>
            <HeaderCell>id</HeaderCell>
            <Cell dataKey="uid" />
          </Column>
        </Table>
      </Content>
    </Container>
  );
};

// SubmarineList.propTypes = {
//   project: PropTypes.object,
// };

export default Heroes;
