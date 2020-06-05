import React from "react";
import { Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { Navbar, Nav, Icon, Dropdown } from "rsuite";
import "./MenuBar.css";

const MyLink = React.forwardRef((props, ref) => {
  const { href, as, ...rest } = props;
  return (
    <Link to={href} as={as} ref={ref} {...rest}>
      {props.children}
    </Link>
  );
});

const NavLink = (props) => <Nav.Item componentClass={MyLink} {...props} />;
const UserLink = (props) => (
  <Dropdown.Item componentClass={MyLink} {...props} />
);

const UserInfo = () => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized || !keycloak.authenticated) {
    return (
      <Nav.Item icon={<Icon icon="sign-in" />} onClick={() => keycloak.login()}>
        Вход для пользователей
      </Nav.Item>
    );
  }

  return (
    <Dropdown
      title="{userInfo.username}"
      icon={<Icon icon="user" />}
      placement="bottomEnd"
    >
      <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
        <p>Signed in as</p>
        <strong>userInfo</strong>
      </Dropdown.Item>
      <Dropdown.Item divider />
      <UserLink href="/profile" icon={<Icon icon="profile" />}>
        Your Profile
      </UserLink>
      <Dropdown.Item
        onClick={() => keycloak.logout()}
        icon={<Icon icon="sign-out" />}
      >
        Выход
      </Dropdown.Item>
    </Dropdown>
  );
};

const MenuBar = () => {
  const { keycloak } = useKeycloak();

  return (
    <Navbar appearance="inverse">
      <Navbar.Header>
        <span className="navbar-brand logo">BalticVaryag</span>
      </Navbar.Header>
      <Navbar.Body>
        <Nav>
          <NavLink href="/" icon={<Icon icon="home" />}>
            Home
          </NavLink>
          <NavLink href="/photos" icon={<Icon icon="image" />}>
            Фото
          </NavLink>
          {keycloak.authenticated && (
            <NavLink href="/pingapi">Call Api</NavLink>
          )}
          {keycloak.authenticated && (
            <NavLink href="/upload/photo" icon={<Icon icon="cloud-upload" />}>
              Загрузить
            </NavLink>
          )}
        </Nav>
        <Nav pullRight>
          <UserInfo />
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
};

export default MenuBar;
