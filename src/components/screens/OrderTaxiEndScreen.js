import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import CheckBox from 'react-native-checkbox';
import { NetworkUtils } from '../../util/NetworkUtils.js';
import Spinner from 'react-native-loading-spinner-overlay';

import { strings } from '../../../locales/i18n';

export default class OrderTaxiEndScreen extends React.Component {
  static navigationOptions = { title: 'Order Taxi End', header: null };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible : false,
      resultText : "",
      orderStatus : -1,
    };
  }

  async componentDidMount() {
    const encodedUser = await AsyncStorage.getItem(Constants.ASYNC_STORE_ENCODED_USER);
    this.setState({
      encodedUser: encodedUser,
    });

    if (this.props.navigation.state.params.resultText) {
      this.setState({
        orderId: this.props.navigation.state.params.orderId,
        resultText: this.props.navigation.state.params.resultText,
        orderStatus: this.props.navigation.state.params.orderStatus,
      });
    }
  }

  onPressNewSearch = async () => {
    this.showSpinner();
    let response = await NetworkUtils.fetch(
       Constants.BASE_URL + "order/status/" + this.state.orderId, {
        method: 'POST',
        headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : 'Basic ' + this.state.encodedUser,
        },
        body: JSON.stringify({
          "status": 2,
        }),
      }
    );
    if (!response.ok) {
      this.hideSpinner();
      //SHOW ERROR
    } else {
      var responseJson = await response.json();
      responseJson.id = this.state.orderId;
      this.hideSpinner();
      this.props.navigation.navigate('OrderTaxiResult', {responseJson: responseJson});
    }
  }

  onPressNewOrder = () => {
    this.setState({
      currentStep: 1,
    });
    this.props.navigation.navigate('Home');
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
        <Toolbar title={strings('content.activity_title_confirm')} navigation={this.props.navigation}/>
        <View style={styles.content}>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{this.state.resultText}</Text>
          </View>
          {
            this.state.orderStatus == 8 ?
            <TouchableOpacity style={styles.button} onPress={this.onPressNewSearch}>
              <Text style={styles.buttonText}>{strings('content.new_search')}</Text>
            </TouchableOpacity>
            : null
          }
          <TouchableOpacity style={styles.button} onPress={this.onPressNewOrder}>
            <Text style={styles.buttonText}>{strings('content.to_home_screen')}</Text>
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
    marginBottom: 20,
    marginTop: 50,
    alignItems: 'center',
  },
  resultText: {
  },
  button: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
    marginTop: 5,
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
