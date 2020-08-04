import React, { useState } from "react";
import { followUser, unfollowUser } from "../../utils/api";
import { OtherUser } from "../../utils/types";

interface ProfileScreenProps {
  user: OtherUser;
}

export const ProfileScreen = ({ user }: ProfileScreenProps) => {
  const [stateUser, setUser] = useState(user);

  const onFollow = async () => {
    const result = await followUser({ username: user.username });
    if (result.success)
      setUser((prevUser) => ({ ...prevUser, following: !prevUser.following }));
  };

  const onUnfollow = async () => {
    const result = await unfollowUser({ username: user.username });
    if (result.success)
      setUser((prevUser) => ({ ...prevUser, following: !prevUser.following }));
  };

  return (
    <div>
      <span>{stateUser.username}</span>
      <button onClick={stateUser.following ? onUnfollow : onFollow}>
        {stateUser.following ? `Unfollow` : `Follow`}
      </button>
    </div>
  );
};
