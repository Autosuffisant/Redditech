import React, { useState } from 'react';
import { authorize } from 'react-native-app-auth';
import { Button, ActivityIndicator } from 'react-native-paper';
import { Image, View, Dimensions } from 'react-native';
import { UserContext } from '../Reducer/User';
import Theme from '../Theming/Theme'

const Login = ({navigation}) => {

  const [ isAuth, setIsAuth ] = useState(false);
  const [ state, dispatch ] = React.useContext(UserContext);
  const windowHeight = Dimensions.get('window').height;
  const LoaderSize = 128;

  async function loginAuth() {

    dispatch({ Loading: true, type: "set-loading-state"})
    const config = {
      redirectUrl: 'dev.redditech://oauth/reddit',
      clientId: 'i-9vCC90ilSkA1sMEC2liQ',
      clientSecret: '', // empty string - needed for iOS
      scopes: ['identity', 'edit', 'flair', 'history',
      'modconfig', 'modflair', 'modlog', 'modposts', 'modwiki',
      'mysubreddits', 'privatemessages', 'read', 'report', 'save',
      'submit', 'subscribe', 'vote', 'wikiedit', 'wikiread'
      ],
      serviceConfiguration: {
        authorizationEndpoint: 'https://www.reddit.com/api/v1/authorize.compact',
        tokenEndpoint: 'https://www.reddit.com/api/v1/access_token',
      },
      customHeaders: {
        token: {
          Authorization: 'Basic aS05dkNDOTBpbFNrQTFzTUVDMmxpUQ==',
        },
      },
      additionalParameters: {
        duration: 'permanent',
      }
    };

    // Log in to get an authentication token
    const authState = await authorize(config).then();

    const RT = authState.refreshToken;

    const snoowrap = require('snoowrap');

    const r = new snoowrap({
      userAgent: 'Redditech Autosuffisant',
      clientId: 'i-9vCC90ilSkA1sMEC2liQ',
      clientSecret: '',
      refreshToken: RT,
    });
    r._nextRequestTimestamp = -1;

    // Initialize home
    await dispatch({ homePosts: await r.getHot({ limit: 10 }), type: 'get-home-posts' });

    if (authState) {
      setIsAuth(true);

      // Get all the user data
      await dispatch({ refreshToken: RT, type: "get-refresh-token" });
      await dispatch({ userData: await r.getMe(), type: "get-user-data" });

      // Initialize requester in Reducer
      await dispatch({ Requester: r, type: 'get-requester' });
      dispatch({ Loading: false, type: "set-loading-state"})
      navigation.navigate('HomeTabs');
    }
  }

  return (
    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
      {
        !state.Loading ?
        <>
        <Image style={{ alignSelf: 'center', margin: 20, height: 100, width: 220 }} source={require('../assets/Redditech.png')}/>
        <Button
          icon="login"
          mode="contained"
          onPress={() => loginAuth()}
        >
          Login
        </Button>
        </>
        :
        <View style={{
          marginTop: (windowHeight / 2) - LoaderSize * 3,
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center'
        }}
        >
          <ActivityIndicator
            animating={true}
            color={Theme.colors.loader}
            size={LoaderSize}
          />
        </View>
        }
    </View>
  );
}
export default Login