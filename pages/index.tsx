import Router from "next/router";
import { AuthGate } from "../components/Containers/AuthGate";

const Index = () => {
  return (
    <AuthGate
      onUnauthenticated={() => Router.push("/login")}
      onAuthenticated={() => Router.push("/feed")}
    />
  );
};

export default Index;
