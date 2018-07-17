import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, AsyncStorage, ActivityIndicator } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import CheckBox from 'react-native-checkbox';
import { NetworkUtils } from '../../util/NetworkUtils.js';
import Spinner from 'react-native-loading-spinner-overlay';

import { strings } from '../../../locales/i18n';

export default class OrderTaxiResultScreen extends React.Component {
  static navigationOptions = { title: 'Order Taxi Result', header: null };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible : false,
      feedback : "",
    };
  }

  async componentDidMount() {
    var response, responseJson;
    if (this.props.navigation.state.params.response) {
      response = this.props.navigation.state.params.response;
      responseJson = await response.json();
    } else if (this.props.navigation.state.params.responseJson) {
      responseJson = this.props.navigation.state.params.responseJson;
    }
    this.setState({
      orderId: responseJson.id,
      version: responseJson.version,
    });

    const encodedUser = await AsyncStorage.getItem(Constants.ASYNC_STORE_ENCODED_USER);
    this.setState({
      encodedUser: encodedUser,
    });

    const username = await AsyncStorage.getItem(Constants.ASYNC_STORE_USERNAME);
    this.setState({
      username: username,
    });

    this.listenForStatus();
  }

  async listenForStatus() {
    try {
      let response = await NetworkUtils.fetch(
         Constants.BASE_URL + "order/wait/" + this.state.orderId + "?version=" + this.state.version, {
          method: 'GET',
          headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : 'Basic ' + this.state.encodedUser,
          },
        }
      );
      var responseJson = await response.json();
      // this.setState({
      //   statusText: JSON.stringify(responseJson),
      // });
      if (response.status == 302) {
        this.listenForStatus();
      } else if (!response.ok) {
        //SHOW ERROR
      } else {
        await this.setState({
          // orderId: responseJson.id,
          version: responseJson.version,
        });
        switch (responseJson.status) {
          case 1:
          case 2:
          case 10:
          case 11:
          case 12:
          case 13:
            this.listenForStatus();
            break;

          case 3:
            this.props.navigation.navigate('OrderTaxiProgress', {
              orderId: this.state.orderId,
              resultText: strings('content.order_taxi_found'),
              orderStatus: 3,
              responseJson: responseJson,
            });
            break;

          case 8:
            this.props.navigation.navigate('OrderTaxiEnd', {
              orderId: this.state.orderId,
              resultText: strings('content.order_no_car_found_text'),
              orderStatus: 8
            });
            break;

          default:
            //do nothing?
            break;
        }
      }
    } catch (error) {
      this.setState({
        statusText: error,
      });
      this.listenForStatus();
    }
  }

  onPressCancel = async () => {
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
          "status": 7,
        }),
      }
    );
    if (!response.ok) {
      this.hideSpinner();
      //SHOW ERROR
    } else {
      this.hideSpinner();
      this.props.navigation.navigate('OrderTaxiEnd', {
        orderId: this.state.orderId,
        resultText: strings('content.order_cancelled_text'),
        orderStatus: 7
      });
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
        <Toolbar title={strings('content.activity_title_confirm')} navigation={this.props.navigation}/>
        <View style={styles.content}>
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>{strings('content.order_taxi_searching')}{this.state.orderId}{strings('content.order_taxi_searching_2')}</Text>
            // <Text style={styles.loadingText}>{this.state.statusText}</Text>
          </View>
          <ActivityIndicator size='large' color={Colors.ORANGE} style={styles.activityIndicator}/>
          <TouchableOpacity style={styles.button} onPress={this.onPressCancel}>
            <Text style={styles.buttonText}>{strings('content.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}

/*
<View style={styles.feedback}>
  <Image style={styles.feedbackIcon} resizeMode='contain'
    source={require('../../images/icons/baseline_description_black.png')}/>
  <Text style={styles.feedbackText}>{this.state.feedback}</Text>
</View>
<TouchableOpacity style={styles.button} onPress={this.onPressNewSearch}>
  <Text style={styles.buttonText}>{strings('content.new_search')}</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.button} onPress={this.onPressNewOrder}>
  <Text style={styles.buttonText}>{strings('content.new_order')}</Text>
</TouchableOpacity>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  activityIndicator: {
    flex: 1,
    transform: [
      { scale: 3.5, }
    ],
  },
  loadingBox: {
    marginTop: 100,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: Colors.WHITE,
    paddingTop: 10,
    paddingBottom: 10,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: Colors.BLACK,
    shadowOffset: { height: 5, width: 0},
  },
  feedback: {
    height: 145,
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    marginLeft: 5,
    marginRight: 5,
  },
  feedbackIcon: {
    width: 26,
    height: 26,
    marginRight: 20,
    tintColor: Colors.ORANGE,
  },
  feedbackText: {
    width: '80%',
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
    margin: 8,
    fontSize: 20,
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
});
