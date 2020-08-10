import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Placeholder,
  Container,
  Header,
  Pagination,
  Footer,
  FlexboxGrid,
  TreePicker,
  CheckPicker,
  InputGroup,
  Input,
  Icon,
} from "rsuite";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
import PhotoList from "../components/PhotoList";
import { useLocation } from "react-router-dom";

const PAGE_SIZE = 10;

const UserPhoto = ({ apipath, target, title }) => {
  const searchRef = useRef();
  const location = useLocation();
  const [keycloak, initialized] = useKeycloak();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  // paging
  const [dataCount, setDataCount] = useState(0);
  const [pages, setPages] = useState(0);
  const [activePage, setActivePage] = useState(
    (location.state && location.state.activePage) || 1
  );
  // epoch
  const [epoch, setEpoch] = useState([]);
  const [epochSelected, setEpochSelected] = useState(null);
  // subs
  const [subs, setSubs] = useState([]);
  const [subsSelected, setSubsSelected] = useState(
    (location.state && location.state.subsSelected) || null
  );
  // search
  const [searchStr, setSearchStr] = useState();

  const handleSelect = (eventkey) => {
    location.state = { activePage: eventkey };
    setActivePage(eventkey);
  };

  const getSub = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/submarine`)
      .then((response) => {
        setSubs(
          [
            {
              uid: "undefined",
              label: "ПЛ не отмечена",
              project: "Без отметок",
            },
          ].concat(
            response.data.submarine
              // draw only if has photo
              .filter((s) => s.c > 0)
              .map((s) => ({
                uid: s.uid,
                project: s.project.label,
                label: s.label + " (" + (s.c > 0 ? s.c : "-") + ")",
              }))
          )
        );
      })
      .catch(() => console.error("no subs answer"));
  };

  const getEpoch = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/epoch`)
      .then((response) => {
        setEpoch(
          response.data.epoch.map((e) => {
            if (!e.children) {
              return {
                ...e,
                label: e.label + " [" + e.c + "]",
              };
            } else {
              const cc = e.children.map((c) => ({
                ...c,
                label: c.label + " [" + c.c + "]",
              }));
              return {
                ...e,
                label: e.label + " [" + e.c + "]",
                children: cc,
              };
            }
          })
        );
      })
      .catch(() => console.error("no epoch answer"));
  };

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      //console.log("Call api"+keycloak.token);
      axios
        .get(`${process.env.REACT_APP_API_URL}${apipath}`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
          params: {
            limit: PAGE_SIZE,
            offset: `${(activePage - 1) * PAGE_SIZE}`,
            epoch: epochSelected,
            sub: `${subsSelected}`,
            search: `${searchStr}`,
          },
        })
        .then((result) => {
          setData(result.data.photo);
          const count = result.data.tc[0].count;
          if (count > PAGE_SIZE) {
            const pp = count / PAGE_SIZE;
            setPages(Math.ceil(pp) === pp ? Math.floor(pp) : Math.ceil(pp));
          } else {
            setPages(0);
          }
          setDataCount(count);
          setLoading(false);
        });
    }

    getSub();

    return () => {
      setData([]);
    };
  }, [
    apipath,
    initialized,
    keycloak,
    activePage,
    epochSelected,
    subsSelected,
    searchStr,
  ]);

  if (loading) {
    return (
      <div>
        <Placeholder.Paragraph style={{ marginTop: 30 }} graph="image" />
        <Placeholder.Paragraph style={{ marginTop: 30 }} graph="image" />
        <Placeholder.Paragraph style={{ marginTop: 30 }} graph="image" />
      </div>
    );
  }

  return (
    <Container>
      <Container style={{ padding: "0px 20px" }}>
        <Header>
          <h4>{title}</h4>
          <FlexboxGrid style={{ padding: "20px 0px" }} justify="space-between">
            <FlexboxGrid.Item colspan={14}>
              <InputGroup>
                <Input
                  inputRef={searchRef}
                  placeholder="Введите строку для поиска ..."
                />
                <InputGroup.Button
                  onClick={() => {
                    setActivePage(0);
                    setSearchStr(searchRef.current.value);
                  }}
                >
                  <Icon icon="search" />
                </InputGroup.Button>
              </InputGroup>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={4}>
              <CheckPicker
                groupBy="project"
                data={subs}
                placeholder="Фильтр по лодкам"
                valueKey="uid"
                //onOpen={getSub}
                value={subsSelected}
                onChange={(v) => {
                  setSubsSelected(v);
                  setEpochSelected(null);
                  setActivePage(1);
                }}
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={4}>
              <TreePicker
                data={epoch}
                valueKey="uid"
                cascade={false}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                cascade="false"
                searchable={false}
                placeholder="Фильтр по периоду"
                value={epochSelected}
                onChange={(v) => {
                  setEpochSelected(v);
                  setSubsSelected(null);
                  setActivePage(1);
                }}
                onOpen={getEpoch}
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <div>
            Show:{dataCount > PAGE_SIZE ? PAGE_SIZE : dataCount}
            {" of "}
            {dataCount}
          </div>
        </Header>
        <PhotoList
          target={target}
          data={data}
          activePage={activePage}
          subsSelected={subsSelected}
        />
        <Footer>
          {pages > 1 && (
            <div>
              <Pagination
                size="xs"
                next
                prev
                first
                last
                maxButtons={10}
                pages={pages}
                activePage={activePage}
                onSelect={handleSelect}
              />
            </div>
          )}
        </Footer>
      </Container>
    </Container>
  );
};

UserPhoto.propTypes = {
  apipath: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default UserPhoto;
