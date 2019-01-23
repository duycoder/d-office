import React, { Component } from 'react';
import {
  AsyncStorage, ActivityIndicator, View, Text as RnText,
  FlatList, RefreshControl, TouchableOpacity, StyleSheet, Platform
} from 'react-native';
import {
  Container, Header, Left, Input,
  Item, Icon, Button, Text, Content, Row, Form, Label, Picker
} from 'native-base';
import DatePicker from 'react-native-datepicker';
import Modal from 'react-native-modal';

import { DefaultStyle } from '../../../assets/styles/AdvancedSearchStyle';
import {
  API_URL, HEADER_COLOR, EMPTY_STRING,
  LOADER_COLOR, CONGVIEC_CONSTANT,
  DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE,
  Colors,
  EMTPY_DATA_MESSAGE
} from '../../../common/SystemConstant';
import Panel from '../../common/Panel';

export default class BaseDocSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Advanced Search Bar Params
      trichYeu: this.props.filterValue,
      maHieu: EMPTY_STRING,
      doMat: EMPTY_STRING,
      doKhan: EMPTY_STRING,
      linhVucVanBan: EMPTY_STRING,
      loaiVanBan: EMPTY_STRING,
      nguoiKy: EMPTY_STRING,
      donviBanhanh: EMPTY_STRING,
      ngayBanhanhStart: EMPTY_STRING,
      ngayBanhanhEnd: EMPTY_STRING,
      ngayHieulucStart: EMPTY_STRING,
      ngayHieulucEnd: EMPTY_STRING,
      ngayHetHieulucStart: EMPTY_STRING,
      ngayHetHieulucEnd: EMPTY_STRING,
      ngayVanbanStart: EMPTY_STRING,
      ngayVanbanEnd: EMPTY_STRING,
      soVanban: EMPTY_STRING,

      listLinhvucVanban: [],
      listLoaiVanban: [],
      listDonviBanhanh: [],
      listSoVanban: [],
    }
  }

  fetchList = () => {
    // get from API and setState to our list
  }

  submitSearch = () => {
    // post to API
    this.props._toggleModal();
  }

  _handleChange = fieldName => value => this.setState({ [fieldName]: value });

  render() {
    const pickerStyle = Platform.OS === 'ios' ? { justifyContent: 'center' } : { width: '100%' };
    const datePickerCustomStyles = {
      dateIcon: {
        position: 'absolute',
        left: 0,
        top: 0,
        marginLeft: 0
      },
      dateInput: {
        marginLeft: 0
      }
    };

    return (

      <Content>
        <View style={DefaultStyle.body}>
          <Header searchBar rounded style={DefaultStyle.headerWrapper}>
            <Item style={DefaultStyle.headerItemWrapper}>
              <Icon name='ios-search' />
              <Input placeholder='Trích yếu'
                value={this.state.trichYeu}
                onChangeText={this._handleChange("trichYeu")}
              />
            </Item>
            <Button onPress={this.props._toggleModal} transparent>
              <RnText style={DefaultStyle.submitButtonText}>Đóng</RnText>
            </Button>
          </Header>
          <View style={DefaultStyle.content}>

            <View style={DefaultStyle.fieldRoot} >
              <Item stackedLabel style={DefaultStyle.fieldWrapper}>
                <Label>Mã hiệu</Label>
                <Input value={this.state.maHieu} onChangeText={this._handleChange("maHieu")} />
              </Item>
              <Item stackedLabel style={DefaultStyle.fieldWrapper}>
                <Label>Người ký</Label>
                <Input value={this.state.nguoiKy} onChangeText={this._handleChange("nguoiKy")} />
              </Item>
            </View>
            <Panel title="Độ nghiêm trọng">
              <View style={DefaultStyle.fieldRoot} >
                <Item stackedLabel>
                  <Label style={DefaultStyle.fieldWrapper}>Độ mật</Label>
                  <Picker
                    iosHeader='Chọn độ mật'
                    mode='dropdown'
                    iosIcon={<Icon name='ios-arrow-down-outline' />}
                    style={pickerStyle}
                    selectedValue={this.state.doMat}
                    onValueChange={this._handleChange("doMat")}>
                    <Picker.Item value="Quan Trọng" label="Quan Trọng" />
                    <Picker.Item value="Rất Quan Trọng" label="Rất Quan Trọng" />
                  </Picker>
                </Item>
              </View>
              <View style={DefaultStyle.fieldRoot} >
                <Item stackedLabel>
                  <Label>Độ khẩn</Label>
                  <Picker
                    iosHeader='Chọn độ khẩn'
                    mode='dropdown'
                    iosIcon={<Icon name='ios-arrow-down-outline' />}
                    style={pickerStyle}
                    selectedValue={this.state.doKhan}
                    onValueChange={this._handleChange("doKhan")}>
                    <Picker.Item value="Bình thường" label="Bình thường" />
                    <Picker.Item value="Cao" label="Cao" />
                  </Picker>
                </Item>
              </View>
            </Panel>

            <Panel title={"Thời gian"}>
              <View style={DefaultStyle.datepickerRoot}>
                <Item stackedLabel style={DefaultStyle.datepickerWrapper}>
                  <Label>Ban hành</Label>
                  <DatePicker
                    style={DefaultStyle.datepickerInput}
                    date={this.state.ngayBanhanhStart}
                    mode="date"
                    placeholder='Từ ngày'
                    format='DD/MM/YYYY'
                    minDate={new Date()}
                    confirmBtnText='CHỌN'
                    cancelBtnText='BỎ'
                    customStyles={datePickerCustomStyles}
                    onDateChange={this._handleChange("ngayBanhanhStart")}
                    showIcon={false}
                  />
                </Item>
                <Item stackedLabel style={DefaultStyle.datepickerWrapper}>
                  <Label style={{ color: '#fff' }}>Co hieu luc</Label>
                  <DatePicker
                    style={DefaultStyle.datepickerInput}
                    date={this.state.ngayBanhanhEnd}
                    mode="date"
                    placeholder='Đến ngày'
                    format='DD/MM/YYYY'
                    minDate={new Date()}
                    confirmBtnText='CHỌN'
                    cancelBtnText='BỎ'
                    customStyles={datePickerCustomStyles}
                    onDateChange={this._handleChange("ngayBanhanhEnd")}
                    showIcon={false}
                  />
                </Item>
              </View>

              <View style={DefaultStyle.datepickerRoot}>
                <Item stackedLabel style={DefaultStyle.datepickerWrapper}>
                  <Label>Có hiệu lực</Label>
                  <DatePicker
                    style={DefaultStyle.datepickerInput}
                    date={this.state.ngayHieulucStart}
                    mode="date"
                    placeholder='Từ ngày'
                    format='DD/MM/YYYY'
                    minDate={new Date()}
                    confirmBtnText='CHỌN'
                    cancelBtnText='BỎ'
                    customStyles={datePickerCustomStyles}
                    onDateChange={this._handleChange("ngayHieulucStart")}
                    showIcon={false}
                  />
                </Item>
                <Item stackedLabel style={DefaultStyle.datepickerWrapper}>
                  <Label style={{ color: '#fff' }}>Co hieu luc</Label>
                  <DatePicker
                    style={DefaultStyle.datepickerInput}
                    date={this.state.ngayHieulucEnd}
                    mode="date"
                    placeholder='Đến ngày'
                    format='DD/MM/YYYY'
                    minDate={new Date()}
                    confirmBtnText='CHỌN'
                    cancelBtnText='BỎ'
                    customStyles={datePickerCustomStyles}
                    onDateChange={this._handleChange("ngayHieulucEnd")}
                    showIcon={false}
                  />
                </Item>
              </View>

              <View style={DefaultStyle.datepickerRoot}>
                <Item stackedLabel style={DefaultStyle.datepickerWrapper}>
                  <Label>Hết hiệu lực</Label>
                  <DatePicker
                    style={DefaultStyle.datepickerInput}
                    date={this.state.ngayHetHieulucStart}
                    mode="date"
                    placeholder='Từ ngày'
                    format='DD/MM/YYYY'
                    minDate={new Date()}
                    confirmBtnText='CHỌN'
                    cancelBtnText='BỎ'
                    customStyles={datePickerCustomStyles}
                    onDateChange={this._handleChange("ngayHetHieulucStart")}
                    showIcon={false}
                  />
                </Item>
                <Item stackedLabel style={DefaultStyle.datepickerWrapper}>
                  <Label style={{ color: '#fff' }}>Co hieu luc</Label>
                  <DatePicker
                    style={DefaultStyle.datepickerInput}
                    date={this.state.ngayHetHieulucEnd}
                    mode="date"
                    placeholder='Đến ngày'
                    format='DD/MM/YYYY'
                    minDate={new Date()}
                    confirmBtnText='CHỌN'
                    cancelBtnText='BỎ'
                    customStyles={datePickerCustomStyles}
                    onDateChange={this._handleChange("ngayHetHieulucEnd")}
                    showIcon={false}
                  />
                </Item>
              </View>

              <View style={DefaultStyle.datepickerRoot}>
                <Item stackedLabel style={DefaultStyle.datepickerWrapper}>
                  <Label>Ngày văn bản</Label>
                  <DatePicker
                    style={DefaultStyle.datepickerInput}
                    date={this.state.ngayVanbanStart}
                    mode="date"
                    placeholder='Từ ngày'
                    format='DD/MM/YYYY'
                    minDate={new Date()}
                    confirmBtnText='CHỌN'
                    cancelBtnText='BỎ'
                    customStyles={datePickerCustomStyles}
                    onDateChange={this._handleChange("ngayVanbanStart")}
                    showIcon={false}
                  />
                </Item>
                <Item stackedLabel style={DefaultStyle.datepickerWrapper}>
                  <Label style={{ color: '#fff' }}>Co hieu luc</Label>
                  <DatePicker
                    style={DefaultStyle.datepickerInput}
                    date={this.state.ngayVanbanEnd}
                    mode="date"
                    placeholder='Đến ngày'
                    format='DD/MM/YYYY'
                    minDate={new Date()}
                    confirmBtnText='CHỌN'
                    cancelBtnText='BỎ'
                    customStyles={datePickerCustomStyles}
                    onDateChange={this._handleChange("ngayVanbanEnd")}
                    showIcon={false}
                  />
                </Item>
              </View>
            </Panel>
            <Button style={DefaultStyle.submitButton} onPress={this.submitSearch}>
              <Text style={DefaultStyle.submitButtonText}>Tìm kiếm</Text>
            </Button>
          </View>
        </View>
      </Content>

    );
  }
}