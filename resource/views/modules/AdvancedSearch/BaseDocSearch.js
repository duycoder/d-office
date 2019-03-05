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
  API_URL, EMPTY_STRING, EMTPY_DATA_MESSAGE,
  BASEDOCSEARCH_CONSTANT
} from '../../../common/SystemConstant';
// components
import GroupPanel from './GroupPanel';

export default class BaseDocSearch extends Component {
  constructor(props) {
    super(props);
    let { maHieu, doMat, doKhan,
      linhVucVanBan, loaiVanBan, nguoiKy, donviBanhanh,
      ngayBanhanhStart, ngayBanhanhEnd, ngayHieulucStart, ngayHieulucEnd,
      ngayHetHieulucStart, ngayHetHieulucEnd, ngayVanbanStart, ngayVanbanEnd,
      soVanban } = this.props.modelSearch;
    this.state = {
      //Advanced Search Bar Params
      trichYeu: this.props.filterValue,
      maHieu: maHieu || EMPTY_STRING,
      doMat: doMat || EMPTY_STRING,
      doKhan: doKhan || EMPTY_STRING,
      linhVucVanBan: linhVucVanBan || EMPTY_STRING,
      loaiVanBan: loaiVanBan || EMPTY_STRING,
      nguoiKy: nguoiKy || EMPTY_STRING,
      donviBanhanh: donviBanhanh || EMPTY_STRING,
      ngayBanhanhStart: ngayBanhanhStart || EMPTY_STRING,
      ngayBanhanhEnd: ngayBanhanhEnd || EMPTY_STRING,
      ngayHieulucStart: ngayHieulucStart || EMPTY_STRING,
      ngayHieulucEnd: ngayHieulucEnd || EMPTY_STRING,
      ngayHetHieulucStart: ngayHetHieulucStart || EMPTY_STRING,
      ngayHetHieulucEnd: ngayHetHieulucEnd || EMPTY_STRING,
      ngayVanbanStart: ngayVanbanStart || EMPTY_STRING,
      ngayVanbanEnd: ngayVanbanEnd || EMPTY_STRING,
      soVanban: soVanban || EMPTY_STRING,

      listLinhvucVanban: [],
      listLoaiVanban: [],
      listDonviBanhanh: [],
      listSoVanban: [],
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
              <Input placeholder='Trích yếu'
                value={this.state.trichYeu}
                onChangeText={this._handleChange("trichYeu")}
              />
            </Item>
            <Button onPress={this.props._toggleModal} transparent hitSlop={{ right: 20 }}>
              <RneIcon color="#fff" name='times' type='font-awesome' />
            </Button>
          </Header>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={DefaultStyle.content}>
              <GroupPanel title="Người ký" iconName="user" type={1}>
                <View style={DefaultStyle.fieldRoot} >
                  <View style={FormStyle.formLabel}>
                    <Text style={FormStyle.formLabelText}>
                      Mã hiệu
                    </Text>
                  </View>
                  <View style={FormStyle.formInput}>
                    <TextInput
                      onChangeText={this._handleChange("maHieu")}
                      value={this.state.maHieu}
                      style={FormStyle.formInputText}
                      underlineColorAndroid={'#f7f7f7'}
                      placeholder="ví dụ: 2/CT-BYT"
                    />
                  </View>

                  <View style={FormStyle.formLabel}>
                    <Text style={FormStyle.formLabelText}>
                      Người ký
                    </Text>
                  </View>
                  <View style={FormStyle.formInput}>
                    <TextInput
                      onChangeText={this._handleChange("nguoiKy")}
                      value={this.state.nguoiKy}
                      style={FormStyle.formInputText}
                      underlineColorAndroid={'#f7f7f7'}
                      placeholder="ví dụ: Nguyễn Thị Kim Tiến"
                    />
                  </View>
                </View>
              </GroupPanel>

              <GroupPanel title="Lĩnh vực và đơn vị" iconName="file-text">
                <View style={DefaultStyle.fieldRoot} >
                  <View style={FormStyle.formLabel}>
                    <Text style={FormStyle.formLabelText}>Lĩnh vực văn bản</Text>
                  </View>
                  <View style={FormStyle.formInput}>
                    <Picker
                      iosHeader='Chọn lĩnh vực'
                      mode='dropdown'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      style={FormStyle.formInputPicker}
                      selectedValue={this.state.linhVucVanBan}
                      onValueChange={this._handleChange("linhVucVanBan")}
                      placeholder='Chọn lĩnh vực'
                      placeholderStyle={{ paddingLeft: 0 }}
                      textStyle={{ paddingLeft: 0 }}
                      renderHeader={backAction => this._renderHeader(backAction, "Chọn lĩnh vực")}
                    >
                      {
                        this.state.listLinhvucVanban.length > 0 && this.state.listLinhvucVanban.map((item, index) => (
                          <Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
                        ))
                      }
                    </Picker>
                  </View>

                  <View style={FormStyle.formLabel}>
                    <Text style={FormStyle.formLabelText}>Loại văn bản</Text>
                  </View>
                  <View style={FormStyle.formInput}>
                    <Picker
                      iosHeader='Chọn loại văn bản'
                      mode='dropdown'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      style={FormStyle.formInputPicker}
                      selectedValue={this.state.loaiVanBan}
                      onValueChange={this._handleChange("loaiVanBan")}
                      placeholder='Chọn loại văn bản'
                      placeholderStyle={{ paddingLeft: 0 }}
                      textStyle={{ paddingLeft: 0 }}
                      renderHeader={backAction => this._renderHeader(backAction, "Chọn loại văn bản")}
                    >
                      {
                        this.state.listLoaiVanban.length > 0 && this.state.listLoaiVanban.map((item, index) => (
                          <Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
                        ))
                      }
                    </Picker>
                  </View>

                  <View style={FormStyle.formLabel}>
                    <Text style={FormStyle.formLabelText}>Đơn vị ban hành</Text>
                  </View>
                  <View style={FormStyle.formInput}>
                    <Picker
                      iosHeader='Chọn đơn vị'
                      mode='dropdown'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      style={FormStyle.formInputPicker}
                      selectedValue={this.state.donviBanhanh}
                      onValueChange={this._handleChange("donviBanhanh")}
                      placeholder='Chọn đơn vị'
                      placeholderStyle={{ paddingLeft: 0 }}
                      textStyle={{ paddingLeft: 0 }}
                      renderHeader={backAction => this._renderHeader(backAction, "Chọn đơn vị")}
                    >
                      {
                        this.state.listDonviBanhanh.length > 0 && this.state.listDonviBanhanh.map((item, index) => (
                          <Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
                        ))
                      }
                    </Picker>
                  </View>

                </View>
              </GroupPanel>

              <GroupPanel title="Độ quan trọng" iconName="bookmark">
                <View style={DefaultStyle.fieldRoot} >

                  <View style={FormStyle.formLabel}>
                    <Text style={FormStyle.formLabelText}>
                      Độ mật
                  </Text>
                  </View>
                  <View style={FormStyle.formInput}>
                    <Picker
                      iosHeader='Chọn độ mật'
                      mode='dropdown'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      style={FormStyle.formInputPicker}
                      selectedValue={this.state.doMat}
                      onValueChange={this._handleChange("doMat")}
                      placeholder='Chọn độ mật'
                      placeholderStyle={{ paddingLeft: 0 }}
                      textStyle={{ paddingLeft: 0 }}
                      itemStyle={FormStyle.formPickerItem}
                      renderHeader={backAction => this._renderHeader(backAction, "Chọn độ mật")}
                    >
                      <Picker.Item value="Quan Trọng" label="Quan Trọng" />
                      <Picker.Item value="Rất Quan Trọng" label="Rất Quan Trọng" />
                    </Picker>
                  </View>

                  <View style={FormStyle.formLabel}>
                    <Text style={FormStyle.formLabelText}>
                      Độ khẩn
                </Text>
                  </View>
                  <View style={FormStyle.formInput}>
                    <Picker
                      iosHeader='Chọn độ khẩn'
                      mode='dropdown'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      style={FormStyle.formInputPicker}
                      selectedValue={this.state.doKhan}
                      onValueChange={this._handleChange("doKhan")}
                      placeholder="Chọn độ khẩn"
                      placeholderStyle={{ paddingLeft: 0 }}
                      textStyle={{ paddingLeft: 0 }}
                      renderHeader={backAction => this._renderHeader(backAction, "Chọn độ khẩn")}
                    >
                      <Picker.Item value="Bình thường" label="Bình thường" />
                      <Picker.Item value="Cao" label="Cao" />
                    </Picker>
                  </View>

                </View>
              </GroupPanel>

              <GroupPanel title="Thời gian" iconName="calendar">
                {
                  // Ngày ban hành
                }
                <View style={DefaultStyle.datepickerRoot}>
                  <View>
                    <View style={FormStyle.formLabel}>
                      <Text style={FormStyle.formLabelText}>Ban hành</Text>
                    </View>
                    <View style={FormStyle.formInput}>
                      <DatePicker
                        style={DefaultStyle.datepickerInput}
                        date={this.state.ngayBanhanhStart}
                        mode="date"
                        placeholder='Từ ngày'

                        format='DD/MM/YYYY'
                        // minDate={new Date()}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("ngayBanhanhStart")}
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
                        date={this.state.ngayBanhanhEnd}
                        mode="date"
                        placeholder='Đến ngày'
                        format='DD/MM/YYYY'
                        minDate={(this.state.ngayBanhanhStart)}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("ngayBanhanhEnd")}
                        showIcon={false}
                      />
                    </View>
                  </View>
                </View>
                {
                  // Ngày có hiệu lực
                }
                <View style={DefaultStyle.datepickerRoot}>
                  <View>
                    <View style={FormStyle.formLabel}>
                      <Text style={FormStyle.formLabelText}>Có hiệu lực</Text>
                    </View>
                    <View style={FormStyle.formInput}>
                      <DatePicker
                        style={DefaultStyle.datepickerInput}
                        date={this.state.ngayHieulucStart}
                        mode="date"
                        placeholder='Từ ngày'
                        format='DD/MM/YYYY'
                        // minDate={new Date()}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("ngayHieulucStart")}
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
                        date={this.state.ngayHieulucEnd}
                        mode="date"
                        placeholder='Đến ngày'
                        format='DD/MM/YYYY'
                        minDate={this.state.ngayHieulucStart}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("ngayHieulucEnd")}
                        showIcon={false}
                      />
                    </View>
                  </View>
                </View>
                {
                  // Ngày hết hiệu lực
                }
                <View style={DefaultStyle.datepickerRoot}>
                  <View>
                    <View style={FormStyle.formLabel}>
                      <Text style={FormStyle.formLabelText}>Hết hiệu lực</Text>
                    </View>
                    <View style={FormStyle.formInput}>
                      <DatePicker
                        style={DefaultStyle.datepickerInput}
                        date={this.state.ngayHetHieulucStart}
                        mode="date"
                        placeholder='Từ ngày'
                        format='DD/MM/YYYY'
                        // minDate={new Date()}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("ngayHetHieulucStart")}
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
                        date={this.state.ngayHetHieulucEnd}
                        mode="date"
                        placeholder='Đến ngày'
                        format='DD/MM/YYYY'
                        minDate={this.state.ngayHetHieulucStart}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("ngayHetHieulucEnd")}
                        showIcon={false}
                      />
                    </View>
                  </View>
                </View>
                {
                  // Ngày văn bản
                }
                <View style={DefaultStyle.datepickerRoot}>
                  <View>
                    <View style={FormStyle.formLabel}>
                      <Text style={FormStyle.formLabelText}>Ngày văn bản</Text>
                    </View>
                    <View style={FormStyle.formInput}>
                      <DatePicker
                        style={DefaultStyle.datepickerInput}
                        date={this.state.ngayVanbanStart}
                        mode="date"
                        placeholder='Từ ngày'
                        format='DD/MM/YYYY'
                        // minDate={new Date()}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("ngayVanbanStart")}
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
                        date={this.state.ngayVanbanEnd}
                        mode="date"
                        placeholder='Đến ngày'
                        format='DD/MM/YYYY'
                        minDate={this.state.ngayVanbanStart}
                        confirmBtnText='CHỌN'
                        cancelBtnText='BỎ'
                        customStyles={datePickerCustomStyles}
                        onDateChange={this._handleChange("ngayVanbanEnd")}
                        showIcon={false}
                      />
                    </View>
                  </View>

                </View>
                {
                  // Sổ văn bản
                }
                <View style={DefaultStyle.fieldRoot} >
                  <View style={FormStyle.formLabel}>
                    <Text style={FormStyle.formLabelText}>Sổ văn bản</Text>
                  </View>
                  <View style={FormStyle.formInput}>
                    <Picker
                      iosHeader='Chọn sổ văn bản'
                      mode='dropdown'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      style={FormStyle.formInputPicker}
                      selectedValue={this.state.soVanban}
                      onValueChange={this._handleChange("soVanban")}
                      placeholder='Chọn sổ văn bản'
                      placeholderStyle={{ paddingLeft: 0 }}
                      textStyle={{ paddingLeft: 0 }}
                      renderHeader={backAction => this._renderHeader(backAction, "Chọn sổ văn bản")}
                    >
                      {
                        this.state.listSoVanban.length > 0 && this.state.listSoVanban.map((item, index) => (
                          <Picker.Item value={item.Value.toString()} label={item.Text.toString()} key={index} />
                        ))
                      }
                    </Picker>
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