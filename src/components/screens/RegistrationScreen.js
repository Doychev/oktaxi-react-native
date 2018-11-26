import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image, AsyncStorage, Alert } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import { NavigationUtils } from '../../util/NavigationUtils';
import { strings } from '../../../locales/i18n';
import { NetworkUtils } from '../../util/NetworkUtils.js';
let base64 = require('base-64');
import Spinner from './../elements/Spinner';
import CheckBox from 'react-native-checkbox';

export default class RegistrationScreen extends React.Component {
  static navigationOptions = { title: 'Registration', header: null };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible : false,
      username: '',
      names: '',
      email: '',
      termsCheckboxChecked: false,
    };
  }

  componentDidMount() {

  }

  onPressGo = async () => {
    if (this.state.username.length > 0) {
      this.showSpinner();
      var dummyUser = base64.encode('test:test');
      let response = await NetworkUtils.fetch(
         Constants.BASE_URL + "user/signin", {
          method: 'POST',
          headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : 'Basic ' + dummyUser,
          },
          body: JSON.stringify({
            "names": this.state.names,
            "email": this.state.email,
            "userName": this.state.username,
          }),
        }
      );
      if (!response.ok) {
        this.hideSpinner();
        Alert.alert(strings('content.app_name'), strings('content.error_occurred'));
      } else {
        this.hideSpinner();
        var responseJson = await response.json();
        if (responseJson.phoneType == 1) {
          Alert.alert(strings('content.app_name'), strings('content.error_occurred'));
        } else if (responseJson.phoneType == 2) {
          this.props.navigation.navigate('Intro', {message: strings('content.login_signin_msg_tel')});
        } else if (responseJson.phoneType == 3) {
          this.props.navigation.navigate('Intro', {message: strings('content.login_signin_msg_tel')});
        } else {
          Alert.alert(strings('content.app_name'), strings('content.error_occurred'));
        }
      }
    }
  }

  onPressLogin = () => {
    this.props.navigation.navigate('Intro');
  }

  onCheckTerms = (checked) => {
    this.setState({
      termsCheckboxChecked: !this.state.termsCheckboxChecked,
    });
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
        <Spinner visible={this.state.spinnerVisible} />
        <View style={styles.top}>
          <Text style={styles.line1}>{strings('content.signin_top_welcome')}</Text>
          <Text style={styles.line2}>{strings('content.company_name')}</Text>
          <Text style={styles.line1}>{strings('content.signin_top_welcome_2')}</Text>
        </View>
        <View style={styles.inputSection}>
          <View style={styles.input}>
            <Image style={styles.inputIcon} resizeMode='contain'
              source={require('../../images/icons/baseline_call_black.png')}/>
            <TextInput style={styles.inputText} value={this.state.username}
              onChangeText={(value) => this.setState({username: value})}
              returnKeyType='next' autoCapitalize = 'none'
              ref='usernameField'
              onSubmitEditing={(event) => { this.refs.namesField.focus(); }}
              placeholder={strings('content.phone')} placeholderTextColor={Colors.GRAY} />
          </View>
          <View style={styles.input}>
            <Image style={styles.inputIcon} resizeMode='contain'
              source={require('../../images/icons/baseline_person_black.png')}/>
            <TextInput style={styles.inputText} value={this.state.names}
              onChangeText={(value) => this.setState({names: value})}
              returnKeyType='next' autoCapitalize = 'none'
              ref='namesField'
              onSubmitEditing={(event) => { this.refs.emailField.focus(); }}
              placeholder={strings('content.name')} placeholderTextColor={Colors.GRAY} />
          </View>
          <View style={styles.input}>
            <Image style={styles.inputIcon} resizeMode='contain'
              source={require('../../images/icons/baseline_email_black.png')}/>
            <TextInput style={styles.inputText} value={this.state.email}
              onChangeText={(value) => this.setState({email: value})}
              returnKeyType='next' autoCapitalize = 'none'
              ref='emailField'
              placeholder={strings('content.email')} placeholderTextColor={Colors.GRAY} />
          </View>
          <View style={styles.input}>
            <CheckBox label={strings('content.accept_terms_conditions')} checked={this.state.termsCheckboxChecked}
              containerStyle={styles.checkbox} labelStyle={styles.checkboxLabel} onChange={(checked) => this.onCheckTerms(checked)} />
          </View>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={this.onPressGo}>
          <Text style={styles.buttonText}>{strings('content.go')}</Text>
        </TouchableOpacity>
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
    marginTop: 20,
    marginBottom: 40,
  },
  input: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginLeft: 20,
    marginRight: 20,
    alignSelf: 'stretch',
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
  checkbox: {
    marginTop: 5,
  },
  checkboxLabel: {
    color: Colors.BLACK,
  },
});
