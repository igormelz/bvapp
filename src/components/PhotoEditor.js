import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  TreePicker,
  CheckPicker,
} from "rsuite";
import axios from "axios";
import CustomFormField from "./CustomFormField";

const PhotoEditor = ({ editable, photo, onDone, api }) => {
  const [formData, setFormData] = useState({
    uid: photo.uid,
    title: photo.title,
    text: photo.text || "",
    place: photo.place,
    source: photo.source,
    author: photo.author,
    license: photo.license,
    epoch: photo.epoch && photo.epoch.uid,
    submarine: (photo.submarine && photo.submarine.map((sub) => (sub.uid))) || [],
  });
  const [epochData, setEpochData] = useState([]);
  const [submarine, setSubmarine] = useState([]);
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/epoch`)
      .then((response) => {
        setEpochData(response.data.epoch);
      })
      .catch(() => console.error("no epoch"));
    axios
      .get(`${process.env.REACT_APP_API_URL}/public/submarine`)
      .then((response) => {
        setSubmarine(response.data.submarine.map((sub)=>(
          {
            ...sub,
            project: sub.project.label,
          }
        )));
      })
      .catch(() => console.error("no submarine"));

    return () => {
      setEpochData([]);
      setSubmarine([]);
      setHeroes([]);
    };
  }, []);

  const getHeroes = (sub) => {
    axios
    .get(`${process.env.REACT_APP_API_URL}/public/submariner/submarine/${sub}`)
    .then((response) => {
      setHeroes(response.data.hs);
    })
    .catch(() => console.error("no submariner"));
  }

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
      layout="vertical"
      formValue={formData}
      plaintext={!editable}
      // model={model}
      // ref={ref => (this.form = ref)}
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
        <HelpBlock>
          Кратко опишите что на снимке, какое событие и т.д.
        </HelpBlock>
      </FormGroup>
      <CustomFormField
        sticky
        message="Изображение или член экипажа подлодки"
        label="Подлодка"
        name="submarine"
        accepter={CheckPicker}
        defaultExpandAll={true}
        valueKey="uid"
        value={formData.submarine}
        data={submarine}
        groupBy="project"
        searchable={true}
        block
        onSelect={(value) => getHeroes(value)}
      />
      <CustomFormField 
        label="Подводник"
        name="submariner"
        block
        accepter={CheckPicker}
        data={heroes}
        valueKey="uid"
        labelKey="name"
      />
      <CustomFormField
        message="К какому периоду сделан или отниситься снимок"
        label="Период"
        name="epoch"
        accepter={TreePicker}
        defaultExpandAll={true}
        valueKey="uid"
        value={formData.epoch}
        data={epochData}
        searchable={false}
        block
      />
      <FormGroup>
        <ControlLabel>Место</ControlLabel>
        <FormControl name="place" />
        <HelpBlock>Если известно м.б. регион, город, ...</HelpBlock>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Источник</ControlLabel>
        <FormControl name="source" componentClass="textarea" />
        <HelpBlock>Ссылка или указание на первоисточник</HelpBlock>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Автор</ControlLabel>
        <FormControl name="author" />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Лицензия</ControlLabel>
        <FormControl name="license" />
        <HelpBlock>Если не CC-BY 4.0</HelpBlock>
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

PhotoEditor.propTypes = {
  api: PropTypes.func,
  photo: PropTypes.object,
  editable: PropTypes.bool,
  onDone: PropTypes.func,
}
export default PhotoEditor;
