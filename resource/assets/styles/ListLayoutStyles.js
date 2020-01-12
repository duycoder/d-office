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

const ColumnedItemStyle = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  leftContainer: {
    width: '30%',
  }, leftText: {
    color: Colors.DANK_GRAY, 
    fontSize: moderateScale(11, 1.1)
  },
  rightContainer: {
    width: '70%'
  }, rightText: {
    fontSize: moderateScale(12, 1.1)
  },
});

export {
  ItemProportion,
  ColumnedItemStyle,
}