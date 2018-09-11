import { StackActions, NavigationActions } from 'react-navigation';

export const NavigationUtils = {

  navigateWithoutBackstack(navigation, screen, params) {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        params ? NavigationActions.navigate({ routeName: screen, params: params}) : NavigationActions.navigate({ routeName: screen})
      ]
    });
    navigation.dispatch(resetAction);
  },

};
