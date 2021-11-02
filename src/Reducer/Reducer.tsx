export const reducer = (state, action) => {
    switch (action.type) {
      case 'get-requester':
        return {
          ...state,
          Requester: action.Requester
        }
      case 'set-loading-state':
        return {
          ...state,
          Loading: !state.Loading
        }
      case 'get-refresh-token':
        return {
          ...state,
          refreshToken: action.refreshToken
        }
      case 'get-user-data':
        return {
          ...state,
          userData: action.userData
        }
      case 'get-home-posts':
        return {
          ...state,
          homePosts: action.homePosts
        }
      case 'get-subreddit':
        return {
          ...state,
          subreddit: action.subreddit
        }
      case 'get-subreddit-search':
        return {
          ...state,
          searchedSubreddit: action.searchedSubreddit
        }
      case 'get-subreddit-posts':
        return {
          ...state,
          subredditPosts: action.subredditPosts
        }
      default:
        return state
    }
}

export const initialState = {
  Loading: false,
  Requester: null,
  refreshToken: '',
  profilePicture: '',
  userData: null,
  homePosts: null,
  subreddit: '',
  searchedSubreddit: null,
  subredditPosts: null,
}