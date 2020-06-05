import React from "react";
import { Drawer } from "rsuite";

const style = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: "100%",
    maxHeight: "100%"
};

const PhotoPreview = ({title, image, onClose}) => (
    <Drawer full placement="top" size="lg" show={true} onHide={onClose} backdrop={false}>
    <Drawer.Header>
      <Drawer.Title>{title}</Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>
      <img src={image.url} alt={title} style={style} />
    </Drawer.Body>
  </Drawer>
);

export default PhotoPreview