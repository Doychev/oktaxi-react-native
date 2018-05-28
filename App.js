import React from 'react';
import { StackNavigator } from 'react-navigation';

import IntroScreen from './src/components/screens/IntroScreen';
import HomeScreen from './src/components/screens/HomeScreen';

const Navigator = StackNavigator({
  Intro: { screen: IntroScreen },
  Home: { screen: HomeScreen },
}, {
  headerMode: 'none',
});

export default class App extends React.Component {

  render() {
    return (
      <Navigator/>
    );
  }
}
