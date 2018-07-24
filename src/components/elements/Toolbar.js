import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Colors } from '../../Colors.js';

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onPressBack = () => {
    if (this.props.customBackButtonAction != null) {
      this.props.customBackButtonAction();
    } else {
      this.props.navigation.dispatch(NavigationActions.back());
    }
  }

  onPressMenu = () => {
    if (this.props.menuAction != null) {
      this.props.menuAction();
    }
  }

  onPressExtraAction = () => {
    if (this.props.extraAction != null) {
      this.props.extraAction();
    }
  }

  renderExtraAction() {
    return (
      <TouchableOpacity style={styles.extraActionButton} onPress={this.onPressExtraAction}>
        {
          this.props.extraActionText ?
          <Text style={styles.extraActionText}>{this.props.extraActionText}</Text>
          : null
        }
        {
          this.props.extraActionIcon ?
          <Image style={styles.extraIcon} tintColor={this.props.iconTint ? this.props.iconTint : null} resizeMode='contain' source={this.props.extraActionIcon}/>
          : null
        }
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={this.props.extraStyle ? [styles.container, this.props.extraStyle] : styles.container}>
        {
          this.props.showBackButton ?
          <TouchableOpacity style={styles.backButton} onPress={this.onPressBack}>
            <Image style={styles.backIcon} resizeMode='contain' source={require('../../images/arrow_left_black.png')}/>
          </TouchableOpacity>
          :
          null
        }
        {
          this.props.showMenuButton ?
          <TouchableOpacity style={styles.backButton} onPress={this.onPressMenu}>
            <Image style={styles.backIcon} resizeMode='contain' source={require('../../images/icons/baseline_menu_black.png')}/>
          </TouchableOpacity>
          :
          null
        }
        <Text style={styles.headerText}>{this.props.title}</Text>
        {
          this.props.extraAction ?
          this.renderExtraAction()
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: Colors.ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  headerText: {
    color: Colors.WHITE,
    fontSize: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 10,
  },
  backIcon: {
    padding: 10,
    height: 15,
    width: 15,
    tintColor: Colors.WHITE,
  },
  extraActionButton: {
    position: 'absolute',
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraActionText: {
    // color: Colors.ACCENT_DARK,
    fontSize: 14,
    marginRight: 3,
  },
  extraIcon: {
    // height: Constants.TOOLBAR_HEIGHT - 30,
    // width: Constants.TOOLBAR_HEIGHT - 30,
  }
});
