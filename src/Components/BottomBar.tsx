import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

const HomeRoute = () => <Text></Text>;

const CommunitiesRoute = () => <Text></Text>;

const PublishRoute = () => <Text></Text>;

const DiscussionRoute = () => <Text></Text>;

const ReceptionRoute = () => <Text></Text>;

const BottomBar = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'communities', title: 'Communities', icon: 'account-group', color: '#4F376D' },
    { key: 'publish', title: 'Publish', icon: 'plus', color: '#45305F' },
    { key: 'discussion', title: 'Discussions', icon: 'chat', color: '#3B2951' },
    { key: 'reception', title: 'Receptions', icon: 'bell', color: '#312244' },
  ]);

  const renderScene =  BottomNavigation.SceneMap({
    home: HomeRoute,
    communities: CommunitiesRoute,
    publish: PublishRoute,
    discussion: DiscussionRoute,
    reception: ReceptionRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default BottomBar;