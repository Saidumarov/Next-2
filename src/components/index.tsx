"use client";
import { useState, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Select,
  Box,
  ButtonGroup,
  Text,
  Checkbox,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

function UserLest() {
  const todos: any = [];
  const [editText, setEditText] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [completed, setCompleted] = useState<boolean>(false);
  const initialRef = useRef<HTMLInputElement>(null);
  const [editId, setEditId] = useState<string | null>(null);

  return (
    <div className="pt-[50px]">
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setCompleted(false);
          setEditText("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editId ? "Update Todo" : "Add Todo"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                ref={initialRef}
                placeholder="Title"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Status</FormLabel>
              <Select>
                <option value="false">Incomplete</option>
                <option value="true">Completed</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {editId === null ? (
              <Button isDisabled={!editText} colorScheme="blue" mr={3}>
                Save
              </Button>
            ) : (
              <Button isDisabled={!editText} colorScheme="blue" mr={3}>
                Update
              </Button>
            )}
            <Button
              onClick={() => (
                onClose(), setEditText(""), setCompleted(false), setEditId(null)
              )}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="flex justify-between items-center">
        <Heading>Users List</Heading>
        <Button
          width={"120px"}
          height={"45px"}
          colorScheme="teal"
          variant="outline"
          onClick={() => {
            onOpen();
          }}
        >
          Add
        </Button>
      </div>
      <div>
        <Box marginTop={"50px"} padding={"20px"} bg={"rgb(237, 235, 245)"}>
          {todos.length > 0 ? (
            todos.map((todo: any) => (
              <Box
                key={todo.id}
                marginTop={"20px"}
                bg={"rgb(255, 255, 255)"}
                padding={"20px"}
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Checkbox
                    size="lg"
                    colorScheme="green"
                    isChecked={todo.completed}
                  >
                    {todo?.completed ? (
                      <Text>{todo.text}</Text>
                    ) : (
                      <s>
                        <Text>{todo.text}</Text>
                      </s>
                    )}
                  </Checkbox>
                  <ButtonGroup>
                    <Button colorScheme="red">
                      <DeleteIcon />
                    </Button>
                    <Button colorScheme="orange">
                      <EditIcon />
                    </Button>
                  </ButtonGroup>
                </Flex>
              </Box>
            ))
          ) : (
            <Heading textAlign={"center"} fontSize={"22px"}>
              No Users
            </Heading>
          )}
        </Box>
      </div>
    </div>
  );
}

export default UserLest;
