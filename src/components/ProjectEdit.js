import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
} from "rsuite";
import { useAuthApi } from "../utils/authApi";

const ProjectEdit = ({ project, onClose }) => {
  const [formData, setFormData] = useState(project);
  const api = useAuthApi();

  const submit = () => {
    api
      .post("/photo/project", formData)
      .then(() => {
        onClose();
      })
      .catch(() => {
        console.log("ERROR");
        onClose();
      });
  };
  return (
    <Modal show onHide={onClose}>
      <Modal.Header>
        <Modal.Title>Edit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          fluid
          formValue={formData}
          onChange={(formValue) => {
            setFormData(formValue);
          }}
        >
          <FormGroup>
            <ControlLabel>Проект</ControlLabel>
            <FormControl name="label" />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Серии</ControlLabel>
            <FormControl name="seriesList" />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Построено</ControlLabel>
            <FormControl name="built" />
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={submit} appearance="primary">
          Ok
        </Button>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ProjectEdit.propTypes = {
  project: PropTypes.object,
  onClose: PropTypes.func,
};

export default ProjectEdit;
