import { StyleSheet } from 'react-native';
import { verticalScale, moderateScale, scale } from './ScaleIndicator';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: '#cbd2d9'
  }, listItemContainer: {
    paddingTop: verticalScale(10),
    paddingRight: scale(10),
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5'
  }, listItemTitleContainer: {
    fontWeight: 'bold',
    color: '#777',
    fontSize: moderateScale(11, 0.9)
  }, listItemSubTitleContainer: {
    fontSize: moderateScale(12, 1.3),
    color: 'black',
    fontWeight: 'normal',
    marginTop: 5
  }
});