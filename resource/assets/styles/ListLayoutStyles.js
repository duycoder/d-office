import { StyleSheet } from 'react-native';
import { COMMON_COLOR, customWorkflowListHeight } from '../../common/SystemConstant';
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
    color: COMMON_COLOR.DANK_GRAY,
    fontSize: moderateScale(11, 1.1)
  },
  rightContainer: {
    width: '70%'
  }, rightText: {
    fontSize: moderateScale(12, 1.1)
  },
});

const GroupListStyle = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    overflow: 'scroll',
  },
  titleContainer: {
  },
  listItemContainer: {
    height: customWorkflowListHeight,
    backgroundColor: COMMON_COLOR.LITE_BLUE,
    justifyContent: 'center'
  },
  listItemTitle: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: moderateScale(14.5, 0.89),
  },
  body: {

  }
});

export {
  ItemProportion,
  ColumnedItemStyle,
  GroupListStyle,
}