import React, { Component } from 'react';
import {
  View, Text as RnText,
  TouchableOpacity, StyleSheet, Platform,
  TextInput, ScrollView
} from 'react-native';
import {
  Header, Left, Input, Item, Icon, Button,
  Text, Content, Label, Picker, Body, Right, Title, Container
} from 'native-base';
import { Icon as RneIcon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

// styles
import { DefaultStyle, FormStyle } from '../../../assets/styles/AdvancedSearchStyle';
// constants
import {
  API_URL, EMPTY_STRING, EMTPY_DATA_MESSAGE
} from '../../../common/SystemConstant';
// components
import GroupPanel from './GroupPanel';

export default class BaseTaskSearch extends Component {
  constructor(props) {
    super(props);
    let { tenCongviec,
      batdauStart, batdauEnd, ketthucStart, ketthucEnd,
      doQuantrong, doUutien
    } = this.props.modelSearch;
    this.state = {
      //Advanced Search Bar Params
      tenCongviec: this.props.filterValue,
      doQuantrong: doQuantrong || EMPTY_STRING,
      doUutien: doUutien || EMPTY_STRING,
      batdauStart: batdauStart || EMPTY_STRING,
      batdauEnd: batdauEnd || EMPTY_STRING,
      ketthucStart: ketthucStart || EMPTY_STRING,
      ketthucEnd: ketthucEnd || EMPTY_STRING,

      modelSearch: this.props.modelSearch, // save property of search for next time
    }
  }

  _renderHeader = (backAction, title) => {
    return (
      <Header style={DefaultStyle.headerWrapper}>
        <Left>
          <Button transparent onPress={backAction} hitSlop={{ right: 15 }}>
            <Icon name="arrow-back" style={{ color: "#fff" }} />
          </Button>
        </Left>
        <Body style={{ flex: 3 }}>
          <Title style={{ color: "#fff" }}>{title}</Title>
        </Body>
        <Right />
      </Header>
    );
  }

  fetchList = () => {
    // get from API and setState to our list
  }

  submitSearch = () => {
    // post to API
    this.props.onAdvancedFilter(this.state.modelSearch);
    console.log(this.state.modelSearch)
    // this.props._toggleModal();
  }

  _handleChange = fieldName => value => this.setState({
    [fieldName]: value,
    modelSearch: { ...this.state.modelSearch, [fieldName]: value }
  });

  render() {
    const pickerStyle = Platform.OS === 'ios' ? { justifyContent: 'center' } : { width: '100%' };
    const datePickerCustomStyles = {
      dateIcon: {
        position: 'absolute',
        left: 0,
        top: 0,
        marginLeft: 0
      },
      dateInput: [FormStyle.formInputPicker, { justifyContent: 'center', alignItems: 'flex-start' }]
    };

    return (

      <Container>
        <View style={DefaultStyle.body}>
          <Header searchBar rounded style={DefaultStyle.headerWrapper}>
            <Item style={DefaultStyle.headerItemWrapper}>
              <Icon name='ios-search' />
              <Input placeholder='Tên công việc'
                value={this.state.tenCongviec}
                onChangeText={this._handleChange("tenCongviec")}
              />
            </Item>
            <Button onPress={this.props._toggleModal} transparent hitSlop={{ right: 20 }}>
              <RneIcon color="#fff" name='times' type='font-awesome' />
            </Button>
          </Header>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={DefaultStyle.content}>

              <GroupPanel title="Độ quan trọng" iconName="bookmark" type={1}>
                <View style={DefaultStyle.fieldRoot} >

                  <View style={FormStyle.formLabel}>
                    <Text style={FormStyle.formLabelText}>
                      Mức độ quan trọng
                  </Text>
                  </View>
                  <View style={FormStyle.formInput}>
                    <Picker
                      iosHeader='Chọn độ quan trọng'
                      mode='dropdown'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      style={FormStyle.formInputPicker}
                      selectedValue={this.state.doQuantrong}
                      onValueChange={this._handleChange("doQuantrong")}
                      placeholder='Chọn độ quan trọng'
                      placeholderStyle={{ paddingLeft: 0 }}
                      itemStyle={FormStyle.formPickerItem}
                      textStyle={{ paddingLeft: 0 }}
                      renderHeader={backAction => this._renderHeader(backAction, "Chọn độ quan trọng")}
                    >
                      <Picker.Item value="Quan Trọng" label="Quan Trọng" />
                      <Picker.Item value="Rất Quan Trọng" label="Rất Quan Trọng" />
                    </Picker>
                  </View>

                  <View style={FormStyle.formLabel}>
                    <Text style={FormStyle.formLabelText}>
                      Độ ưu tiên
                </Text>
                  </View>
                  <View style={FormStyle.formInput}>
                    <Picker
                      iosHeader='Chọn độ ưu tiên'
                      mode='dropdown'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      style={FormStyle.formInputPicker}
                      selectedValue={this.state.doUutien}
                      onValueChange={this._handleChange("doUutien")}
                      placeholder="Chọn độ ưu tiên"
                      placeholderStyle={{ paddingLeft: 0 }}
                      textStyle={{ paddingLeft: 0 }}
                      renderHeader={backAction => this._renderHeader(backAction, "Chọn độ ưu tiên")}
                    >
                      <Picker.Item value="Bình thường" label="Bình thường" />
                      <Picker.Item value="Cao" label="Cao" />
                    </Picker>
                  </View>

                </View>
              </GroupPanel>

              <GroupPanel title="Thời gian" iconName="calendar">
                {
                  // Ngày bắt đầu
                }
                <View style={DefaultStyle.datepickerRoot}>
                  <View>
                    <View style={FormStyle.formLabel}>
                      <Text style={FormStyle.formLabelText}>Bắt đầu</Text>
                    </View>
                    <View style={FormStyle.formInput}>
                      <DatePicker
                        style={DefaultStyle.datepickerInput}
                        date={this.state.batdauStart}
                        mode="date"
                        placeholder='Từ ngày'
                        format='DD/MM/YYYY'
                        // minDate={new Date()}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("batdauStart")}
                        showIcon={false}
                      />
                    </View>
                  </View>
                  <View>
                    <View style={FormStyle.formLabel}>
                      <Text style={{ color: 'transparent' }}>.</Text>
                    </View>
                    <View style={FormStyle.formInput}>
                      <DatePicker
                        style={DefaultStyle.datepickerInput}
                        date={this.state.batdauEnd}
                        mode="date"
                        placeholder='Đến ngày'
                        format='DD/MM/YYYY'
                        minDate={(this.state.batdauStart)}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("batdauEnd")}
                        showIcon={false}
                      />
                    </View>
                  </View>
                </View>
                {
                  // Ngày kết thúc
                }
                <View style={DefaultStyle.datepickerRoot}>
                  <View>
                    <View style={FormStyle.formLabel}>
                      <Text style={FormStyle.formLabelText}>Kết thúc</Text>
                    </View>
                    <View style={FormStyle.formInput}>
                      <DatePicker
                        style={DefaultStyle.datepickerInput}
                        date={this.state.ketthucStart}
                        mode="date"
                        placeholder='Từ ngày'
                        format='DD/MM/YYYY'
                        // minDate={new Date()}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("ketthucStart")}
                        showIcon={false}
                      />
                    </View>
                  </View>
                  <View>
                    <View style={FormStyle.formLabel}>
                      <Text style={{ color: 'transparent' }}>.</Text>
                    </View>
                    <View style={FormStyle.formInput}>
                      <DatePicker
                        style={DefaultStyle.datepickerInput}
                        date={this.state.ketthucEnd}
                        mode="date"
                        placeholder='Đến ngày'
                        format='DD/MM/YYYY'
                        minDate={this.state.ketthucStart}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("ketthucEnd")}
                        showIcon={false}
                      />
                    </View>
                  </View>
                </View>

              </GroupPanel>
              <Button style={DefaultStyle.submitButton} onPress={this.submitSearch} iconLeft primary>
                <Icon name='ios-search' />
                <Text style={DefaultStyle.submitButtonText}>TÌM KIẾM</Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </Container>
    );
  }
}