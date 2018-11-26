import React from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import { Colors } from '../../Colors.js';
var {height, width} = Dimensions.get('window');
import FadeAnimation from './FadeAnimation';

import { strings } from '../../../locales/i18n';

export default class Spinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    });
  }

  render() {
    return (
      <FadeAnimation style={this.props.style ? [styles.container, this.props.style] : styles.container} visible={this.state.visible}>
        <ActivityIndicator style={styles.activityIndicator} size="large" color={Colors.WHITE} />
        <Text style={styles.text}>{strings('content.please_wait')}</Text>
      </FadeAnimation>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    height: height,
    width: width,
    zIndex: 999,
    backgroundColor: Colors.OVERLAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
});
