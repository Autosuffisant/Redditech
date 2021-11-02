import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import { Icon, Text } from 'react-native-elements'

import { UserContext } from '../Reducer/User'

import Theme from '../Theming/Theme';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  bannerImage: {
    alignSelf: 'center',
    height: windowHeight / 6,
    width: windowWidth
  },
  iconImage: {
    marginTop: -(windowHeight) / 11,
    marginBottom: 0,
    margin: 20,
    height: windowHeight / 8,
    width: windowHeight / 8,
    borderRadius: 75
  },
  username: {
    paddingLeft: 5,
    color: Theme.colors.text
  },
  profileContainer: {
    paddingTop: 0,
    padding: 20,
  },
  statsContainer: {
    paddingTop: 5,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  statText: {
    marginLeft: 5,
    color: Theme.colors.text
  },
  descriptionContainer: {
    width: windowWidth / 1.5,
    flexDirection: 'row'
  }
})

var dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime');
var utc = require('dayjs/plugin/utc')

dayjs.extend(relativeTime);
dayjs.extend(utc);

const Profile = () => {

  const [state, dispatch] = React.useContext(UserContext);

  function getProfileDescription() {
    let str = JSON.stringify(state.userData);
    let description = str.split('"public_description":')[1].substring(1);
    description = description.split('"')[0];
    description = description.substring(description.length - 1, 0);
    return description;
  }

  const banner = state.userData.subreddit.display_name.banner_img;
  const profilePicture = state.userData.icon_img;
  const userName = state.userData.name;
  const karma = state.userData.total_karma;
  const userDescription = state.userData.subreddit.display_name.public_description;

  let creationDate = new Date(0);
  creationDate.setUTCSeconds(state.userData.created);

  return (
    <View>
      <Image style={styles.bannerImage} source={{ uri: banner }} />
      <Image style={styles.iconImage} source={{ uri: profilePicture }} />
      <View style={styles.profileContainer}>
        <Title style={styles.username}>u/{userName}</Title>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Icon color={Theme.colors.icon} type='material' name="star"></Icon>
            <Title style={styles.statText}>Karma: {karma}</Title>
          </View>
          <View style={styles.stat} >
            <Icon color={Theme.colors.icon} type='material' name="schedule"></Icon>
            <Title style={styles.statText}>User since: {dayjs.unix(state.userData.created).fromNow(true)}</Title>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Icon color={Theme.colors.icon} type='material' name="article"></Icon>
          <Text style={styles.statText}>{userDescription}</Text>
        </View>
      </View>
    </View>
  )
}

export default Profile