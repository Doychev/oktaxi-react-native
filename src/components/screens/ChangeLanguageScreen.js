import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import { strings, switchLanguage } from '../../../locales/i18n';
import Toolbar from '../elements/Toolbar';
import RadioForm from 'react-native-simple-radio-button';

export default class ProfileScreen extends React.Component {
  static navigationOptions = { title: 'Profile', header: null };

  constructor(props) {
    super(props);
    this.state = {
      radioValue: -1,
      radioProps: [
        {label: strings('content.language_bulgarian'), value: 'bg' },
        {label: strings('content.language_english'), value: 'en' }
      ],
    };
  }

  async componentDidMount() {
    let userLang = await AsyncStorage.getItem(Constants.ASYNC_STORE_LANGUAGE);
    if (userLang) {
      this.setState({
        radioValue: userLang,
      });
    }
  }

  onChangeRadio = async (radioValue) => {
    this.setState({
      radioValue: radioValue,
    });
    await AsyncStorage.setItem(Constants.ASYNC_STORE_LANGUAGE, radioValue);

    switchLanguage(radioValue, this);
  }

  render() {
    return (
      <View style={styles.container}>
        <Toolbar showBackButton={true} title={strings('content.language')} navigation={this.props.navigation}/>
        <View style={styles.content}>
          <RadioForm
            style={styles.radio}
            radio_props={this.state.radioProps}
            initial={this.state.radioValue}
            buttonColor={Colors.YELLOW}
            selectedButtonColor={Colors.YELLOW}
            onPress={(radioValue) => {this.onChangeRadio(radioValue)}} />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 30,
    marginLeft: 30,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  radio: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  }
});
