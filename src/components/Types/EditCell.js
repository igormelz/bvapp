import React from "react";
import PropTypes from "prop-types";
import { Table } from "rsuite";

const EditCell = ({ rowData, dataKey, onChange, ...props }) => { 
  const editing = rowData.status === "EDIT";
  return (
    <Table.Cell {...props} className={editing ? "table-content-editing" : ""}>
      {editing ? (
        <input
          className="rs-input"
          style={{padding: 0}}
          defaultValue={rowData[dataKey]}
          onChange={(event) => {
            onChange && onChange(rowData.id, dataKey, event.target.value);
          }}
        />
      ) : (
        <span className="table-content-edit-span">{rowData[dataKey]}</span>
      )}
    </Table.Cell>
  );
};

EditCell.propTypes = {
  rowData: PropTypes.object,
  dataKey: PropTypes.string,
  onChange: PropTypes.func,
};

export default EditCell;
