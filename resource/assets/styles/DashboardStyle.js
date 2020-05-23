import { StyleSheet } from 'react-native';
import { COMMON_COLOR } from '../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

export const DashboardStyle = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});