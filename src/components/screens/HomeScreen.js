import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { Colors } from '../../Colors.js';
import MapView from 'react-native-maps';

export default class HomeScreen extends React.Component {
  static navigationOptions = { title: 'Home', header: null };

  constructor(props) {
    super(props);
    this.state = {
      mapRegion: {
        latitude: 42,
        longitude: 37,
        latitudeDelta: 20,
        longitudeDelta: 20,
      },
    };
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  onRegionChange(region) {
    this.setState({ mapRegion : region });
  }


  componentDidMount() {

  }

  onPressMap = (event) => {

  }


  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={ref => { this.map = ref; }}
          onPress={e => this.onPressMap(e.nativeEvent)}
          style={styles.mapStyle}
          initialRegion={this.state.mapRegion}
          onRegionChange={this.onRegionChange}>

        </MapView>
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
  },

});
