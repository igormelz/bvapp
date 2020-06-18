import React from "react";
import { Link } from "react-router-dom";
import { Nav, Dropdown } from "rsuite";

const MyLink = React.forwardRef((props, ref) => {
    const { href, as, ...rest } = props;
    return (
      <Link to={href} as={as} ref={ref} {...rest}>
        {props.children}
      </Link>
    );
  });
  
  export const DropLink = (props) => (
    <Dropdown.Item componentClass={MyLink} {...props} />
  );

  export const NavLink = (props) => <Nav.Item componentClass={MyLink} {...props} />;
