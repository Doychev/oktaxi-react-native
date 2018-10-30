import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import MapView from 'react-native-maps';
import Toolbar from '../elements/Toolbar';
import Menu from '../elements/Menu';
import Permissions from 'react-native-permissions';
import Geocoder from 'react-native-geocoder';
Geocoder.fallbackToGoogle(Constants.GOOGLE_MAPS_API_KEY);
import SideMenu from 'react-native-side-menu';

import { strings } from '../../../locales/i18n';

export default class HomeScreen extends React.Component {
  static navigationOptions = { title: 'Home', header: null };

  constructor(props) {
    super(props);
    this.state = {
      mapRegion: {
        latitude: 42.69751,
        longitude: 23.32415,
        //latitudeDelta: 0.012,
        //longitudeDelta: 0.012,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      userLatitude: 0,
      userLongitude: 0,
      toolsVisible: true,
      currentLocation: '',
      currentStep: 1,
      sideMenuOpen: false,
    };
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
  }
  alert(this.state.currentStep);
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
        if (geocoderResult[0].neighborhood) {
          address = address + " " + geocoderResult[0].neighborhood;
        }
        //address = address + " " + geocoderResult[0].subLocality;
      }
      this.setState({
        toolsVisible: true,
        currentLocation: address,
        //JSON.stringify(geocoderResult[0])
      });
    } catch (e) {
      // alert(e);
      this.setState({
        toolsVisible: true,
        currentLocation: '',
      });
    }
  }

  async componentDidMount() {
    // this.checkLocationPermission().then( status => {
    //   if (status === 'authorized') {
    //     this.getUserLocation();
    //   } else {
    //     this.getLocationPermission().then( status => {
    //       if (status === 'authorized') {
    //         this.getUserLocation();
    //       } else {
    //         //rejected
    //         //show block screen
    //       }
    //     });
    //   }
    // });
    this.getUserLocation();
    // this.getUserLocation();
  }
  /*
  if ((this.state.currentStep)&&(this.state.currentStep == 2)) {
    latDelta: 0.012,
    longDelta: 0.012,
  }else{
    latDelta: 0.005,
    longDelta: 0.005,
  }
*/
  async getUserLocation() {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        this.map.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
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

  onPressRecenter = () => {
    this.map.animateToRegion({
      latitude: this.state.userLatitude,
      longitude: this.state.userLongitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
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

  onPressOrder = () => {
    if (this.state.currentStep == 1) {
      //alert(this.state.userLatitude);
      this.setState({
        pickUpLocationDescription: this.state.currentLocation,
        //pickUpLocationLatitude: this.state.mapRegion.latitude,
        //pickUpLocationLongitude: this.state.mapRegion.longitude,
        pickUpLocationLatitude: this.state.userLatitude,
        pickUpLocationLongitude: this.state.userLongitude,
        currentStep: 2,
        currentLocation: "",
      });
    } else if (this.state.currentStep == 2) {
      //this.state.currentLocation = "";
      this.props.navigation.navigate('OrderTaxi', {
        pickUpLocationDescription: this.state.pickUpLocationDescription,
        pickUpLocationLatitude: this.state.pickUpLocationLatitude,
        pickUpLocationLongitude: this.state.pickUpLocationLongitude,
        //dropOffLocationDescription:  "",
        dropOffLocationDescription: this.state.currentLocation,
        dropOffLocationLatitude: this.state.mapRegion.latitude,
        dropOffLocationLongitude: this.state.mapRegion.longitude,
      });
    }
    //alert(this.state.pickUpLocationLatitude);
  }



  customBackButtonAction = () => {
    this.setState({
      currentStep: this.state.currentStep - 1,
    });
  }

  toggleMenu = () => {
    this.setState({
      sideMenuOpen: !this.state.sideMenuOpen,
    });
  }

  searchAddress = async () => {
    try {
      let geocoderResult = await Geocoder.geocodeAddress(this.state.currentLocation);
      var address = '', latitude = 0, longitude = 0;
      if (geocoderResult && geocoderResult[0]) {
        // this.setState({
        //   currentLocation: JSON.stringify(geocoderResult[0]),
        // });
        if (geocoderResult[0].streetName) {
          address = geocoderResult[0].streetName;
          if (geocoderResult[0].streetNumber) {
            address = address + " " + geocoderResult[0].streetNumber;
          }
          this.setState({
            currentLocation: address,
          });
        }
        if (geocoderResult[0].position.lat && geocoderResult[0].position.lng) {
          this.map.animateToRegion({
            latitude: geocoderResult[0].position.lat,
            longitude: geocoderResult[0].position.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,


          });
        }
      }
      this.setState({
        toolsVisible: true,
      });
    } catch (e) {
      this.setState({
        toolsVisible: true,
        currentLocation: '',
      });
    }
  }

  render() {
    const menu = <Menu navigation={this.props.navigation}/>;

    return (
      <SideMenu menu={menu} isOpen={this.state.sideMenuOpen}
        onChange={(isOpen) => this.setState({sideMenuOpen: isOpen})} disableGestures={this.state.currentStep > 1}>
        <View style={styles.container}>
          <Toolbar customBackButtonAction={this.customBackButtonAction} showBackButton={this.state.currentStep > 1}
            showMenuButton={this.state.currentStep < 2} menuAction={this.toggleMenu}
            title={strings('content.app_title')} navigation={this.props.navigation}/>
          <MapView
            ref={ref => { this.map = ref; }}
            onPress={e => this.onPressMap(e.nativeEvent)}
            style={styles.mapStyle}
            initialRegion={this.state.mapRegion}
            onRegionChange={this.onRegionChange}
            onRegionChangeComplete={this.onRegionChangeComplete}
            // provider={MapView.PROVIDER_GOOGLE}
            >
          </MapView>
          {
            this.state.toolsVisible ?
            <TextInput style={styles.currentLocationBox} value={this.state.currentLocation}
              onChangeText={(value) => this.setState({currentLocation: value})}
              returnKeyType='go'
              onSubmitEditing={(event) => this.searchAddress()}/>
            : null
          }
          {
            this.state.toolsVisible ?
            <TouchableOpacity onPress={this.onPressOrder} style={styles.pickUpLocation}>
              <Image style={styles.pickUpImage} resizeMode='contain' source={require('../../images/pickuplocation.png')}/>
              <Text style={styles.pickUpText}>{this.state.currentStep == 1 ? strings('content.take_me_from_here') : strings('content.destination')}</Text>
            </TouchableOpacity>
            : null
          }
          <View style={styles.dot}>
            <View style={styles.dotShadow} />
          </View>
          <TouchableOpacity style={styles.recenterButton} onPress={this.onPressRecenter}>
            <Image style={styles.recenterIcon} resizeMode='contain' source={require('../../images/icons/baseline_place_black.png')}/>
          </TouchableOpacity>
        </View>
      </SideMenu>
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
  // destinationText: {
  //   position: 'absolute',
  //   bottom: '30%',
  //   top: '40%',
  //   left: '20%',
  //   right: '20%',
  //   color: Colors.WHITE,
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
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
  },
  recenterButton: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    width: 50,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.LIGHT_GRAY,
  },
  recenterIcon: {
    width: 25,
    height: 25,
  },
});
