import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Title } from 'react-native-paper';
import { Icon, Text, Card, FAB } from 'react-native-elements'
import { ActivityIndicator, Button } from 'react-native-paper';
import YoutubePlayer from 'react-native-youtube-iframe';

import { UserContext } from '../Reducer/User'

import Theme from '../Theming/Theme';
import WebView from 'react-native-webview';

var dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime');
var utc = require('dayjs/plugin/utc')

dayjs.extend(relativeTime);
dayjs.extend(utc);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  Text: {
    color: Theme.colors.text,
  },
  Banner: {
    height: '10%',
    width: '10%'
  },
  Icon: {
    height: windowHeight / 10,
    width: windowHeight / 10,
    marginTop: -(windowHeight / 14),
    marginLeft: 20,
    borderRadius: 50,
  },
  main: {
    width: '100%',
    height: '100%',
  },
  subredditInfos: {
    maxHeight: '100%'
  },
  subredditTextInfos: {
    padding: 20,
    paddingTop: 0,
    overflow: 'hidden',
  },
  titleContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    fontSize: 18
  },
  subscribeButton: {
  },
  subscribeText: {
    color: Theme.colors.text,
    fontSize: 10,
  },
  userCount: {
    fontSize: 14,
    color: Theme.colors.textShadow
  },
  description: {
    color: Theme.colors.text,
    fontWeight: '100',
    fontSize: 13,
  },
  publicationTab: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: Theme.colors.primary,
    borderWidth: 1,
    marginTop: 0,
  },
  publication: {
    color: Theme.colors.text,
    alignSelf: 'center',
  },
  postsContainer: {
    width: '100%',
    height: '100%',
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    width: windowWidth * 0.93,
    backgroundColor: Theme.colors.background,
    alignSelf: 'center',
  },
  filterButton: {
    width: windowWidth * 0.25,
    backgroundColor: Theme.colors.background,
    borderColor: Theme.colors.accent,
    borderWidth: 1,
    alignSelf: 'center',
  },
  selectedFilterButton: {
    backgroundColor: Theme.colors.loader,
    borderColor: Theme.colors.loader,
    alignSelf: 'center',
  },
  filterButtonDisabled: {
    width: windowWidth * 0.25,
    backgroundColor: Theme.colors.accent,
    borderColor: Theme.colors.accent,
    borderWidth: 1,
    alignSelf: 'center',
  },
  loaderContainer: {
    alignContent: 'flex-start',
    height: windowHeight,
  },
  loader: {
    alignSelf: 'center',
    top: windowHeight / 10,
  },
})

const filters = {
	HOTPOSTS: 0,
	NEWPOSTS: 1,
	BESTPOSTS: 2,
}

