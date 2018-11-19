import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import { strings } from '../../../locales/i18n';
import Toolbar from '../elements/Toolbar';

export default class DescriptiveScreen extends React.Component {
  static navigationOptions = { title: 'Descriptive', header: null };

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
        <Toolbar showBackButton={true} title={this.props.navigation.state.params.title} navigation={this.props.navigation}/>
        <ScrollView>
        <View style={styles.container}>
          <Text style={styles.content}>
            {this.props.navigation.state.params.description}
          </Text>
        </View>
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
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  }
});
