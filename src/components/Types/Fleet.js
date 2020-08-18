import React, { useState, useEffect } from "react";
import {
  Alert,
  Panel,
  Table,
  FlexboxGrid,
  IconButton,
  Icon,
  Drawer,
  Input,
  Button,
} from "rsuite";
import { useQuery, useMutation } from "urql";
import EditCell from "./EditCell";
import ActionCell from "./ActionCell";

const FleetQuery = `
query {
  queryFleet {
    id
    label
  }
}
`;

const UpdateFleet = `
mutation updateFleet($input: UpdateFleetInput!) {
  updateFleet(input: $input) {
    numUids
  }
}
`;

const AddFleet = `
mutation addFleet($input: AddFleetInput!) {
  addFleet(input: [$input]) {
    numUids
  }
}
`;

const Fleet = () => {
  const [result, reexecuteQuery] = useQuery({
    query: FleetQuery,
    requestPolicy: "network-only",
  });
  const { data, fetching, error } = result;
  const [tableData, setTableData] = useState();
  // eslint-disable-next-line no-unused-vars
  const [updResult, updateFleet] = useMutation(UpdateFleet);
  // eslint-disable-next-line no-unused-vars
  const [addResult, addFleet] = useMutation(AddFleet);
  const [showNew, setShowNew] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    if (!fetching && !error) {
      setTableData(
        data.queryFleet.map((f) => ({
          ...f,
          status: null,
        }))
      );
    }
  }, [data, fetching, error]);

  const handleNew = () => {
    setShowNew(true);
  };

  const handleNewSubmit = () => {
    const variables = {
      input: {
        label: newLabel,
      },
    };
    addFleet(variables).then((result) => {
      if (result.error) {
        Alert.error(result.error.message);
      } else {
        Alert.info("Изменения внесены в БД");
        reexecuteQuery();
      }
    });
    setShowNew(false);
    setNewLabel("");
  };

  const handleChange = (id, key, value) => {
    const nextData = Object.assign([], tableData);
    nextData.find((item) => item.id === id)[key] = value;
    setTableData(nextData);
  };

  const handleCancel = (id) => {
    const nextData = Object.assign([], tableData);
    nextData.find((item) => item.id === id).status = null;
    setTableData(nextData);
  };

  const handleEditState = (id) => {
    const nextData = Object.assign([], tableData);
    const activeItem = nextData.find((item) => item.id === id);
    if (activeItem.status) {
      activeItem.status = null;
      const variables = {
        input: {
          filter: {
            id: [activeItem.id],
          },
          set: {
            label: activeItem.label,
          },
        },
      };
      updateFleet(variables).then((result) => {
        if (result.error) {
          Alert.error(result.error.message);
        } else {
          Alert.info("Изменения внесены в БД");
          reexecuteQuery();
        }
      });
    } else {
      activeItem.status = "EDIT";
    }
    setTableData(nextData);
  };

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <Panel
      header={
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item>
            <span style={{ fontSize: "16px" }}>Справочник флотов</span>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <IconButton
              icon={<Icon icon="plus-circle" />}
              placement="left"
              onClick={handleNew}
            >
              Добавить флот
            </IconButton>
            <Drawer show={showNew} onHide={() => setShowNew(false)} size="xs">
              <Drawer.Header>
                <Drawer.Title>Добавить флот</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <div>
                  <div>Наименование:</div>
                  <Input value={newLabel} onChange={(v) => setNewLabel(v)} />
                </div>
              </Drawer.Body>
              <Drawer.Footer>
                <Button onClick={handleNewSubmit} appearance="primary">
                  Добавить
                </Button>
                <Button onClick={() => setShowNew(false)} appearance="subtle">
                  Отмена
                </Button>
              </Drawer.Footer>
            </Drawer>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      }
    >
      <Table data={tableData} autoHeight>
        <Table.Column width={200}>
          <Table.HeaderCell>Наименование</Table.HeaderCell>
          <EditCell dataKey="label" onChange={handleChange} />
        </Table.Column>
        <Table.Column flexGrow={1}>
          <Table.HeaderCell>Action</Table.HeaderCell>
          <ActionCell
            dataKey="id"
            onClick={handleEditState}
            onCancel={handleCancel}
          />
        </Table.Column>
      </Table>
    </Panel>
  );
};

export default Fleet;
