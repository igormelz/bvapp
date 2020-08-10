/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Nav, Dropdown } from "rsuite";

// eslint-disable-next-line react/display-name
const MyLink = React.forwardRef((props, ref) => {
  const { href, as, ...rest } = props;
  return (
    <Fragment>
      <Link to={href} as={as} ref={ref} {...rest}>
        {props.children}
      </Link>
    </Fragment>
  );
});

export const DropLink = (props) => (
  <Dropdown.Item componentClass={MyLink} {...props} />
);

export const NavLink = (props) => (
  <Nav.Item componentClass={MyLink} {...props} />
);
