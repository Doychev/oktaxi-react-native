import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import CheckBox from 'react-native-checkbox';
import { NetworkUtils } from '../../util/NetworkUtils.js';

import { strings } from '../../../locales/i18n';

export default class OrderTaxiScreen extends React.Component {
  static navigationOptions = { title: 'Order Taxi', header: null };

  constructor(props) {
    super(props);
    this.state = {
      luggageChecked: false,
      posChecked: false,
      voucherChecked: false,
      deferredChecked: false,
      pickUpAddress: this.props.navigation.state.params.pickUpLocationDescription,
      pickUpLocationLatitude: this.props.navigation.state.params.pickUpLocationLatitude,
      pickUpLocationLongitude: this.props.navigation.state.params.pickUpLocationLongitude,
      dropOffAddress: this.props.navigation.state.params.dropOffLocationDescription,
      dropOffLocationLatitude: this.props.navigation.state.params.dropOffLocationLatitude,
      dropOffLocationLongitude: this.props.navigation.state.params.dropOffLocationLongitude,
    };
  }

  async componentDidMount() {
    const encodedUser = await AsyncStorage.getItem(Constants.ASYNC_STORE_ENCODED_USER);
    this.setState({
      encodedUser: encodedUser,
    });

    const username = await AsyncStorage.getItem(Constants.ASYNC_STORE_USERNAME);
    this.setState({
      username: username,
    });


  }

  onCheckLuggage = (checked) => {
    this.setState({
      luggageChecked: !this.state.luggageChecked,
    });
  }

  onCheckPos = (checked) => {
    this.setState({
      posChecked: !this.state.posChecked,
    });
  }

  onCheckVoucher = (checked) => {
    this.setState({
      voucherChecked: !this.state.voucherChecked,
    });
  }

  onCheckDeferred = (checked) => {
    this.setState({
      deferredChecked: !this.state.deferredChecked,
    });
  }

  onPressOrder = async () => {

    let response = await NetworkUtils.fetch(
       Constants.BASE_URL + "order", {
        method: 'POST',
        headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization' : 'Basic ' + this.state.encodedUser,
        },
        body: JSON.stringify({
          "startAddress": {
        		"id": 0,
        		"latitude": this.state.pickUpLocationLatitude,
        		"longitude": this.state.pickUpLocationLongitude,
        		"text": this.state.pickUpAddress,
        	},
        	"endAddress": {
        		"id": 0,
            "latitude": this.state.dropOffLocationLatitude,
        		"longitude": this.state.dropOffLocationLongitude,
        		"text": this.state.dropOffAddress,
        	},
          "phoneNumber": this.state.username,
          "remark": this.state.remarks,
        	"luggage": this.state.luggageChecked ? 1 : 0,
        	"pos": this.state.posChecked ? 1 : 0,
          "voucherPayment": this.state.voucherChecked ? 1 : 0,
          "voucherCode": this.state.voucherNumber,
          "fixedStart": this.state.deferredChecked ? 1 : 0,
          // "fixedStartDate": "2018-06-12 17:30:49",
          "fixedStartDate": "",
          "status": 0,
        }),
      }
    );
    if (!response.ok) {
      //SHOW ERROR
      this.setState({
        remarks: JSON.stringify(response),
      });
    } else {
      this.setState({
        remarks: JSON.stringify(response),
      });
      // NavigationUtils.navigateWithoutBackstack(this.props.navigation, 'Home');
      // this.props.navigation.navigate('Home');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Toolbar showBackButton={true} title={strings('content.activity_title_confirm')} navigation={this.props.navigation}/>
        <View style={styles.content}>
          <View style={styles.inputSection}>
            <View style={styles.input}>
              <Image style={styles.inputIcon} resizeMode='contain' tintColor={Colors.ORANGE}
                source={require('../../images/icons/baseline_person_pin_circle_black.png')}/>
              <TextInput style={styles.inputText} value={this.state.pickUpAddress}
                onChangeText={(value) => this.setState({pickUpAddress: value})}
                returnKeyType='next' autoCapitalize = 'none'
                ref='pickUpAddressField'
                onSubmitEditing={(event) => { this.refs.dropOffAddressField.focus(); }} />
            </View>
            <View style={styles.input}>
              <Image style={styles.inputIcon} resizeMode='contain' tintColor={Colors.ORANGE}
                source={require('../../images/icons/baseline_place_black.png')}/>
              <TextInput style={styles.inputText} value={this.state.dropOffAddress}
                onChangeText={(value) => this.setState({dropOffAddress: value})}
                returnKeyType='next' autoCapitalize = 'none'
                ref='dropOffAddressField'
                onSubmitEditing={(event) => { this.refs.remarksField.focus(); }}/>
            </View>
            <View style={styles.input}>
              <Image style={styles.inputIcon} resizeMode='contain' tintColor={Colors.ORANGE}
                source={require('../../images/icons/baseline_description_black.png')}/>
              <TextInput style={styles.inputText} value={this.state.remarks}
                onChangeText={(value) => this.setState({remarks: value})}
                returnKeyType='next' autoCapitalize = 'none'
                ref='remarksField'
                placeholder={strings('content.remark')} placeholderTextColor={Colors.GRAY} />
            </View>
            <CheckBox label={strings('content.more_luggage')} checked={this.state.luggageChecked}
              containerStyle={styles.checkbox} labelStyle={styles.checkboxLabel} onChange={(checked) => this.onCheckLuggage(checked)} />
            <CheckBox label={strings('content.pos_payment')} checked={this.state.posChecked}
              containerStyle={styles.checkbox} labelStyle={styles.checkboxLabel} onChange={(checked) => this.onCheckPos(checked)} />
            <CheckBox label={strings('content.voucher_payment')} checked={this.state.voucherChecked}
              containerStyle={styles.checkbox} labelStyle={styles.checkboxLabel} onChange={(checked) => this.onCheckVoucher(checked)} />
            {
              this.state.voucherChecked ?
              <View>
                <TextInput style={styles.voucherText} value={this.state.voucherNumber}
                  onChangeText={(value) => this.setState({voucherNumber: value})}
                  returnKeyType='next' autoCapitalize = 'none'/>
                <View style={styles.underline} />
              </View>
              : null
            }
            <CheckBox label={strings('content.order_later')} checked={this.state.deferredChecked}
              containerStyle={styles.checkbox} labelStyle={styles.checkboxLabel} onChange={(checked) => this.onCheckDeferred(checked)} />
          </View>
          <TouchableOpacity style={styles.orderButton} onPress={this.onPressOrder}>
            <Text style={styles.buttonText}>{strings('content.order')}</Text>
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
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  inputSection: {
    flex: 1,
    marginTop: 40,
  },
  input: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    marginLeft: 5,
    marginRight: 5,
  },
  inputIcon: {
    width: 26,
    height: 26,
    marginRight: 20,
  },
  inputText: {
    width: '80%',
  },
  voucherText: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    marginLeft: 5,
    marginRight: 5,
  },
  underline: {
    width: '50%',
    height: 1,
    backgroundColor: Colors.GRAY,
    marginBottom: 5,
    marginLeft: 5,
  },
  checkbox: {
    marginTop: 5,
    marginLeft: 5,
  },
  checkboxLabel: {
    color: Colors.BLACK,
  },
  orderButton: {
    margin: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.YELLOW,
  },
  buttonText: {
    margin: 8,
    fontSize: 20,
    color: Colors.WHITE,
    fontWeight: 'bold',
  },

});
