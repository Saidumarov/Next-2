import UserLest from "@/components";
import { Container } from "@chakra-ui/react";

const Home = () => {
  return (
    <div>
      <Container maxWidth={"900px"} margin={"auto"}>
        <UserLest />
      </Container>
    </div>
  );
};

export default Home;
