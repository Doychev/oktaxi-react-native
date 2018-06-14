import React from 'react';
import { StackNavigator } from 'react-navigation';

import IntroScreen from './src/components/screens/IntroScreen';
import HomeScreen from './src/components/screens/HomeScreen';
import OrderTaxiScreen from './src/components/screens/OrderTaxiScreen';

const Navigator = StackNavigator({
  Intro: { screen: IntroScreen },
  Home: { screen: HomeScreen },
  OrderTaxi: { screen: OrderTaxiScreen },
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
