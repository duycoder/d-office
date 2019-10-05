import { StyleSheet } from 'react-native';
import { Colors } from '../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

const ItemProportion = StyleSheet.create({
  leftPart: {
    width: '30%'
  }, rightPart: {
    width: '70%'
  }
});

export {
  ItemProportion
}