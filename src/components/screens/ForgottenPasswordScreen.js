import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import { NavigationUtils } from '../../util/NavigationUtils';
import { strings } from '../../../locales/i18n';
import { NetworkUtils } from '../../util/NetworkUtils.js';
let base64 = require('base-64');
import Spinner from 'react-native-loading-spinner-overlay';

export default class ForgottenPasswordScreen extends React.Component {
  static navigationOptions = { title: 'ForgottenPassword', header: null };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible : false,
      username: '',
    };
  }

  componentDidMount() {

  }

  onPressGo = async () => {
    if (this.state.username.length > 0) {
      // this.showSpinner();
      // var encodedUser = base64.encode(this.state.username + ':' + this.state.password);
      // await AsyncStorage.setItem(Constants.ASYNC_STORE_ENCODED_USER, encodedUser);
      // await AsyncStorage.setItem(Constants.ASYNC_STORE_USERNAME, this.state.username);
      //
      // let response = await NetworkUtils.fetch(
      //    Constants.BASE_URL + "user/status", {
      //     method: 'GET',
      //     headers: {
      //       'Accept' : 'application/json',
      //       'Content-Type' : 'application/json',
      //       'Authorization' : 'Basic ' + encodedUser,
      //     },
      //   }
      // );
      // if (!response.ok) {
      //   this.hideSpinner();
      //   //SHOW ERROR
      // } else {
      //   this.hideSpinner();
      //   // NavigationUtils.navigateWithoutBackstack(this.props.navigation, 'Home');
      //   this.props.navigation.navigate('Home');
      // }
    }
  }

  onPressLogin = () => {
    this.props.navigation.navigate('Intro');
  }

  showSpinner() {
    this.setState({ spinnerVisible : true});
  }

  hideSpinner() {
    this.setState({ spinnerVisible : false});
  }

  render() {
    return (
      <ImageBackground style={styles.container} resizeMode='stretch' source={require('../../images/taxi3.png')}>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={strings('content.please_wait')} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <View style={styles.top}>
          <Text style={styles.line1}>{strings('content.fogotten_password_top')}</Text>
          <Text style={styles.line2}>{strings('content.company_name')}</Text>
          <Text style={styles.line1}>{strings('content.fogotten_password_top_2')}</Text>
        </View>
        <View style={styles.inputSection}>
          <View style={styles.input}>
            <Image style={styles.inputIcon} resizeMode='contain'
              source={require('../../images/icons/baseline_call_black.png')}/>
            <TextInput style={styles.inputText} value={this.state.username}
              onChangeText={(value) => this.setState({username: value})}
              returnKeyType='next' autoCapitalize = 'none'
              ref='usernameField'
              placeholder={strings('content.phone')} placeholderTextColor={Colors.GRAY} />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={this.onPressGo}>
            <Text style={styles.buttonText}>{strings('content.go')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity onPress={this.onPressLogin}>
            <Text style={styles.link}>{strings('content.if_you_have_account')}</Text>
          </TouchableOpacity>
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
    tintColor: Colors.ORANGE,
  },
  inputText: {
    width: '80%',
  },
  bottom: {
    flex: 2,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  line1: {
    textAlign: 'center',
    fontSize: 14,
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
