import { useEffect } from "react";
import { connect } from "react-redux";
import { AuthGate } from "../components/Containers/AuthGate";
import { FeedScreen } from "../components/Screens/FeedScreen";
import { getFeed } from "../redux/actions/feed";
import { RootState } from "../redux/reducers";
import { FeedState } from "../redux/reducers/feed";

interface FeedProps {
  getFeed: typeof getFeed;
  feed: FeedState;
}

const Feed = ({ getFeed, feed }: FeedProps) => {
  useEffect(() => {
    getFeed();
  }, []);

  const onFeedRefresh = () => getFeed();

  return (
    <AuthGate>
      <FeedScreen
        posts={feed.posts}
        loading={feed.loading}
        onFeedRefresh={onFeedRefresh}
      />
    </AuthGate>
  );
};

const mapStateToProps = ({ feed }: RootState) => {
  return {
    feed,
  };
};

const mapDispatchToProps = {
  getFeed,
};

export default connect<any>(mapStateToProps, mapDispatchToProps)(Feed);
