import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import CheckBox from 'react-native-checkbox';
import { NetworkUtils } from '../../util/NetworkUtils.js';
import Spinner from 'react-native-loading-spinner-overlay';
import MapView from 'react-native-maps';
const timer = require('react-native-timer');

import { strings } from '../../../locales/i18n';

export default class OrderTaxiProgressScreen extends React.Component {
  static navigationOptions = { title: 'Order Taxi Progress', header: null };

  constructor(props) {
    super(props);
    this.state = {
      mapRegion: {
        latitude: 42.69751,
        longitude: 23.32415,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      },
      spinnerVisible : false,
      resultText : "",
      orderStatus : -1,
      taxiInfo: "",
      timeOfArrival: "",
      shouldTrack: true,
    };
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  onRegionChange(region) {
    this.setState({
      toolsVisible: false,
    });
  }

  async onRegionChangeComplete(region) {
    try {
      let geocoderResult = await Geocoder.geocodePosition({lat: region.latitude, lng: region.longitude});
      var address = '';
      if (geocoderResult && geocoderResult[0] && geocoderResult[0].streetName) {
        address = geocoderResult[0].streetName;
        if (geocoderResult[0].streetNumber) {
          address = address + " " + geocoderResult[0].streetNumber;
        }
      }
      this.setState({
        toolsVisible: true,
        currentLocation: address,
        //JSON.stringify(geocoderResult[0])
      });
    } catch (e) {
      this.setState({
        toolsVisible: true,
        currentLocation: '',
      });
    }
  }

  async getUserLocation() {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        this.map.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.12,
          longitudeDelta: 0.12,
        });
        this.setState({
          userLatitude: position.coords.latitude,
          userLongitude: position.coords.longitude,
        });
      },
      (error) => {
        //fail silently
      },
      { timeout: 15000 },
    );
  }

  async componentDidMount() {
    const encodedUser = await AsyncStorage.getItem(Constants.ASYNC_STORE_ENCODED_USER);
    this.setState({
      encodedUser: encodedUser,
    });

    this.getUserLocation();

    if (this.props.navigation.state.params.resultText) {
      var responseJson = this.props.navigation.state.params.responseJson;
      //alert(JSON.stringify(responseJson));
      this.setState({
        startLatitude: this.props.navigation.state.params.startLatitude,
        startLongitude: this.props.navigation.state.params.startLongitude,
        orderId: this.props.navigation.state.params.orderId,
        resultText: this.props.navigation.state.params.resultText,
        orderStatus: this.props.navigation.state.params.orderStatus,
        taxiInfo: responseJson.vehicleModel + ", №" + responseJson.vehicleCarNumber,
        taxiId: responseJson.vehicleId,
        timeOfArrival: responseJson.timeOfArrival,
        version: responseJson.version,
      });
    }

    this.listenForStatus();
    this.trackTaxi();
  }

  async trackTaxi() {
    if (!this.state.shouldTrack) {
      return;
    }
    try {
      let response = await NetworkUtils.fetch(
         Constants.BASE_URL + "vehicle/status/" + this.state.taxiId, {
          method: 'GET',
          headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : 'Basic ' + this.state.encodedUser,
          },
        }
      );
      var responseJson = await response.json();
      if (!response.ok || responseJson.latitude == null) {
        //SHOW ERROR
      } else {
        this.setState({
          taxiTracked: true,
          taxiLatitude: responseJson.latitude,
          taxiLongitude: responseJson.longitude,
        });

        this.map.fitToElements(true);
      }
      timer.setTimeout(this, 'Timer', () => this.trackTaxi(), 5000);
    } catch (error) {
      this.trackTaxi();
    }
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
      if (response.status == 302) {
        this.listenForStatus();
      } else if (!response.ok) {
        //SHOW ERROR
      } else {
        await this.setState({
          orderStatus: responseJson.status,
          version: responseJson.version,
        });
        switch (responseJson.status) {
          case 4:
            this.setState({
              resultText: strings('content.order_taxi_arrived'),
            });
            this.listenForStatus();
            break;

          case 5:
            this.setState({
              resultText: strings('content.order_taxi_with_client'),
            });
            this.listenForStatus();
            break;

          case 6:
            this.setState({
              shouldTrack: false,
            });
            this.props.navigation.navigate('Review', {
              orderId: this.state.orderId,
            });
            break;
          //
          // case 8:
          //   this.props.navigation.navigate('OrderTaxiEnd', {
          //     orderId: this.state.orderId,
          //     resultText: strings('content.order_no_car_found_text'),
          //     orderStatus: 8
          //   });
          //   break;

          default:
            this.listenForStatus();
            break;
        }
      }
    } catch (error) {
      this.listenForStatus();
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
            <Text style={[styles.resultText, styles.orange]}>{this.state.resultText}</Text>
          </View>
          <View style={styles.resultBox}>
            <Image style={styles.icon} resizeMode='contain'
              source={require('../../images/icons/baseline_local_taxi_black.png')}/>
            <Text style={styles.resultText}>{this.state.taxiInfo}</Text>
          </View>
          {
            this.state.orderStatus == 3 ?
            <View style={styles.resultBox}>
              <Image style={styles.icon} resizeMode='contain'
                source={require('../../images/icons/baseline_language_black.png')}/>
              <Text style={styles.resultText}>{strings('content.expected_time_arrival')}: {this.state.timeOfArrival}</Text>
            </View>
            : null
          }
          <MapView
            ref={ref => { this.map = ref; }}
            style={styles.map}
            initialRegion={this.state.mapRegion}
            onRegionChange={this.onRegionChange}
            onRegionChangeComplete={this.onRegionChangeComplete}
            // provider={MapView.PROVIDER_GOOGLE}
            >
            <MapView.Marker
              coordinate={{
                latitude: this.state.startLatitude,
                longitude: this.state.startLongitude}}>
              <Image source={require('../../images/icons/baseline_person_pin_circle_black.png')} style={styles.locationMarker}/>
            </MapView.Marker>
            {
              this.state.taxiTracked ?
              <MapView.Marker
                coordinate={{
                  latitude: this.state.taxiLatitude,
                  longitude: this.state.taxiLongitude}}>
                <Image source={require('../../images/launch_img.png')} style={styles.taxiMarker}/>
              </MapView.Marker>
              : null
            }
          </MapView>
        </View>
      </View>
    );
  }
}

// <TouchableOpacity style={styles.button} onPress={this.onPressNewOrder}>
//   <Text style={styles.buttonText}>{strings('content.new_order')}</Text>
// </TouchableOpacity>

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
  info: {
    flex: 1,
    marginTop: 10,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  resultBox: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.WHITE,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: Colors.BLACK,
    shadowOffset: { height: 5, width: 0},
    alignSelf: 'stretch',
    marginRight: 20,
    marginBottom: 2,
    marginTop: 2,
    alignItems: 'center',
  },
  resultText: {
    fontWeight: 'bold',
  },
  orange: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.ORANGE,
  },
  icon: {
    width: 26,
    height: 26,
    marginRight: 20,
    tintColor: Colors.ORANGE,
  },
  locationMarker: {
    width: 50,
    height: 50,
    tintColor: Colors.ORANGE,
  },
  taxiMarker: {
    width: 45,
    height: 45,
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
