import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import { NavigationUtils } from '../../util/NavigationUtils';
import { strings } from '../../../locales/i18n';
import { NetworkUtils } from '../../util/NetworkUtils.js';
let base64 = require('base-64');

export default class IntroScreen extends React.Component {
  static navigationOptions = { title: 'Intro', header: null };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  componentDidMount() {

  }

  onPressLogin = async () => {

    if (this.state.username.length > 0 && this.state.password.length > 0) {
      var encodedUser = base64.encode(this.state.username + ':' + this.state.password);
      await AsyncStorage.setItem(Constants.ASYNC_STORE_ENCODED_USER, encodedUser);
      await AsyncStorage.setItem(Constants.ASYNC_STORE_USERNAME, this.state.username);

      let response = await NetworkUtils.fetch(
         Constants.BASE_URL + "user/status", {
          method: 'GET',
          headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : 'Basic ' + encodedUser,
          },
        }
      );
      if (!response.ok) {
        //SHOW ERROR
      } else {
        // NavigationUtils.navigateWithoutBackstack(this.props.navigation, 'Home');
        this.props.navigation.navigate('Home');
      }
    }
  }

  render() {
    return (
      <ImageBackground style={styles.container} resizeMode='stretch' source={require('../../images/taxi3.png')}>
        <View style={styles.top}>
          <Text style={styles.line1}>{strings('content.login_top')}</Text>
          <Text style={styles.line2}>{strings('content.company_name')}</Text>
        </View>
        <View style={styles.inputSection}>
          <View style={styles.input}>
            <Image style={styles.inputIcon} resizeMode='contain' tintColor={Colors.ORANGE}
              source={require('../../images/icons/baseline_call_black.png')}/>
            <TextInput style={styles.inputText} value={this.state.username}
              onChangeText={(value) => this.setState({username: value})}
              returnKeyType='next' autoCapitalize = 'none'
              ref='usernameField'
              onSubmitEditing={(event) => { this.refs.passwordField.focus(); }}
              placeholder={strings('content.phone')} placeholderTextColor={Colors.GRAY} />
          </View>
          <View style={styles.input}>
            <Image style={styles.inputIcon} resizeMode='contain' tintColor={Colors.ORANGE}
              source={require('../../images/icons/baseline_security_black.png')}/>
            <TextInput style={styles.inputText} value={this.state.password}
              onChangeText={(value) => this.setState({password: value})}
              returnKeyType='next' autoCapitalize = 'none'
              ref='passwordField' secureTextEntry={true}
              placeholder={strings('content.password')} placeholderTextColor={Colors.GRAY} />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={this.onPressLogin}>
            <Text style={styles.buttonText}>{strings('content.login')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.link}>{strings('content.signin')}</Text>
          <Text style={styles.link}>{strings('content.forgotten_password_link')}</Text>
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
  inputSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  input: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginLeft: 5,
    marginRight: 5,
  },
  inputIcon: {
    width: 26,
    height: 26,
    marginRight: 20,
    marginLeft: 10,
  },
  inputText: {
    width: '80%',
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
