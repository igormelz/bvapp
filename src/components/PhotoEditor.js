import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  ButtonToolbar,
  HelpBlock,
  Icon,
  Alert,
} from "rsuite";

const PhotoEditor = ({ editable, photo, onDone, api }) => {
  //const form = useRef(null);
  const [formData, setFormData] = useState({
    uid: photo.uid,
    title: photo.title,
    text: photo.text ? photo.text : "",
    place: photo.place,
    source: photo.source,
    author: photo.author,
    license: photo.license,
  });

  const handleSubmit = () => {
    api
      .post("/photo", formData)
      .then(() => {
        console.log("SUCCESS");
        Alert.info("Изменения сохранены");
        onDone();
      })
      .catch((err) => {
        console.error(err);
        Alert.error("Something wrong");
      });
  };

  return (
    <Form
      fluid
      formValue={formData}
      plaintext={!editable}
      // model={model}
      // ref={form}
      onChange={(formValue) => {
        setFormData(formValue);
      }}
    >
      <FormGroup>
        <ControlLabel>Название</ControlLabel>
        <FormControl name="title" />
        <HelpBlock>Обязательное поле</HelpBlock>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Описание</ControlLabel>
        <FormControl rows={4} name="text" componentClass="textarea" />
        <HelpBlock>Кратко опишите что на снимке, какое событие и т.д.</HelpBlock>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Место фотографии</ControlLabel>
        <FormControl name="place" />
        <HelpBlock>Если известно м.б. регион, город, ...</HelpBlock>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Ссылка или указание на первоисточник</ControlLabel>
        <FormControl name="source" />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Автор</ControlLabel>
        <FormControl name="author" />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Лицензия (если не CC-BY 4.0)</ControlLabel>
        <FormControl name="license" />
      </FormGroup>
      {editable && (
        <FormGroup>
          <ButtonToolbar>
            <Button appearance="primary" onClick={handleSubmit}>
              <Icon icon="save" /> Сохранить
            </Button>
            <Button appearance="default" onClick={onDone}>
              <Icon icon="ban" /> Отменить
            </Button>
          </ButtonToolbar>
        </FormGroup>
      )}
    </Form>
  );
};

export default PhotoEditor;
