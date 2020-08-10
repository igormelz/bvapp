import React from "react";
import { Modal, Button } from "rsuite";

const EditEpoch = ({ epoch, onClose }) => (
  <Modal show onHide={onClose}>
    <Modal.Header>
      <Modal.Title>Edit</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div>{epoch.label}</div>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onClose} appearance="primary">
        Ok
      </Button>
      <Button onClick={onClose} appearance="subtle">
        Cancel
      </Button>
    </Modal.Footer>
  </Modal>
);

export default EditEpoch;
