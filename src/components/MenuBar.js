import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useKeycloak } from "@react-keycloak/web";
import { Navbar, Icon, Dropdown, Nav } from "rsuite";

const MyLink = React.forwardRef((props, ref) => {
  const { href, as, ...rest } = props;
  return (
    <Link to={href} as={as} ref={ref} {...rest}>
      {props.children}
    </Link>
  );
});

const NavLink = (props) => <Nav.Item componentClass={MyLink} {...props} />;
const DropLink = (props) => (
  <Dropdown.Item componentClass={MyLink} {...props} />
);

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
              <Dropdown.Item divider />
              <DropLink href="/profile" icon={<Icon icon="profile" />}>
                Your Profile
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

const Default = ({ userInfo, login, logout }) => (
  <Navbar>
    <Navbar.Header>
      <Nav>
        <Link to="/">
          <img src="/brand.png" alt="logo" />
        </Link>
      </Nav>
    </Navbar.Header>
    <Navbar.Body>
      <Nav>
        <NavLink icon={<Icon icon="image" />} href="/photo">
          Фото архив
        </NavLink>
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
              Загрузить фото
            </DropLink>
            <Dropdown.Item divider />
            <DropLink href="/profile" icon={<Icon icon="profile" />}>
              Your Profile
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
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const getProfile = async () => {
      const profile = await keycloak.loadUserProfile();
      setUserInfo(profile);
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
      <Mobile
        userInfo={userInfo}
        login={() => keycloak.login()}
        logout={() => keycloak.logout()}
      />
    );
  }

  return (
    <Default
      userInfo={userInfo}
      login={() => keycloak.login()}
      logout={() => keycloak.logout()}
    />
  );
};
export default MenuBar;
