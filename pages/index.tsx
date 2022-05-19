import type { NextPage } from "next";
import { CenteredContainer } from "../components/CenteredContainer";
import { NavMenu } from "../components/NavMenu";

const Home: NextPage = () => {
  // useEffect(() => {
  //   (async () => {
  //     const result = await axios.get("/api/hello");
  //     console.log({ result });
  //   })();
  // }, []);

  return (
    <CenteredContainer>
      <NavMenu />
    </CenteredContainer>
  );
};

export default Home;
