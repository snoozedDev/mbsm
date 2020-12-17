import { useEffect } from "react";
import { connect } from "react-redux";
import { getUser } from "../../redux/actions/auth";
import { RootState } from "../../redux/reducers";
import { AuthState } from "../../redux/reducers/auth";
import { ScreenLoader } from "../Common/ScreenLoader";

interface AuthGateComponentProps {
  getUser?: typeof getUser;
  auth?: AuthState;
  children?: JSX.Element;
  onAuthenticated?: () => void;
  onUnauthenticated?: () => void;
}

const AuthGateComponent = ({
  children,
  getUser,
  auth,
  onAuthenticated,
  onUnauthenticated,
}: AuthGateComponentProps) => {
  useEffect(() => {
    if (!auth.loggedIn) getUser();
  }, []);

  useEffect(() => {
    const { fetched, loggedIn } = auth;
    if (fetched) {
      if (loggedIn) onAuthenticated && onAuthenticated();
      else onUnauthenticated && onUnauthenticated();
    }
  }, [auth]);

  return !auth.fetched ? (
    <ScreenLoader />
  ) : children && auth.loggedIn ? (
    children
  ) : (
    <div />
  );
};

const mapStateToProps = ({ auth }: RootState) => {
  return {
    auth,
  };
};

const mapDispatchToProps = {
  getUser,
};

export const AuthGate = connect<any>(
  mapStateToProps,
  mapDispatchToProps
)(AuthGateComponent);
