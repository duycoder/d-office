import { Text, TextInput, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

DatePicker.defaultProps = DatePicker.defaultProps || {};
DatePicker.defaultProps.allowFontScaling = false;

Alert.defaultProps = Alert.defaultProps || {};
Alert.defaultProps.allowFontScaling = false;