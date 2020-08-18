import React from "react";
import PropTypes from "prop-types";
import { Table, Button } from "rsuite";

const ActionCell = ({ rowData, onClick, onCancel, ...props }) => (
  <Table.Cell {...props} style={{ padding: "6px 0" }}>
    <Button
      appearance="link"
      onClick={() => {
        onClick && onClick(rowData.id);
      }}
    >
      {rowData.status === "EDIT" ? "Сохранить" : "Редактировать"}
    </Button>
    {rowData.status && (
      <Button appearance="link" 
        onClick={() => onCancel(rowData.id)}
      >
        Отмена
      </Button>
    )}
  </Table.Cell>
);

ActionCell.propTypes = {
  rowData: PropTypes.object,
  onClick: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ActionCell;
