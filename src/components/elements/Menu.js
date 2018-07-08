import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import { strings } from '../../../locales/i18n';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onPressMyOrders = () => {
    this.props.navigation.navigate('Orders');
  }

  onPressMyProfile = () => {
    this.props.navigation.navigate('Profile');
  }

  onPressContact = () => {
    this.props.navigation.navigate('Descriptive', {title: strings('content.call_us'), description: strings('content.text_call_us')});
  }

  onPressLanguage = () => {
    // this.props.navigation.navigate('');
  }

  onPressAbout = () => {
    this.props.navigation.navigate('Descriptive', {title: strings('content.about_us'), description: strings('content.about_us_text')});
  }

  onPressTerms = () => {
    this.props.navigation.navigate('Descriptive', {title: strings('content.terms_conditions'), description: strings('content.terms_conditions_text')});
  }

  onPressExit = async () => {
    await AsyncStorage.removeItem(Constants.ASYNC_STORE_ENCODED_USER);
    await AsyncStorage.removeItem(Constants.ASYNC_STORE_USERNAME);
    await AsyncStorage.removeItem(Constants.ASYNC_STORE_USER_INFO);
    // NavigationUtils.navigateWithoutBackstack(this.props.navigation, 'Home');
    this.props.navigation.navigate('Intro');
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.topImage} resizeMode='center' source={require('../../images/taxi1.png')}/>
        <TouchableOpacity onPress={this.onPressMyOrders} style={styles.buttonRow}>
          <Image style={styles.buttonImage} resizeMode='contain' source={require('../../images/icons/baseline_apps_black.png')}/>
          <Text style={styles.buttonText}>{strings('content.my_orders')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressMyProfile} style={styles.buttonRow}>
          <Image style={styles.buttonImage} resizeMode='contain' source={require('../../images/icons/baseline_person_black.png')}/>
          <Text style={styles.buttonText}>{strings('content.my_profile')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressContact} style={styles.buttonRow}>
          <Image style={styles.buttonImage} resizeMode='contain' source={require('../../images/icons/baseline_call_black.png')}/>
          <Text style={styles.buttonText}>{strings('content.call_us')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressLanguage} style={styles.buttonRow}>
          <Image style={styles.buttonImage} resizeMode='contain' source={require('../../images/icons/baseline_language_black.png')}/>
          <Text style={styles.buttonText}>{strings('content.translate_button_title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressAbout} style={styles.buttonRow}>
          <Image style={styles.buttonImage} resizeMode='contain' source={require('../../images/icons/baseline_description_black.png')}/>
          <Text style={styles.buttonText}>{strings('content.about_us')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressTerms} style={styles.buttonRow}>
          <Image style={styles.buttonImage} resizeMode='contain' source={require('../../images/icons/baseline_library_books_black.png')}/>
          <Text style={styles.buttonText}>{strings('content.terms_conditions')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressExit} style={styles.buttonRow}>
          <Image style={styles.buttonImage} resizeMode='contain' source={require('../../images/icons/baseline_exit_to_app_black.png')}/>
          <Text style={styles.buttonText}>{strings('content.logout')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  topImage: {
    height: '25%',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    height: 30,
    margin: 10,
    marginBottom: 5,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  buttonImage: {
    width: 22,
    height: 22,
    tintColor: Colors.VERY_DARK_GRAY,
  },
  buttonText: {
    marginLeft: 20,
    color: Colors.BLACK,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
