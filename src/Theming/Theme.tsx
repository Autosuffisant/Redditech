import { DefaultTheme } from 'react-native-paper'

const Theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#333333',
      accent: '#444444',
      background: '#222222',
      surface: "#aaaabb",
      placeholder: '#aaaabb',
      text: '#ffffff',
      textShadow: '#bbbbbb',
      loader: '#cccccc',
      icon: '#ffffff',
    },
};

export default Theme;