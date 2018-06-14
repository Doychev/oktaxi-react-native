import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { Colors } from '../../Colors.js';
import MapView from 'react-native-maps';
import Toolbar from '../elements/Toolbar';
import Permissions from 'react-native-permissions';
import Geocoder from 'react-native-geocoder';
// Geocoder.fallbackToGoogle(Constants.GOOGLE_MAPS_API_KEY);

import { strings } from '../../../locales/i18n';

export default class HomeScreen extends React.Component {
  static navigationOptions = { title: 'Home', header: null };

  constructor(props) {
    super(props);
    this.state = {
      mapRegion: {
        latitude: 42.69751,
        longitude: 23.32415,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      },
      toolsVisible: true,
      currentLocation: '',
      currentStep: 1,
    };
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
  }

  onRegionChange(region) {
    this.setState({
      mapRegion: region,
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

  componentDidMount() {
    this.checkLocationPermission().then( status => {
      if (status === 'authorized') {
        //we already have it
      } else {
        this.getLocationPermission().then( status => {
          if (status === 'authorized') {
            //allowed
            //get location and move marker there
          } else {
            //rejected
            //show block screen
          }
        });
      }
    });
  }

  async checkLocationPermission() {
    var status = await Permissions.check('location');
    // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    return status;
  }

  async getLocationPermission() {
    const status = await Permissions.request('location');
    return status;
  }

  onPressMap = (event) => {

  }

  onPressPickUpLocation = () => {
    this.setState({
      pickUpLocationDescription: this.state.currentLocation,
      pickUpLocationLatitude: this.state.mapRegion.latitude,
      pickUpLocationLongitude: this.state.mapRegion.longitude,
      currentStep: 2,
    });
  }

  onPressDestination = () => {
    this.props.navigation.navigate('OrderTaxi', {
      pickUpLocationDescription: this.state.pickUpLocationDescription,
      pickUpLocationLatitude: this.state.pickUpLocationLatitude,
      pickUpLocationLongitude: this.state.pickUpLocationLongitude,
      dropOffLocationDescription: this.state.currentLocation,
      dropOffLocationLatitude: this.state.mapRegion.latitude,
      dropOffLocationLongitude: this.state.mapRegion.longitude,
    });
  }

  customBackButtonAction = () => {
    this.setState({
      currentStep: this.state.currentStep - 1,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Toolbar customBackButtonAction={this.customBackButtonAction} showBackButton={this.state.currentStep > 1} title={strings('content.app_title')} navigation={this.props.navigation}/>
        <MapView
          ref={ref => { this.map = ref; }}
          onPress={e => this.onPressMap(e.nativeEvent)}
          style={styles.mapStyle}
          initialRegion={this.state.mapRegion}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={this.onRegionChangeComplete}>

        </MapView>
        {
          this.state.toolsVisible ?
          <TextInput style={styles.currentLocationBox} value={this.state.currentLocation}/>
          : null
        }
        {
          this.state.toolsVisible && this.state.currentStep == 1 ?
          <TouchableOpacity onPress={this.onPressPickUpLocation} style={styles.pickUpLocation}>
            <Image style={styles.pickUpImage} resizeMode='contain' source={require('../../images/pickuplocation.png')}/>
            <Text style={styles.pickUpText}>{strings('content.take_me_from_here')}</Text>
          </TouchableOpacity>
          : null
        }
        <View style={styles.dot}>
          <View style={styles.dotShadow} />
        </View>
        {
          this.state.toolsVisible && this.state.currentStep == 2 ?
          <TouchableOpacity onPress={this.onPressDestination} style={styles.destination}>
            <Image style={styles.pickUpImage} resizeMode='contain' source={require('../../images/destination.png')}/>
            <Text style={styles.destinationText}>{strings('content.destination')}</Text>
          </TouchableOpacity>
          : null
        }
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
  mapStyle: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  currentLocationBox: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    backgroundColor: Colors.WHITE,
    paddingTop: 10,
    paddingBottom: 10,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: Colors.BLACK,
    shadowOffset: { height: 5, width: 0},
  },
  destination: {
    position: 'absolute',
    top: '52%',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickUpLocation: {
    position: 'absolute',
    top: '39%',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickUpImage: {
    flex: 1,
    width: '100%',
  },
  pickUpText: {
    position: 'absolute',
    bottom: '30%',
    top: '30%',
    left: '20%',
    right: '20%',
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationText: {
    position: 'absolute',
    bottom: '30%',
    top: '40%',
    left: '20%',
    right: '20%',
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    bottom: '50%',
    top: '50%',
    left: '48%',
    right: '48%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.BLACK,
  },
  dotShadow: {
    width: 20,
    height: 16,
    borderRadius: 10,
    backgroundColor: Colors.ORANGE,
  }

});
