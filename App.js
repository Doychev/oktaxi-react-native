import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Colors } from './src/Colors.js';

import IntroScreen from './src/components/screens/IntroScreen';

const Navigator = StackNavigator({
  Intro: { screen: IntroScreen },
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
