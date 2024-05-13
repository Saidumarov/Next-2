"use client";
import { useState, useRef, useEffect } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Users } from "@/types";
import axios from "axios";

function UserLest() {
  const [data, setData] = useState<Users[]>();
  const [Id, setId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [btnloading, setBtnloading] = useState({
    loading: false,
    delete: false,
    id: "",
  });
  const initialRef = useRef<HTMLInputElement>(null);
  const [editId, setEditId] = useState(false);
  const [isloading, setIsloading] = useState(true);
  const [user, setUser] = useState({
    fullname: "",
    age: 0,
  });

  const handelChane = (e: any) => {
    setUser({
      ...user,
      [e.name]: e.value,
    });
  };

  const handelSave = async () => {
    setBtnloading({
      ...btnloading,
      loading: true,
    });
    try {
      await axios.post("http://localhost:3000/users/api", user);
      toast({
        title: `Added successfully`,
        status: "success",
        isClosable: true,
      });
      onClose();
      setBtnloading({
        ...btnloading,
        loading: false,
      });
      setUser({
        fullname: "",
        age: 0,
      });
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  async function fetchData() {
    try {
      const res = await axios.get("http://localhost:3000/users/api");
      const data = await res.data;
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const hemdelDelete = async (id: string) => {
    setBtnloading({
      ...btnloading,
      delete: true,
      id: id,
    });
    try {
      await axios.delete(`http://localhost:3000/users/api/${id}`);
      toast({
        title: `Deleted successfully`,
        status: "error",
        isClosable: true,
      });
      fetchData();
      setBtnloading({
        ...btnloading,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handelEdit = (id: string) => {
    setId(id);
    data?.filter((el) => {
      if (el._id === id) {
        setUser({
          fullname: el.fullname,
          age: el.age,
        });
      }
    });
    setEditId(true);
    onOpen();
  };

  const hemdelEditSave = async () => {
    setBtnloading({
      ...btnloading,
      loading: true,
    });
    await axios.put(`http://localhost:3000/users/api/${Id}`, user);
    onClose();
    fetchData();
    setEditId(false);
    toast({
      title: `Updated successfully`,
      status: "warning",
      isClosable: true,
    });
    setBtnloading({
      loading: false,
      delete: false,
      id: "",
    });
    setUser({
      fullname: "",
      age: 0,
    });
  };

  return (
    <div className="pt-[50px]">
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setUser({
            fullname: "",
            age: 0,
          });
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editId ? "Update Todo" : "Add Todo"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                value={user.fullname}
                onChange={(e) => handelChane(e.target)}
                ref={initialRef}
                placeholder="Full Name"
                name="fullname"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Age</FormLabel>
              <Input
                value={user.age}
                onChange={(e) => handelChane(e.target)}
                ref={initialRef}
                placeholder="Age"
                name="age"
                type="number"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {editId === false ? (
              <Button
                isDisabled={!user.age || !user.fullname}
                colorScheme="blue"
                mr={3}
                onClick={handelSave}
                isLoading={btnloading.loading}
              >
                Save
              </Button>
            ) : (
              <Button
                isDisabled={!user.age || !user.fullname}
                colorScheme="blue"
                mr={3}
                onClick={hemdelEditSave}
                isLoading={btnloading.loading}
              >
                Update
              </Button>
            )}
            <Button
              onClick={() => (
                onClose(),
                setUser({
                  fullname: "",
                  age: 0,
                })
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
            onOpen(), setEditId(false);
          }}
        >
          Add
        </Button>
      </div>
      <div className="pb-28">
        <Box
          borderRadius={"10px"}
          marginTop={"50px"}
          padding={"20px"}
          bg={"rgb(237, 235, 245)"}
        >
          {data && data?.length > 0 ? (
            data?.map((todo: Users, i) => (
              <Box
                key={todo._id}
                marginTop={"20px"}
                bg={"rgb(255, 255, 255)"}
                padding={"20px"}
                borderRadius={"10px"}
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Text>ID: {i + 1}</Text>
                  <Text>Full Name: {todo.fullname}</Text>
                  <Text>Age: {todo.age}</Text>
                  <ButtonGroup>
                    <Button
                      colorScheme="red"
                      onClick={() => hemdelDelete(todo._id)}
                      isLoading={
                        btnloading.id === todo._id && btnloading.delete
                      }
                    >
                      <DeleteIcon />
                    </Button>
                    <Button
                      colorScheme="orange"
                      onClick={() => handelEdit(todo._id)}
                    >
                      <EditIcon />
                    </Button>
                  </ButtonGroup>
                </Flex>
              </Box>
            ))
          ) : (
            <Heading textAlign={"center"} fontSize={"22px"}>
              {isloading ? <Spinner /> : "No Users"}
            </Heading>
          )}
        </Box>
      </div>
    </div>
  );
}

export default UserLest;
