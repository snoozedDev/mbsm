import axios from "axios";
import { NextPageContext } from "next";
import { ProfileScreen } from "../../components/Screens/ProfileScreen";
import { environment } from "../../utils/env";
import { OtherUser } from "../../utils/types";

const { WEB_URL } = environment;

interface ProfileProps {
  success: boolean;
  requestedUsername: string;
  user?: OtherUser;
}

const Profile = ({ success, user, requestedUsername }: ProfileProps) => {
  return success ? (
    <ProfileScreen user={user} />
  ) : (
    <span>{`The user ${requestedUsername} does not exist.`}</span>
  );
};

Profile.getInitialProps = async ({ req, query }: NextPageContext) => {
  const { data } = await axios.get(`${WEB_URL}/api/user/${query.username}`, {
    headers: { Cookie: req.headers.cookie },
  });

  return { ...data, requestedUsername: query.username };
};

export default Profile;
