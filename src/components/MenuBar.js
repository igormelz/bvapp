import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useKeycloak } from "@react-keycloak/web";
import { Header, Navbar, Icon, Dropdown, Nav } from "rsuite";
import { NavLink, DropLink } from "./NavLink";

const Mobile = ({ userInfo, login, logout }) => (
  <Navbar appearance="inverse">
    <Navbar.Header>
      <Link to="/">
        <div style={{ padding: "18px 40px" }}>
          <img src="/Submarine.svg" alt="logo" height={20} width={140} />
        </div>
      </Link>
    </Navbar.Header>
    <Navbar.Body>
      <Nav pullRight>
        <Dropdown icon={<Icon icon="bars" />} placement="bottomEnd">
          <DropLink icon={<Icon icon="image" />} href="/photo">
            Фото архив
          </DropLink>
          {!userInfo && (
            <Dropdown.Item icon={<Icon icon="sign-in" />} onClick={login}>
              Вход
            </Dropdown.Item>
          )}
          {userInfo && (
            <Dropdown.Menu
              title={userInfo.username}
              icon={<Icon icon="user" />}
              pullLeft
            >
              <DropLink icon={<Icon icon="upload" />} href="/upload/photo">
                Загрузить фото
              </DropLink>
              <DropLink href="/my/photo" icon={<Icon icon="image" />}>
                Мои фотографии
              </DropLink>
              <Dropdown.Item divider />
              <DropLink href="/profile" icon={<Icon icon="profile" />}>
                Профиль
              </DropLink>
              <Dropdown.Item onClick={logout} icon={<Icon icon="sign-out" />}>
                Выход
              </Dropdown.Item>
            </Dropdown.Menu>
          )}
        </Dropdown>
      </Nav>
    </Navbar.Body>
  </Navbar>
);

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
            <DropLink href="/my/photo" icon={<Icon icon="image" />}>
              Черновики
            </DropLink>
            {admin && (
              <Dropdown.Menu title="Редактор" pullLeft>
              <DropLink href="/pending/photo" icon={<Icon icon="share-alt" />}>
                Список на проверку
              </DropLink>
              </Dropdown.Menu>
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

const MenuBar = () => {
  const { keycloak, initialized } = useKeycloak();
  const [userInfo, setUserInfo] = useState(null);
  const [admin, setAdmin] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 400 });

  useEffect(() => {
    const getProfile = async () => {
      const profile = await keycloak.loadUserProfile();
      setUserInfo(profile);
      setAdmin(keycloak.hasRealmRole("admin"));
    };

    if (initialized) {
      getProfile();
    }

    return () => {
      setUserInfo(null);
    };
  }, [initialized, keycloak]);

  if (isMobile) {
    return (
      <Header>
        <Mobile
          userInfo={userInfo}
          admin={admin}
          login={() => keycloak.login()}
          logout={() => keycloak.logout()}
        />
      </Header>
    );
  }

  return (
    <Header>
      <Default
        userInfo={userInfo}
        admin={admin}
        login={() => keycloak.login()}
        logout={() => keycloak.logout()}
      />
    </Header>
  );
};
export default MenuBar;
