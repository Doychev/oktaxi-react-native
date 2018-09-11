import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Constants } from '../../Constants.js';
import { NavigationUtils } from '../../util/NavigationUtils';

export default class SplashScreen extends React.Component {

  static navigationOptions = { title: 'Splash', header: null };

  async componentDidMount() {
    const loggedIn = await this.checkUserLoggedIn();
    var screen = loggedIn ? 'Home' : 'Intro';
    NavigationUtils.navigateWithoutBackstack(this.props.navigation, screen);
  };

  async checkUserLoggedIn() {
    try {
      const value = await AsyncStorage.getItem(Constants.ASYNC_STORE_ENCODED_USER);
      if (value !== null){
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
