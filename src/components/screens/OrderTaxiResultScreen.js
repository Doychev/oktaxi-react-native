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
    var response = this.props.navigation.state.params.response;
    var responseJson = await response.json();
    this.setState({
      orderId: responseJson.id,
    });

    const encodedUser = await AsyncStorage.getItem(Constants.ASYNC_STORE_ENCODED_USER);
    this.setState({
      encodedUser: encodedUser,
    });

    const username = await AsyncStorage.getItem(Constants.ASYNC_STORE_USERNAME);
    this.setState({
      username: username,
    });
  }

  onPressCancel = () => {
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
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>{strings('content.order_taxi_searching')}{this.state.orderId}{strings('content.order_taxi_searching_2')}</Text>
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
