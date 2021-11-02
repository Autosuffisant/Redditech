import * as React from 'react';
import { Appbar, Title, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Redditech = "Redditech"

const ProfileRoute = () => <Text></Text>;

const TopBar = () => (
 <Appbar style={styles.top}>
   <Appbar.Action
     icon="account"
     onPress={() => console.log('Pressed profile')}
    />
    <Title
      style={styles.center}
    >
      {Redditech}
    </Title>
    <Appbar.Action
      style={styles.right}
      icon="cog"
      onPress={() => console.log('Pressed delete')}
    />
  </Appbar>
 );

const styles = StyleSheet.create({
  top: {
    justifyContent: 'space-between',
    left: 0,
    top: 0,
  },
  right: {
    position: 'relative',
    right: 0,
    top: 0,
  },
  center: {
    position: 'relative',
    color: '#ffffff',
  },
});

export default TopBar