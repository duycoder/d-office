import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Check when first rendering in diff orientation
let [w, h] = width > height ? [height, width] : [width, height];

// Default width and height of all devices
const baseWidth = 350;
const baseHeight = 680;

// Scale via width
const scale = size => w / baseWidth * size;
// Scale via height
const verticalScale = size => h / baseHeight * size;
// Scale via width and factor
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const indicatorResponsive = Platform.OS === 'ios' ? 'large' : moderateScale(50, 2.5);

export {
  scale,
  verticalScale,
  moderateScale,
  indicatorResponsive
};