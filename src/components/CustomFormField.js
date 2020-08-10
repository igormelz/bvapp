import React from "react";
import { FormGroup, FormControl, ControlLabel, HelpBlock } from "rsuite";

class CustomFormField extends React.PureComponent {
  render() {
    // eslint-disable-next-line react/prop-types
    const { name, message, label, accepter, error, ...props } = this.props;
    return (
      <FormGroup className={error ? "has-error" : ""}>
        <ControlLabel>{label} </ControlLabel>
        <FormControl
          name={name}
          accepter={accepter}
          errorMessage={error}
          {...props}
        />
        {message && <HelpBlock>{message}</HelpBlock>}
      </FormGroup>
    );
  }
}

export default CustomFormField;
