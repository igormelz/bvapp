import React from "react";
import { Modal, Icon, Button } from "rsuite";

const PhotoConfirmPublish = ({onCancel, onConfirm}) => {
  return (
    <Modal backdrop="static" show={true} onHide={onCancel} size="xs">
      <Modal.Body>
        <Icon
          icon="remind"
          style={{
            color: "#ffb300",
            fontSize: 24,
          }}
        />
        {"  "}
        Are you sure you want to proceed?
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onConfirm} appearance="default">
          Ok
        </Button>
        <Button onClick={onCancel} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PhotoConfirmPublish;
