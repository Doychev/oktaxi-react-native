import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import { NetworkUtils } from '../../util/NetworkUtils.js';
import Spinner from 'react-native-loading-spinner-overlay';

import { strings } from '../../../locales/i18n';

export default class ReviewScreen extends React.Component {
  static navigationOptions = { title: 'Review', header: null };

  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      reviewText: '',
      currentRating: 5,
    };
  }

  async componentDidMount() {
    const encodedUser = await AsyncStorage.getItem(Constants.ASYNC_STORE_ENCODED_USER);
    this.setState({
      encodedUser: encodedUser,
    });

    if (this.props.navigation.state.params.resultText) {
      this.setState({
        version: responseJson.version,
      });
    }

    if (this.props.navigation.state.params.orderId) {
      this.setState({
        orderId: this.props.navigation.state.params.orderId,
      });
    }
  }

  showSpinner() {
    this.setState({ spinnerVisible : true});
  }

  hideSpinner() {
    this.setState({ spinnerVisible : false});
  }

  onPressSend = async () => {
    this.showSpinner();
    let response = await NetworkUtils.fetch(
       Constants.BASE_URL + "order/" + this.state.orderId + "/review", {
        method: 'POST',
        headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : 'Basic ' + this.state.encodedUser,
        },
        body: JSON.stringify({
          "messageId": this.state.orderId,
          "text": this.state.reviewText,
          "score": this.state.currentRating,
        }),
      }
    );
    if (!response.ok) {
      this.hideSpinner();
      alert('error');
    } else {
      this.hideSpinner();
      this.setState({
        step: 2,
      });
    }
  }

  onPressNewOrder = () => {
    this.props.navigation.navigate('Home');
  }

  onPressStar = (index) => {
    this.setState({
      currentRating: index,
    });
  }

  getRatingImage = (index) => {
    if (index <= this.state.currentRating) {
      return require('../../images/star_full.png');
    } else {
      return require('../../images/star_empty.png');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={strings('content.please_wait')} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Toolbar title={strings('content.activity_title_confirm')} navigation={this.props.navigation}/>
        <View style={styles.content}>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{this.state.step == 1 ? strings('content.order_completed') : strings('content.thank_you_for_order')}</Text>
          </View>
          {
            this.state.step == 1 ?
            <View style={styles.resultBox}>
              <View style={styles.ratingsRow}>
                <TouchableOpacity style={styles.starButton} onPress={() => this.onPressStar(1)}>
                  <Image style={styles.starImage} source={this.getRatingImage(1)}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.starButton} onPress={() => this.onPressStar(2)}>
                  <Image style={styles.starImage} source={this.getRatingImage(2)}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.starButton} onPress={() => this.onPressStar(3)}>
                  <Image style={styles.starImage} source={this.getRatingImage(3)}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.starButton} onPress={() => this.onPressStar(4)}>
                  <Image style={styles.starImage} source={this.getRatingImage(4)}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.starButton} onPress={() => this.onPressStar(5)}>
                  <Image style={styles.starImage} source={this.getRatingImage(5)}/>
                </TouchableOpacity>
              </View>
            </View>
            : null
          }
          {
            this.state.step == 1 ?
            <View style={[styles.resultBox, styles.reviewMargin]}>
              <TextInput style={styles.ratingDescription} value={this.state.reviewText}
                onChangeText={(value) => this.setState({reviewText: value})}
                multiline = {true} numberOfLines={4} placeholder={strings('content.order_completed_review')}
                returnKeyType='next' autoCapitalize = 'none'></TextInput>
            </View>
            : null
          }
          <TouchableOpacity style={styles.button} onPress={this.state.step == 1 ? this.onPressSend : this.onPressNewOrder}>
            <Text style={styles.buttonText}>{this.state.step == 1 ? strings('content.review_save') : strings('content.to_home_screen')}</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 50,
  },
  resultBox: {
    backgroundColor: Colors.WHITE,
    paddingTop: 10,
    paddingBottom: 10,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: Colors.BLACK,
    shadowOffset: { height: 5, width: 0},
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight: 20,
  },
  resultText: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.ORANGE,
  },
  ratingDescription: {
    color: Colors.BLACK,
    fontSize: 16,
    marginLeft: 5,
    marginRight: 20,
  },
  button: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
    marginTop: 25,
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
  ratingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  starButton: {
    flex: 1,
  },
  starImage: {
    width: 50,
    height: 50,
  },
  reviewMargin: {
    minHeight: 90,
    maxHeight: 150,
    marginTop: 10,
  }
});
