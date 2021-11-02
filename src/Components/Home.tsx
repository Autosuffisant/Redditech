import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Card, Text, ButtonGroup } from 'react-native-elements'
import { ActivityIndicator, Button } from 'react-native-paper';
import YoutubePlayer from 'react-native-youtube-iframe';

import Theme from '../Theming/Theme';

import { UserContext } from '../Reducer/User'

var dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime');
var utc = require('dayjs/plugin/utc')

dayjs.extend(relativeTime);
dayjs.extend(utc);

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
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
  filterButtonDisabled: {
    width: windowWidth * 0.25,
    backgroundColor: Theme.colors.accent,
    borderColor: Theme.colors.accent,
    borderWidth: 1,
    alignSelf: 'center',
  },
  filterText: {
    color: Theme.colors.text,
  },
  selectedFilterButton: {
    backgroundColor: Theme.colors.loader,
    borderColor: Theme.colors.loader,
    alignSelf: 'center',
  }
})

const filters = {
	HOTPOSTS: 0,
	NEWPOSTS: 1,
	BESTPOSTS: 2,
}

const Home = () => {

  const [ state, dispatch ] = React.useContext(UserContext);
  const [ filter, setFilter ] = useState(filters.HOTPOSTS);
  const windowHeight = Dimensions.get('window').height;
  const LoaderSize = 128;

  async function getHotPosts() {
    dispatch({ homePosts: null, type: "get-home-posts" });
    dispatch({ homePosts: await state.Requester.getHot({ limit: 10 }), type: "get-home-posts" });
  }

  async function getNewPosts() {
    dispatch({ homePosts: null, type: "get-home-posts" });
    dispatch({ homePosts: await state.Requester.getNew({ limit: 10 }), type: "get-home-posts" });
  }

  async function getBestPosts() {
    dispatch({ homePosts: null, type: "get-home-posts" });
    dispatch({ homePosts: await state.Requester.getBest({ limit: 10 }), type: "get-home-posts" });
  }

  async function getMoreHomePosts() {
    dispatch({ homePosts: await state.homePosts.fetchMore({ amount: 2 }), type: 'get-home-posts' });
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
        getBestPosts();
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

  function getYoutubeID(url: string){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

  return (
    <ScrollView
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent))
          getMoreHomePosts();
      }}
    >
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
          <Text style={{ color: Theme.colors.text }}>Best</Text>
        </Button>
      </View>
      {
        state.homePosts ?
          state.homePosts.map((Post, index) =>
            <TouchableOpacity activeOpacity={0.8} key={index} onPress={() => { }}>
              <Card key={index} containerStyle={{ overflow: 'hidden', backgroundColor: Theme.colors.background, borderColor: Theme.colors.accent }}>
                {
                  //<Card.Image style={{ alignSelf: 'center', margin: 20, height: windowHeight / 8, width: windowHeight / 8, borderRadius: 75 }} source={{ uri: JSON.stringify(Post.author.icon_img) }}/>
                }
                <Text
                  style={{ fontSize: 13, color: Theme.colors.textShadow, alignSelf: 'baseline' }}
                >
                  r/{Post.subreddit.display_name}
                </Text>
                <Text
                  style={{ paddingTop: -20, fontSize: 13, color: Theme.colors.textShadow, alignSelf: 'baseline' }}
                >
                  {"u/" + Post.author.name} ● {dayjs.unix(Post.created).fromNow()}
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: '600', color: Theme.colors.text, paddingTop: 10 }}
                >
                  {Post.title}
                </Text>
                {
                  Post.selftext ?
                  <Text
                    style={{ fontSize: 13, fontWeight: 'bold', color: Theme.colors.textShadow, paddingTop: 10, paddingBottom: 10 }}
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
                      style={{ marginTop: 5 }}
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
          <View style={{
            marginTop: (windowHeight / 2) - LoaderSize,
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
    </ScrollView>
  )
}

export default Home;