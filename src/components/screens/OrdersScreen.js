import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, AsyncStorage, ScrollView, Alert } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import { strings } from '../../../locales/i18n';
import Toolbar from '../elements/Toolbar';
import Spinner from './../elements/Spinner';
import { NetworkUtils } from '../../util/NetworkUtils.js';

export default class OrdersScreen extends React.Component {
  static navigationOptions = { title: 'Orders', header: null };

  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible : false,
      orders : [],
    };
  }

  async componentDidMount() {
    this.getOrderHistory();
  }

  async getOrderHistory() {
    this.showSpinner();
    const encodedUser = await AsyncStorage.getItem(Constants.ASYNC_STORE_ENCODED_USER);
    let response = await NetworkUtils.fetch(
       Constants.BASE_URL + "order", {
        method: 'GET',
        headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : 'Basic ' + encodedUser,
        },
      }
    );
    if (!response.ok) {
      this.hideSpinner();
      Alert.alert(strings('content.app_name'), strings('content.error_occurred'));
    } else {
      this.hideSpinner();
      let responseText = await response.text();
      this.setState({
        orders: JSON.parse(responseText),
      });
    }
  }

  showSpinner() {
    this.setState({ spinnerVisible : true});
  }

  hideSpinner() {
    this.setState({ spinnerVisible : false});
  }

  renderOrder(order, i) {
    return(
      <View style={styles.orderRow} key={i}>
        <View style={styles.infoWrap}>
          <View style={styles.infoRow}>
            <Image style={styles.infoIcon} resizeMode='contain' source={require('../../images/icons/baseline_description_black.png')}/>
            <Text style={styles.infoText}>№ {order.id}, {order.addedOn}</Text>
          </View>
          <View style={styles.infoRow}>
            <Image style={styles.infoIcon} resizeMode='contain' source={require('../../images/icons/baseline_place_black.png')}/>
            <Text style={styles.infoText}>{order.startAddress.text}</Text>
          </View>
          <View style={styles.infoRow}>
            <Image style={styles.infoIcon} resizeMode='contain' source={require('../../images/icons/baseline_person_pin_circle_black.png')}/>
            <Text style={styles.infoText}>{order.endAddress.text}</Text>
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinnerVisible} />
        <Toolbar showBackButton={true} title={strings('content.my_orders')} navigation={this.props.navigation}/>
        <ScrollView style={styles.content}>
          {
            this.state.orders.length > 0 ?
            this.state.orders.map((order, i) => this.renderOrder(order, i))
            : null
          }
        </ScrollView>
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
    alignSelf: 'stretch',
  },
  orderRow: {
    flex: 1,
    alignSelf: 'stretch',
  },
  infoWrap: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  infoRow: {
    height: 25,
    flexDirection: 'row',
    borderRadius: 2,
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
  },
  infoIcon: {
    width: 23,
    height: 23,
    marginRight: 10,
    tintColor: Colors.ORANGE_RED,
  },
  infoText: {
    fontSize: 12,
  },
  separator: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
});
