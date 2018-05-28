import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { Colors } from '../../Colors.js';
import { NavigationUtils } from '../../util/NavigationUtils';

export default class IntroScreen extends React.Component {
  static navigationOptions = { title: 'Intro', header: null };

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  onPressLogin = () => {
    // NavigationUtils.navigateWithoutBackstack(this.props.navigation, 'Home');
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <ImageBackground style={styles.container} resizeMode='stretch' source={require('../../images/taxi3.png')}>
        <View style={styles.top}>
          <Text style={styles.line1}>Log in to the mobile app of</Text>
          <Text style={styles.line2}>OK SUPERTRANS</Text>
        </View>
        <View style={styles.input}>
          <TextInput/>
          <TextInput/>
          <TouchableOpacity style={styles.loginButton} onPress={this.onPressLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.link}>Registration</Text>
          <Text style={styles.link}>Forgotten password</Text>
        </View>
      </ImageBackground>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  bottom: {
    flex: 2,
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginLeft: 20,
  },
  line1: {
    textAlign: 'center',
    fontSize: 20,
    color: Colors.WHITE,
    margin: 5,
  },
  line2: {
    textAlign: 'center',
    fontSize: 30,
    color: Colors.YELLOW,
    fontWeight: 'bold',
    margin: 5,
  },
  loginButton: {
    margin: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.YELLOW,
  },
  buttonText: {
    margin: 8,
    fontSize: 20,
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
  link: {
    textDecorationLine: 'underline',
    color: Colors.WHITE,
    fontSize: 20,
    marginBottom: 40,
  },
});
