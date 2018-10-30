import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import { NetworkUtils } from '../../util/NetworkUtils.js';
import Spinner from 'react-native-loading-spinner-overlay';

import { strings } from '../../../locales/i18n';

export default class ReviewScreen extends React.Component {
  static navigationOptions = { title: 'Review', header: null };

  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      reviewText: '',
    };
  }

  async componentDidMount() {
    const encodedUser = await AsyncStorage.getItem(Constants.ASYNC_STORE_ENCODED_USER);
    this.setState({
      encodedUser: encodedUser,
    });

    if (this.props.navigation.state.params.resultText) {
      this.setState({
        version: responseJson.version,
      });
    }
  }

  showSpinner() {
    this.setState({ spinnerVisible : true});
  }

  hideSpinner() {
    this.setState({ spinnerVisible : false});
  }

  onPressSend = () => {
    this.setState({
      step: 2,
    });
  }

  onPressNewOrder = () => {
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={strings('content.please_wait')} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Toolbar title={strings('content.activity_title_confirm')} navigation={this.props.navigation}/>
        <View style={styles.content}>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{this.state.step == 1 ? strings('content.order_completed') : strings('content.thank_you_for_order')}</Text>
          </View>
          {
            this.state.step == 1 ?
            <View style={styles.resultBox}>

              //<Text style={styles.ratingDescription}>{strings('content.order_completed_review')}</Text>
              //onChangeText={(value) => this.setState({voucherNumber: value})}

              <TextInput style={styles.ratingDescription} value={this.state.reviewText}
                onChangeText={(value) => this.setState({reviewText: value})}
                multiline = {true} numberOfLines={4}
                returnKeyType='next' autoCapitalize = 'none'></TextInput>
            </View>
            : null
          }
          <TouchableOpacity style={styles.button} onPress={this.state.step == 1 ? this.onPressSend : this.onPressNewOrder}>
            <Text style={styles.buttonText}>{this.state.step == 1 ? strings('content.review_save') : strings('content.to_home_screen')}</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 50,
  },
  resultBox: {
    backgroundColor: Colors.WHITE,
    paddingTop: 10,
    paddingBottom: 10,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: Colors.BLACK,
    shadowOffset: { height: 5, width: 0},
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight: 20,
  },
  resultText: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.ORANGE,
  },
  ratingDescription: {
    color: Colors.BLACK,
    fontSize: 16,
    marginLeft: 5,
    marginRight: 20,
  },
  button: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
    marginTop: 25,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.YELLOW,
  },
  buttonText: {
    margin: 10,
    fontSize: 20,
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
});
