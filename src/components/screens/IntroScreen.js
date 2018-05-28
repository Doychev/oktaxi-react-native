import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class IntroScreen extends React.Component {
  static navigationOptions = { title: 'Intro', header: null };

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
