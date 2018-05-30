import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { Colors } from '../../Colors.js';
import MapView from 'react-native-maps';
import Toolbar from '../elements/Toolbar';
import Permissions from 'react-native-permissions';
import Geocoder from 'react-native-geocoder';
// Geocoder.fallbackToGoogle(Constants.GOOGLE_MAPS_API_KEY);

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


  render() {
    return (
      <View style={styles.container}>
        <Toolbar title={"OK TAXI 9732121"} navigation={this.props.navigation}/>
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
          this.state.toolsVisible ?
          <View style={styles.pickUpLocation}>
            <Image style={styles.pickUpImage} resizeMode='contain' source={require('../../images/pickuplocation.png')}/>
            <Text style={styles.pickUpText}>PICK-UP LOCATION</Text>
          </View>
          : null
        }
        <View style={styles.dot}>
          <View style={styles.dotShadow} />
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
