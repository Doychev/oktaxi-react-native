import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, AsyncStorage } from 'react-native';
import { Colors } from '../../Colors.js';
import { Constants } from '../../Constants.js';
import Toolbar from '../elements/Toolbar';
import CheckBox from 'react-native-checkbox';
import { NetworkUtils } from '../../util/NetworkUtils.js';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { strings } from '../../../locales/i18n';

export default class OrderTaxiScreen extends React.Component {
  static navigationOptions = { title: 'Order Taxi', header: null };

  constructor(props) {
    super(props);

    this.state = {
      spinnerVisible : false,
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
      isDateTimePickerVisible: false,
      deferredTime: new Date(new Date().getTime() + 15*60*1000),
      deferredLimit: new Date(new Date().getTime() + 15*60*1000),
    };
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    this.setState({
      deferredTime: date,
    });
    this._hideDateTimePicker();
  };

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
    this.showSpinner();
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
          "fixedStartDate": this.state.deferredTime,
          "status": 0,
        }),
      }
    );
    if (!response.ok) {
      this.hideSpinner();
      //SHOW ERROR
    } else {
      this.hideSpinner();
      if (this.state.deferredChecked) {
        var responseJson = await response.json();
        if (responseJson.errorCode != null) {
          //todo: handle
        } else {
          this.props.navigation.navigate('OrderTaxiEnd', {
            orderId: responseJson.id,
            resultText: strings('content.order_fixed_start_date_text'),
            orderStatus: responseJson.status,
          });
        }
      } else {
        this.props.navigation.navigate('OrderTaxiResult', {response: response,
          startLatitude: this.state.pickUpLocationLatitude, startLongitude: this.state.pickUpLocationLongitude});
      }
    }
  }

  showSpinner() {
    this.setState({ spinnerVisible : true});
  }

  hideSpinner() {
    this.setState({ spinnerVisible : false});
  }

  onPressDeferredDate = () => {
    this.setState({
      isDateTimePickerVisible: true,
    });
  }

  getDate(date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  }

  getTime(date) {
    return date.getHours() + ":" + date.getMinutes();
  }

  getDeferredDateFormatted(date) {
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinnerVisible} animation='fade' textContent={strings('content.please_wait')} overlayColor={Colors.OVERLAY} textStyle={{color: '#FFF'}}/>
        <Toolbar showBackButton={true} title={strings('content.activity_title_confirm')} navigation={this.props.navigation}/>
        <View style={styles.content}>
          <View style={styles.inputSection}>
            <View style={styles.input}>
              <Image style={styles.inputIcon} resizeMode='contain'
                source={require('../../images/icons/baseline_person_pin_circle_black.png')}/>
              <TextInput style={styles.inputText} value={this.state.pickUpAddress}
                label={strings('content.take_me_from_here')} labelStyle={styles.checkboxLabel}
                onChangeText={(value) => this.setState({pickUpAddress: value})}
                returnKeyType='next' autoCapitalize = 'none'
                ref='pickUpAddressField'
                onSubmitEditing={(event) => { this.refs.dropOffAddressField.focus(); }} />
            </View>
            <View style={styles.input}>
              <Image style={styles.inputIcon} resizeMode='contain'
                source={require('../../images/icons/baseline_place_black.png')}/>
              <TextInput style={styles.inputText} value={this.state.dropOffAddress} label={strings('content.destination')}
                onChangeText={(value) => this.setState({dropOffAddress: value})}
                returnKeyType='next' autoCapitalize = 'none'
                ref='dropOffAddressField'
                onSubmitEditing={(event) => { this.refs.remarksField.focus(); }}/>
            </View>
            <View style={styles.input}>
              <Image style={styles.inputIcon} resizeMode='contain'
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
            {
              this.state.deferredChecked ?
              <View style={styles.deferredLine}>
                <TouchableOpacity style={styles.dateButton} onPress={this.onPressDeferredDate}>
                  <Image style={styles.calendarIcon} resizeMode='contain'
                    source={require('../../images/icons/calendar_icon.png')}/>
                  <Text style={styles.dateText}>{this.getDate(this.state.deferredTime)}</Text>
                  <View style={styles.dateUnderline} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.timeButton} onPress={this.onPressDeferredDate}>
                  <Image style={styles.calendarIcon} resizeMode='contain'
                    source={require('../../images/icons/clock_icon.png')}/>
                  <Text style={styles.dateText}>{this.getTime(this.state.deferredTime)}</Text>
                  <View style={styles.dateUnderline} />
                </TouchableOpacity>
              </View>
              : null
            }
            <DateTimePicker
              mode='datetime'
              minimumDate={new Date(this.state.deferredLimit)}
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
            />
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
    tintColor: Colors.ORANGE,
  },
  calendarIcon: {
    width: 35,
    height: 35,
    marginRight: 5,
    tintColor: Colors.GRAY,
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
  deferredLine: {
    flexDirection: 'row',
  },
  dateButton: {
    flex: 3,
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 20,
  },
  timeButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 10,
  },
  dateText: {
    fontSize: 20,
  },
  timeText: {
    fontSize: 20,
  },
  dateUnderline: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 1,
    backgroundColor: Colors.GRAY,
    marginLeft: 5,
    marginRight: 5,
    marginTop: -10,
  }

});
