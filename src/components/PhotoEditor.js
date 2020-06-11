import React, { useRef, useState } from "react";
import { useAuthApi } from "../utils/authApi";
import {
  Drawer,
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  ButtonToolbar,
  Schema,
  HelpBlock,
} from "rsuite";

//const isPub = (<Toggle defaultChecked/>);

const PhotoEditor = ({ photo, onClose, onSubmit }) => {
  const api = useAuthApi();
  const form = useRef(null);
  const [formData, setFormData] = useState({
    title: photo.title,
    text: photo.text,
    source: photo.source,
    author: photo.author,
  });

  const { StringType } = Schema.Types;
  const model = Schema.Model({
    title: StringType().isRequired("Обязательно для заполнения"),
    text: StringType(),
    source: StringType(),
    author: StringType(),
  });

  const handleSubmit = () => {
    if (!form.current.check()) {
      console.log("ERROR");
      return;
    }
    console.log("Try to update:" + photo.uid);
    api
      .post(`/photo/${photo.uid}`, formData)
      .then(() => {
        console.log("SUCCESS");
        onSubmit();
      })
      .catch((err) => {
        console.error(err);
        onClose();
      });
  };

  return (
    <Drawer show={true} onHide={onClose} size="xs">
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
            <FormControl rows={5} name="text" componentClass="textarea"/>
            <HelpBlock>Добавьте описание события</HelpBlock>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Ссылка на источник</ControlLabel>
            <FormControl name="source" />
            <HelpBlock>Референс, URL</HelpBlock>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Автор снимка</ControlLabel>
            <FormControl name="author" />
            <HelpBlock></HelpBlock>
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
