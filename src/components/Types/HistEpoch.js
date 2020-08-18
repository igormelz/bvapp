/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Alert,
  Panel,
  Tree,
  FlexboxGrid,
  IconButton,
  Icon,
  Drawer,
  Input,
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
} from "rsuite";
import { useQuery, useMutation } from "urql";

const Query = `
{
  queryHistEpoch (order:{asc:datePeriod}) {
    id
    label
    datePeriod
    children (order:{asc:datePeriod}) {
      id
      label
      datePeriod
    }
  }
}
`;

const UpdateNode = `
mutation updateHistEpoch($input: UpdateHistEpochInput!) {
  updateHistEpoch(input: $input) {
    numUids
  }
}
`;

const UpdateSubNode = `
mutation updateHistSubEpoch($input: UpdateHistSubEpochInput!) {
  updateHistSubEpoch(input: $input) {
    numUids
  }
}
`;

const DeleteNode = `
mutation deleteHistEpoch($filter: HistEpochFilter!) {
  deleteHistEpoch(filter: $filter) {
    numUids
  }
}
`;

const DeleteSubNode = `
mutation deleteHistSubEpoch($filter: HistSubEpochFilter!) {
  deleteHistSubEpoch(filter: $filter) {
    numUids
  }
}
`;

const AddNode = `
mutation addHistEpoch($input: AddHistEpochInput!) {
  addHistEpoch(input: [$input]) {
    histEpoch {
      id
    }
  }
}
`;

// const AddSubNode = `
// mutation addHistSubEpoch($input: AddHistSubEpochInput!) {
//   addHistSubEpoch(input: [$input]) {
//     histSubEpoch {
//       id
//     }
//   }
// }
// `;

const HistEpoch = () => {
  const [result, reexecuteQuery] = useQuery({
    query: Query,
    requestPolicy: "network-only",
  });
  const { data, fetching, error } = result;
  const [updNodeResult, updateNode] = useMutation(UpdateNode);
  const [updSubNodeResult, updateSubNode] = useMutation(UpdateSubNode);
  const [addNodeResult, addNode] = useMutation(AddNode);
  //const [addSubNodeResult, addSubNode] = useMutation(AddSubNode);
  const [delNodeResult, delNode] = useMutation(DeleteNode);
  const [delSubNodeResult, delSubNode] = useMutation(DeleteSubNode);
  // tree data 
  const [treeData, setTreeData] = useState([]);
  // trigger modal
  const [showNew, setShowNew] = useState(false);
  // form data
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!fetching && !error) {
      setTreeData(data.queryHistEpoch);
    }
    return () => {
      setTreeData([]);
    }  
  }, [data, fetching, error]);

  const handleNew = () => {
    setFormData({
      nodeId: null,
      label: "",
      datePeriod: "",
    });
    setShowNew(true);
  };

  const handleNewSubmit = () => {
    if (!formData.nodeId) {
      addNode({
        input: {
          label: formData.label,
          datePeriod: formData.datePeriod,
        },
      }).then((result) => {
        if (result.error) {
          Alert.error(result.error.message);
        } else {
          Alert.info(
            "Изменения внесены в БД:" + result.data.addHistEpoch.histEpoch[0].id
          );
        }
      });
    } else {
      updateNode({
        input: {
          filter: {
            id: [formData.nodeId],
          },
          set: {
            children: [
              {
                label: formData.label,
                datePeriod: formData.datePeriod,
              },
            ],
          },
        },
      }).then((result) => {
        if (result.error) {
          Alert.error(result.error.message);
        } else {
          Alert.info("Изменения внесены в БД");
        }
      });
    }
    reexecuteQuery();
    setShowNew(false);
  };

  // EDIT NODE
  const handleEdit = (node) => {
    setFormData(node);
    setShowNew(true);
  };

  // ADD CHILD
  const handleNewNode = (node) => {
    setFormData({
      nodeId: node.id,
      label: "",
      datePeriod: "",
    });
    setShowNew(true);
  };

  const handleEditSubmit = () => {
    const variables = {
      input: {
        filter: {
          id: [formData.id],
        },
        set: {
          label: formData.label,
          datePeriod: formData.datePeriod,
        },
      },
    };
    if (formData.__typename === "HistEpoch") {
      updateNode(variables).then((result) => {
        if (result.error) {
          Alert.error(result.error.message);
        } else {
          Alert.info("Изменения внесены в БД");
          reexecuteQuery();
        }
      });
    } else {
      updateSubNode(variables).then((result) => {
        if (result.error) {
          Alert.error(result.error.message);
        } else {
          Alert.info("Изменения внесены в БД");
          reexecuteQuery();
        }
      });
    }
    setShowNew(false);
  };

  const handleDeleteNode = (node) => {
    const variables = {
      filter: {
        id: [node.id],
      },
    };
    if (node.__typename === "HistEpoch") {
      delNode(variables).then((result) => {
        if (result.error) {
          Alert.error(result.error.message);
        } else {
          Alert.info("Deleted");
        }
      });
    } else {
      delSubNode(variables).then((result) => {
        if (result.error) {
          Alert.error(result.error.message);
        } else {
          Alert.info("Deleted");
        }
      });
    }
    reexecuteQuery();
  };

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <Panel
      header={
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item>
            <span style={{ fontSize: "16px" }}>Исторические периоды</span>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <IconButton
              icon={<Icon icon="plus-circle" />}
              placement="left"
              onClick={handleNew}
            >
              Добавить эпоху
            </IconButton>
            <Drawer show={showNew} onHide={() => setShowNew(false)} size="xs">
              <Drawer.Header>
                <Drawer.Title>
                  {formData.id ? "Изменить" : "Добавить"}
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Form
                  fluid
                  formValue={formData}
                  onChange={(formValue) => {
                    setFormData(formValue);
                  }}
                >
                  <FormGroup>
                    <ControlLabel>Наименование</ControlLabel>
                    <FormControl name="label" />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Начало периода (гггг-мм-дд)</ControlLabel>
                    <FormControl name="datePeriod" />
                  </FormGroup>
                </Form>
              </Drawer.Body>
              <Drawer.Footer>
                {!formData.id && (
                  <Button onClick={handleNewSubmit} appearance="primary">
                    Добавить
                  </Button>
                )}
                {formData.id && (
                  <Button onClick={handleEditSubmit} appearance="primary">
                    Обновить
                  </Button>
                )}
                <Button onClick={() => setShowNew(false)} appearance="subtle">
                  Отмена
                </Button>
              </Drawer.Footer>
            </Drawer>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      }
    >
      <Tree
        virtualized
        data={treeData}
        defaultExpandAll
        valueKey="id"
        renderTreeNode={(nodeData) => (
          <div>
            <span>{nodeData.label}</span>
            <IconButton
              appearance="link"
              icon={<Icon icon="edit" />}
              onClick={() => handleEdit(nodeData)}
            />
            {nodeData.__typename === "HistEpoch" && (
              <IconButton
                appearance="link"
                icon={<Icon icon="plus-square" />}
                onClick={() => handleNewNode(nodeData)}
              />
            )}
            <IconButton
              appearance="link"
              icon={<Icon icon="minus-square" />}
              onClick={() => handleDeleteNode(nodeData)}
            />
          </div>
        )}
      />
    </Panel>
  );
};

export default HistEpoch;