const Subreddit = () => {

    const [ state, dispatch ] = React.useContext(UserContext);
    const [ filter, setFilter ] = useState(filters.HOTPOSTS);
    const LoaderSize = 128;

    async function getHotPosts() {
      dispatch({ subredditPosts: null, type: "get-subreddit-posts" });
      dispatch({ subredditPosts: await state.Requester.getSubreddit(state.subreddit).getHot({ limit: 10 }), type: "get-subreddit-posts" });
    }

    async function getNewPosts() {
      dispatch({ subredditPosts: null, type: "get-subreddit-posts" });
      dispatch({ subredditPosts: await state.Requester.getSubreddit(state.subreddit).getNew({ limit: 10 }), type: "get-subreddit-posts" });
    }

    async function getTopPosts() {
      dispatch({ subredditPosts: null, type: "get-subreddit-posts" });
      dispatch({ subredditPosts: await state.Requester.getSubreddit(state.subreddit).getTop({ limit: 10 }), type: "get-subreddit-posts" });
    }

    async function getMoreSubredditPosts() {
      dispatch({ subredditPosts: await state.subredditPosts.fetchMore({ amount: 2 }), type: 'get-subreddit-posts' });
    }

    const setPostFilter = (FilterType: number) => {
      setFilter(FilterType);
      switch (FilterType) {
        case filters.HOTPOSTS:
          getHotPosts();
          break;
        case filters.NEWPOSTS:
          getNewPosts();
          break;
        case filters.BESTPOSTS:
          getTopPosts();
          break;
        default:
          return;
      }
    }

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
      const paddingToBottom = 20;
      return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
    };

    function getYoutubeID(url: string) {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return (match&&match[7].length==11)? match[7] : false;
  }

    return (
        <View>
            {
            state.searchedSubreddit ?
            <View style={styles.main}>
              <ScrollView
                onScroll={({nativeEvent}) => {
                  if (isCloseToBottom(nativeEvent))
                    getMoreSubredditPosts();
                }}
              >
              <View style={styles.subredditInfos}>
                <Image style={{ height: windowHeight / 6, width: windowWidth }} source={{ uri: state.searchedSubreddit.banner_background_image }}/>
                <Image style={styles.Icon} source={{ uri: state.searchedSubreddit.community_icon }}/>
                <View style={styles.subredditTextInfos}>
                  <View style={styles.titleContainer}>
                    <Title style={styles.title}>{state.searchedSubreddit.title}</Title>
                    <FAB
                      onPress={() => state.Requester.getSubreddit(state.subreddit).subscribe()}
                      icon={
                        <Icon
                        name="add"
                        size={15}
                        color="white"
                        />
                      }
                      style={styles.subscribeButton}
                      size='small'
                      color={state.searchedSubreddit.banner_background_color}
                    />
                  </View>
                  <Title style={styles.userCount}>{state.searchedSubreddit.subscribers} subscribers ● {state.searchedSubreddit.accounts_active} online</Title>
                  <Text style={styles.description}>{state.searchedSubreddit.public_description}</Text>
                </View>
                <View style=  {styles.publicationTab}>
                  <Title style={styles.publication}>Publications</Title>
                </View>
                <View style={styles.postsContainer}>
                    <View style={styles.filterContainer}>
                      <Button
                        style={filter == filters.HOTPOSTS ? styles.filterButtonDisabled : styles.filterButton}
                        mode="outlined"
                        icon={filter == filters.HOTPOSTS ? null : "fire"}
                        disabled={filter == filters.HOTPOSTS ? true : false}
                        color={Theme.colors.icon}
                        onPress={() => setPostFilter(filters.HOTPOSTS)}
                      >
                        <Text style={{ color: Theme.colors.text }}>Hot</Text>
                      </Button>
                      <Button
                        style={filter == filters.NEWPOSTS ? styles.filterButtonDisabled : styles.filterButton}
                        mode="outlined"
                        icon={filter == filters.NEWPOSTS ? null : "clock"}
                        disabled={filter == filters.NEWPOSTS ? true : false}
                        color={Theme.colors.icon}
                        onPress={() => setPostFilter(filters.NEWPOSTS)}
                      >
                        <Text style={{ color: Theme.colors.text }}>New</Text>
                      </Button>
                      <Button
                        style={filter == filters.BESTPOSTS ? styles.filterButtonDisabled : styles.filterButton}
                        mode="outlined"
                        icon={filter == filters.BESTPOSTS ? null : "check"}
                        disabled={filter == filters.BESTPOSTS ? true : false}
                        color={Theme.colors.icon}
                        onPress={() => setPostFilter(filters.BESTPOSTS)}
                      >
                        <Text style={{ color: Theme.colors.text }}>Top</Text>
                      </Button>
                    </View>
                    {
                      state.subredditPosts ?
                        state.subredditPosts.map((Post, index) =>
                          <TouchableOpacity activeOpacity={0.8} key={index} onPress={() => { }}>
                            <Card key={index} containerStyle={{ backgroundColor: Theme.colors.background, borderColor: Theme.colors.accent }}>
                              {
                                //<Card.Image style={{ alignSelf: 'center', margin: 20, height: windowHeight / 8, width: windowHeight / 8, borderRadius: 75 }} source={{ uri: JSON.stringify(Post.author.icon_img) }}/>
                              }
                              <Text
                                style={{ paddingTop: -20, fontSize: 12, color: Theme.colors.textShadow, alignSelf: 'baseline' }}
                              >
                                {"u/" + Post.author.name} ● {dayjs.unix(Post.created).fromNow()}
                              </Text>
                              <Text
                                style={{ fontSize: 16, fontWeight: '600', color: Theme.colors.text, paddingTop: 10, paddingBottom: 5 }}
                              >
                                {Post.title}
                              </Text>
                              {
                              Post.selftext ?
                                <Text
                                  style={{ fontSize: 13, fontWeight: 'bold', color: Theme.colors.textShadow, paddingBottom: 10 }}
                                >
                                  {Post.selftext}
                                </Text>
                                : null
                              }
                              {
                                Post.url.slice(Post.url.length - 3, Post.url.length) == 'jpg'
                                  || Post.url.slice(Post.url.length - 3, Post.url.length) == 'png'
                                  ? <Card.Image
                                    height={Post.thumbnail_height}
                                    width={Post.thumbnail_width}
                                    source={{ uri: Post.url }}
                                  />
                                  : getYoutubeID(Post.url)
                                  ? <YoutubePlayer
                                      height={190}
                                      videoId={getYoutubeID(Post.url)}
                                      webViewStyle={{opacity: 0.99}}
                                    />
                                  : null
                              }
                            </Card>
                          </TouchableOpacity>
                        )
                        :
                        <View style={styles.loaderContainer}>
                          <ActivityIndicator
                            style={styles.loader}
                            animating={true}
                            color={Theme.colors.loader}
                            size={64}
                          />
                        </View>
                    }

                </View>
              </View>
              </ScrollView>
            </View>
            :
            <View style={styles.loaderContainer}>
              <ActivityIndicator
                animating={true}
                color={Theme.colors.loader}
                size={128}
              />
              <Text style={styles.Text}>
                Loading posts...
              </Text>
            </View>
            }
        </View>
    )
}

export default Subreddit