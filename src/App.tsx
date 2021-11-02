import React, { useState } from 'react';
import { DefaultTheme, Provider as ThemeProvider, Searchbar, Title } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { Icon, Avatar } from 'react-native-elements'

import { UserContext, UserProvider } from './Reducer/User'

import Login from "./Components/Logger"
import Profile from './Components/Profile'
import Home from './Components/Home'
import Theme from './Theming/Theme';
import Subreddit from './Components/Subreddit';

const Username = "Redditech"

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const styles = StyleSheet.create({
  searchBarContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerTitle: {
    width: '100%'
  },
  searchBar: {
    backgroundColor: '#292929',
    width: 175,
    left: '-30%',
  },
  searchBarInput: {
    fontSize: 15,
    justifyContent: 'center'
  },
  headerProfile: {
    right: 0,
    top: '50%',
    color: Theme.colors.icon,
  }
})

const Communities = () => {
  return (
    <Text>Zizi</Text>
  )
}

const Publish = () => {
  return (
    <Text>Zizi</Text>
  )
}

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={Theme.colors.text}
      inactiveColor={Theme.colors.accent}
      barStyle={{ backgroundColor: Theme.colors.primary }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <Icon name="home" color='#fff' type='material-ui'/>
          ),
        }}
      />
      <Tab.Screen
        name="Publish"
        component={Publish}
        options={{
          tabBarLabel: 'Publish',
          tabBarIcon: () => (
            <Icon name="add" color='#fff' type='ionicon'/>
          ),
        }}
      />
      <Tab.Screen
        name="Communities"
        component={Communities}
        options={{
          tabBarLabel: 'Communities',
          tabBarIcon: () => (
            <Icon name="earth-outline" color='#fff' type='ionicon'/>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const LoginScreen = () => {

  const [ state, dispatch ] = React.useContext(UserContext);

  const [ searchInput, setSearchInput ] = useState('');
  const [ searchedReddit, setSearchReddit ] = useState('');

  const handleSearch = (input: string) => {
    setSearchInput(input);
  }

  async function submitSearch( navigation, input: string) {
    const search = input;

    setSearchReddit(input);
    await dispatch({ subreddit: input, type: 'get-subreddit' })
    input = await state.Requester.getSubreddit(input).fetch()
    .then(Subreddit => ({
      title: Subreddit.title,
      name: Subreddit.name,
      subscribers: Subreddit.subscribers,
      accounts_active: Subreddit.accounts_active,
      public_description: Subreddit.public_description,
      banner_background_color: Subreddit.banner_background_color,
      banner_background_image: Subreddit.banner_background_image,
      community_icon: Subreddit.community_icon
    }))
    if (input) {
      await dispatch({ searchedSubreddit: input, type: 'get-subreddit-search' });
      await dispatch({ subredditPosts: await state.Requester.getSubreddit(search).getHot(), type: "get-subreddit-posts" });
      navigation.navigate('Subreddit');
    }
  }

  return (
    <Stack.Navigator
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={() => ({
          headerShown: false,
          animationEnabled: false,
        })}
      />
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={({ navigation, route }) => ({
          animationEnabled: false,
          headerTitle: () =>
            <Title style={styles.headerTitle}>Home</Title>
          ,
          headerStyle: {
            backgroundColor: Theme.colors.primary
          },
          headerTintColor: '#fff',
          headerBackVisible: false,
          headerRight: () =>
            <View style={styles.searchBarContainer}>
              <Searchbar
                onIconPress={() => submitSearch(navigation, searchInput)}
                onSubmitEditing={() => submitSearch(navigation, searchInput)}
                onChangeText={handleSearch}
                style={styles.searchBar}
                inputStyle={styles.searchBarInput}
                placeholder="Search"
                value={searchInput}
              />
              <Icon
                iconStyle={styles.headerProfile}
                name='account'
                type='material-community'
                size={25}
                onPress={() => navigation.navigate('Profile')}
              />
            </View>
        })}
      />
      <Stack.Screen
        name="Subreddit"
        component={Subreddit}
        options={() => ({
          animationEnabled: false,
          title: 'Subreddit',
          headerStyle: {
            backgroundColor: Theme.colors.primary,
          },
        })}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={() => ({
          animationEnabled: false,
          title: 'Profile',
          headerStyle: {
            backgroundColor: Theme.colors.primary,
          },
          headerTintColor: '#EBF2FA',
        })}
      />
    </Stack.Navigator>
  )
}


const App = () => {

  return (
    <UserProvider>
      <ThemeProvider theme={Theme}>
        <NavigationContainer theme={Theme}>
          <LoginScreen />
        </NavigationContainer>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
