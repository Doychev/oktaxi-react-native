import { Platform, NetInfo } from 'react-native';

export const NetworkUtils = {

  checkForNetwork() {
    if (Platform.OS === 'ios') {
      return new Promise(resolve => {
        const handleFirstConnectivityChangeIOS = isConnected => {
          NetInfo.isConnected.removeEventListener('connectionChange', handleFirstConnectivityChangeIOS);
          resolve(isConnected);
        };
        NetInfo.isConnected.addEventListener('connectionChange', handleFirstConnectivityChangeIOS);
      });
    }
    return NetInfo.isConnected;
  },

  fetch(url, params) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("timeout"))
      }, 10000);
      fetch(url, params).then(resolve, reject);
    });
  },

};
