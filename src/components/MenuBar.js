import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
//import { useMediaQuery } from "react-responsive";
import { useKeycloak } from "@react-keycloak/web";
import { Header, Navbar, Icon, Dropdown, Nav } from "rsuite";
import { NavLink, DropLink } from "./NavLink";

const Default = ({ admin, userInfo, login, logout }) => (
  <Navbar appearance="subtle">
    <Navbar.Header>
      <Nav>
        <Link to="/">
          <img src="/brand.png" alt="logo" />
        </Link>
      </Nav>
    </Navbar.Header>
    <Navbar.Body>
      <Nav>
        <NavLink href="/photo">Фото архив</NavLink>
        <NavLink href="/map" style={{ fontWeight: "bolder", fontSize: "16px" }}>
          Карты
        </NavLink>
        <NavLink href="/submariners">
          <span style={{ fontWeight: "bolder", fontSize: "16px" }}>
            Подводники
          </span>
        </NavLink>
        <Dropdown icon={<Icon icon="ship" />} title="П/Л">
          <DropLink href="/projects">Проекты п/л</DropLink>
        </Dropdown>
      </Nav>
      <Nav pullRight>
        {!userInfo && (
          <Nav.Item icon={<Icon icon="sign-in" />} onClick={login}>
            Вход
          </Nav.Item>
        )}
        {userInfo && (
          <Dropdown
            title={userInfo.username}
            icon={<Icon icon="user" />}
            placement="bottomEnd"
          >
            <DropLink icon={<Icon icon="upload" />} href="/upload/photo">
              Загрузить
            </DropLink>
            {!admin && (
              <DropLink href="/user/photos" icon={<Icon icon="image" />}>
                Песочница
              </DropLink>
            )}
            {admin && (
              <DropLink href="/user/photos/all" icon={<Icon icon="image" />}>
                Песочница
              </DropLink>
            )}
            {admin && (
              <DropLink
                href="/user/photos/waiting"
                icon={<Icon icon="share-alt" />}
              >
                На проверку
              </DropLink>
            )}
            {admin && (
              <DropLink href="/categories" icon={<Icon icon="creative" />}>
                Категории
              </DropLink>
            )}
            <Dropdown.Item divider />
            <DropLink href="/profile" icon={<Icon icon="profile" />}>
              Профиль
            </DropLink>
            <Dropdown.Item onClick={logout} icon={<Icon icon="sign-out" />}>
              Выход
            </Dropdown.Item>
          </Dropdown>
        )}
      </Nav>
    </Navbar.Body>
  </Navbar>
);

Default.propTypes = {
  admin: PropTypes.bool,
  userInfo: PropTypes.any,
  login: PropTypes.func,
  logout: PropTypes.func,
  projects: PropTypes.array,
};

const MenuBar = () => {
  const [keycloak, initialized] = useKeycloak();
  const [userInfo, setUserInfo] = useState(null);
  const [admin, setAdmin] = useState(false);
  //const isMobile = useMediaQuery({ maxWidth: 400 });

  useEffect(() => {
    const getProfile = async () => {
      const profile = await keycloak.loadUserProfile();
      setUserInfo(profile);
      setAdmin(keycloak.hasRealmRole("admin"));
    };

    if (initialized && keycloak.authenticated) {
      getProfile();
    }

    return () => {
      setUserInfo(null);
    };
  }, [initialized, keycloak]);

  return (
    <Header>
      <Default
        userInfo={userInfo}
        admin={admin}
        login={() =>
          keycloak.login({ redirectUri: `${window.location.href}/user/photos` })
        }
        logout={() => keycloak.logout()}
      />
    </Header>
  );
};
export default MenuBar;
