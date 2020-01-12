import React from 'react';
import { Icon } from 'react-native-elements';
import { Input, Item } from 'native-base';
import { SearchSectionStyle } from '../../assets/styles';
import { moderateScale } from '../../assets/styles/ScaleIndicator';
import { EMPTY_STRING } from '../../common/SystemConstant';

class SearchSection extends React.Component {
  static defaultProps = {
    hasSearch: true,
    filterValue: EMPTY_STRING,
    placeholderText: 'Mã hiệu, trích yếu',
    filterValueText: 'filterValue',
    customContainerStyle: {},
  }
  render() {
    const {
      hasSearch,
      filterValue, placeholderText, filterValueText,
      filterFunc, handleChangeFunc, clearFilterFunc,
      customContainerStyle
    } = this.props;
    if (hasSearch) {
      return (
        <Item style={[SearchSectionStyle.container, customContainerStyle]}>
          <Icon name='ios-search' type='ionicon' size={moderateScale(13, 1.12)} containerStyle={SearchSectionStyle.leftIcon} />
          <Input
            placeholder={placeholderText}
            value={filterValue}
            onChangeText={handleChangeFunc(filterValueText)}
            onSubmitEditing={() => filterFunc()}
            style={{ fontSize: moderateScale(13, 1.12) }}
          />
          {
            filterValue !== EMPTY_STRING
              ? <Icon name='ios-close-circle' type='ionicon'
                size={moderateScale(13, 1.12)}
                containerStyle={SearchSectionStyle.rightIcon}
                onPress={() => clearFilterFunc()} />
              : null
          }
        </Item>
      );
    }
    return null;
  }
}

export default SearchSection;