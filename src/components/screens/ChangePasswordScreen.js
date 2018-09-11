import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import { strings } from '../../../locales/i18n';
import Toolbar from '../elements/Toolbar';
import Spinner from 'react-native-loading-spinner-overlay';
import { NetworkUtils } from '../../util/NetworkUtils.js';
let base64 = require('base-64');

export default class ChangePasswordScreen extends React.Component {
  static navigationOptions = { title: 'ChangePassword', header: null };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible : false,
      phoneNumber: '',
      oldPassword: '',
      newPassword: '',
    };
  }

  async componentDidMount() {
    let username = await AsyncStorage.getItem(Constants.ASYNC_STORE_USERNAME);
    if (username != null) {
      this.setState({
        phoneNumber: username,
      });
    }

    const encodedUser = await AsyncStorage.getItem(Constants.ASYNC_STORE_ENCODED_USER);
    this.setState({
      encodedUser: encodedUser,
    });
  }

  onPressChangePassword = async () => {
    this.showSpinner();
    let response = await NetworkUtils.fetch(
       Constants.BASE_URL + "user/changePassword", {
        method: 'POST',
        headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : 'Basic ' + this.state.encodedUser,
        },
        body: JSON.stringify({
          "userName": this.state.phoneNumber,
          "passwordOld": this.state.oldPassword,
          "passwordNew": this.state.newPassword,
        }),
      }
    );
    if (!response.ok) {
      this.hideSpinner();
      //SHOW ERROR
    } else {
      var encodedUser = base64.encode(this.state.phoneNumber + ':' + this.state.newPassword);
      await AsyncStorage.setItem(Constants.ASYNC_STORE_ENCODED_USER, encodedUser);
      this.hideSpinner();
      this.props.navigation.navigate('Profile', {passwordChanged: true});
    }
  }

  showSpinner() {
    this.setState({ spinnerVisible : true});
  }

  hideSpinner() {
    this.setState({ spinnerVisible : false});
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={strings('content.please_wait')} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Toolbar showBackButton={true} title={strings('content.my_profile')} navigation={this.props.navigation}/>
        <View style={styles.content}>
          <View style={styles.profile}>
            <View style={styles.profileField}>
              <Image style={styles.fieldIcon} resizeMode='contain'
                source={require('../../images/icons/baseline_call_black.png')}/>
                <Text style={styles.fieldText}>{this.state.phoneNumber}</Text>
            </View>
            <View style={styles.profileField}>
              <Image style={styles.fieldIcon} resizeMode='contain'
                source={require('../../images/icons/baseline_security_black.png')}/>
                <TextInput style={styles.fieldText} value={this.state.oldPassword}
                  onChangeText={(value) => this.setState({oldPassword: value})}
                  returnKeyType='next' autoCapitalize = 'none'
                  ref='oldPasswordField' secureTextEntry={true}
                  onSubmitEditing={(event) => { this.refs.newPasswordField.focus(); }}
                  placeholder={strings('content.password_old')} placeholderTextColor={Colors.GRAY} />
            </View>
            <View style={styles.profileField}>
              <Image style={styles.fieldIcon} resizeMode='contain'
                source={require('../../images/icons/baseline_security_black.png')}/>
                <TextInput style={styles.fieldText} value={this.state.newPassword}
                  onChangeText={(value) => this.setState({newPassword: value})}
                  returnKeyType='next' autoCapitalize = 'none'
                  ref='newPasswordField' secureTextEntry={true}
                  onSubmitEditing={(event) => { this.onPressChangePassword(); }}
                  placeholder={strings('content.password_new')} placeholderTextColor={Colors.GRAY} />
            </View>
            <TouchableOpacity style={styles.changePassButton} onPress={this.onPressChangePassword}>
              <Text style={styles.buttonText}>{strings('content.change_password').toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  profile: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  profileField: {
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
  fieldIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
    marginLeft: 10,
    tintColor: Colors.ORANGE,
  },
  fieldText: {
    width: '80%',
  },
  changePassButton: {
    margin: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.YELLOW,
  },
  buttonText: {
    margin: 8,
    fontSize: 16,
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
});
