import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, DatePicker, SelectPicker, Input } from "rsuite";
import CustomFormField from "./CustomFormField";
import { useAuthApi } from "../utils/authApi";
import { todms } from "../utils/helper";

const EditSub = ({ sub, onClose, onSubmit }) => {
  const api = useAuthApi();
  const [formData, setFormData] = useState({
    uid: sub.uid || null,
    label: sub.label || "",
    project: sub.project && sub.project.uid,
    series: sub.series || "",
    startdate: sub.startdate,
    enddate: sub.enddate,
    fate: sub.fate || "",
    lat: (sub.location && todms(sub.location.coordinates[0])) || undefined,
    lng: (sub.location && todms(sub.location.coordinates[1])) || undefined,
  });

  const updateSub = () => {
    api
      .post("/photo/submarine", formData)
      .then(() => {
        onSubmit();
      })
      .catch(() => {
        console.log("ERROR");
        onClose();
      });
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header>
        <Modal.Title>{sub.uid ? "Edit" : "Add"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          layout="horizontal"
          formValue={formData}
          onChange={(formValue) => {
            setFormData(formValue);
          }}
        >
          <CustomFormField name="label" label="Наименование" />
          <CustomFormField
            accepter={DatePicker}
            oneTap
            format="DD.MM.YYYY"
            name="startdate"
            label="Вступление в строй"
          />
          <CustomFormField
            accepter={DatePicker}
            oneTap
            format="DD.MM.YYYY"
            name="enddate"
            label="Окончание службы"
          />
          <CustomFormField
            name="series"
            label="Серия"
            data={sub.project.seriesList.map((s)=>({
              label: s,
              value: s,
            }))}
            accepter={SelectPicker}
            searchable={false}
          />
          <CustomFormField name="fate" label="Статус" accepter={Input} />
          <CustomFormField name="lat" label="Широта" accepter={Input} />
          <CustomFormField name="lng" label="Долгота" accepter={Input} />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={updateSub} appearance="primary">
          Сохранить
        </Button>
        <Button onClick={onClose} appearance="subtle">
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

EditSub.propTypes = {
  sub: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default EditSub;
