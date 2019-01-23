import { StyleSheet } from 'react-native';
import { Colors, width, height } from '../../common/SystemConstant';
import { scale, verticalScale, moderateScale } from './ScaleIndicator';

export const DefaultStyle = StyleSheet.create({
  container: {
    flex: 1,
  }, body: {
    width: width,
    // height: height,
    borderRadius: 3,
    backgroundColor: Colors.WHITE,
    paddingBottom: 20
  }, content: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    marginTop: 10,
  }, 
  datepickerRoot: {
    flexDirection: 'row', 
    marginHorizontal: scale(16), 
    justifyContent: 'space-around'
  },  datepickerWrapper: {
    height: verticalScale(100), 
    alignItems: 'center', 
    justifyContent: 'center'
  }, datepickerInput: {
    width: scale(150),
    alignSelf: 'center',
    marginTop: verticalScale(15)
  },
  submitButton:{
    alignSelf: 'center', 
    marginTop: verticalScale(30)
  }, submitButtonText: {
    fontWeight: 'bold', 
    // fontSize: moderateScale(16, 1.3),
    color: Colors.WHITE
  },
  fieldRoot: {
    marginHorizontal: scale(16)
  }, fieldWrapper: {
    alignItems: 'center', 
    justifyContent: 'center'
  },
  headerWrapper:{
    backgroundColor: Colors.RED_PANTONE_186C
  }, headerItemWrapper:{
    backgroundColor: Colors.WHITE
  }
});