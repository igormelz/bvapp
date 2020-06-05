import React, { useRef, useState } from "react";
import { useApi } from "../utils/api";
import {
  Drawer,
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  ButtonToolbar,
  Schema,
} from "rsuite";

const PhotoEditor = ({ photo, onClose, onSubmit }) => {
  const api = useApi(process.env.REACT_APP_SECURE_API_URL);
  const form = useRef(null);
  const [formData, setFormData] = useState({
    title: photo.title,
    text: photo.text,
  });
  
  const { StringType } = Schema.Types;
  const model = Schema.Model({
    title: StringType().isRequired("Обязательно для заполнения"),
    text: StringType()
  });

  const handleSubmit = () => {
    if (!form.current.check()) {
      console.log("ERROR");
      return;
    }
    console.log("Try to update:" + photo.uid);
    api.post(`/secure/photo/${photo.uid}`, formData).then(() =>{
      console.log("SUCCESS");
      onSubmit();
    }).catch((err) => {
      console.error(err);
      onClose();
    })
  };

  return (
    <Drawer show={true} onHide={onClose}>
      <Drawer.Header>
        <Drawer.Title>Редактировать описание</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <Form
          fluid
          formValue={formData}
          model={model}
          ref={form}
          onChange={(formValue) => {
            setFormData(formValue);
          }}
        >
          <FormGroup>
            <ControlLabel>Краткое наименование</ControlLabel>
            <FormControl name="title" />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Описание</ControlLabel>
            <FormControl rows={5} name="text" componentClass="textarea" />
          </FormGroup>
          <FormGroup>
            <ButtonToolbar>
              <Button appearance="primary" onClick={handleSubmit}>
                Сохранить
              </Button>
              <Button appearance="subtle" onClick={onClose}>
                Отменить
              </Button>
            </ButtonToolbar>
          </FormGroup>
        </Form>
      </Drawer.Body>
    </Drawer>
  );
};

export default PhotoEditor;
