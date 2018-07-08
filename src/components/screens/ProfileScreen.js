import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import { strings } from '../../../locales/i18n';
import Toolbar from '../elements/Toolbar';

export default class ProfileScreen extends React.Component {
  static navigationOptions = { title: 'Profile', header: null };

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      name: '',
      email: '',
    };
  }

  async componentDidMount() {
    let userInfo = await AsyncStorage.getItem(Constants.ASYNC_STORE_USER_INFO);
    let username = await AsyncStorage.getItem(Constants.ASYNC_STORE_USERNAME);
    if (userInfo != null && username != null) {
      userInfo = JSON.parse(userInfo);
      this.setState({
        phoneNumber: username,
        name: userInfo.name,
        email: userInfo.email,
      });
    }
  }

  onPressChangePassword = () => {
    this.props.navigation.navigate('ChangePassword');
  }

  render() {
    return (
      <View style={styles.container}>
        <Toolbar showBackButton={true} title={strings('content.my_profile')} navigation={this.props.navigation}/>
        <View style={styles.content}>
        {
          this.props.navigation.state.params &&
          this.props.navigation.state.params.passwordChanged ?
          <View style={styles.profileField}>
              <Text style={styles.fieldText}>{strings('content.password_updated')}</Text>
          </View>
          : null
        }
          <View style={styles.profile}>
            <View style={styles.profileField}>
              <Image style={styles.fieldIcon} resizeMode='contain'
                source={require('../../images/icons/baseline_call_black.png')}/>
                <Text style={styles.fieldText}>{this.state.phoneNumber}</Text>
            </View>
            <View style={styles.profileField}>
              <Image style={styles.fieldIcon} resizeMode='contain'
                source={require('../../images/icons/baseline_person_black.png')}/>
                <Text style={styles.fieldText}>{this.state.name}</Text>
            </View>
            <View style={styles.profileField}>
              <Image style={styles.fieldIcon} resizeMode='contain'
                source={require('../../images/icons/baseline_email_black.png')}/>
                <Text style={styles.fieldText}>{this.state.email}</Text>
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
