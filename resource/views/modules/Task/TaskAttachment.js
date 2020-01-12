/*
* @description: tài liệu đính kèm công việc
* @author: duynn
* @since: 12/05/2018
*/
'use strict'
import React, { Component } from 'react'
import {
    Platform, Alert, ActivityIndicator,
    View, Text, Image, ScrollView, FlatList,
    TouchableOpacity, RefreshControl, PermissionsAndroid
} from 'react-native'

//lib
import renderIf from 'render-if';
import { List, ListItem, Icon as RneIcon } from 'react-native-elements';
import RNFetchBlob from 'rn-fetch-blob';
import { Container, Content, Header, Item, Input, Icon } from 'native-base';
import OpenFile from 'react-native-doc-viewer';
import * as util from 'lodash';

//styles
import { ListTaskStyle, DetailTaskStyle } from '../../../assets/styles/TaskStyle';

import {
    EMTPY_DATA_MESSAGE, WEB_URL, Colors,
    EMPTY_STRING, LOADER_COLOR, API_URL
} from '../../../common/SystemConstant';

//utilities
import { formatLongText, isImage, emptyDataPage, asyncDelay, 
    convertDateToString, convertTimeToString, onDownloadFile, extention } from '../../../common/Utilities';
import { verticalScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';
import { getFileExtensionLogo, getFileSize } from '../../../common/Effect';
import { NativeBaseStyle } from '../../../assets/styles';


export default class TaskAttachment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            attachments: props.info.ListTaiLieu,
            searching: false,
            CongViec: props.info.CongViec,
            filterValue: EMPTY_STRING
        }
    }

    async onAttachFilter() {
        this.setState({
            searching: true
        });

        const url = `${API_URL}/api/HscvCongViec/SearchAttachment?id=${this.state.CongViec.ID}&attQuery=${this.state.filterValue}`;
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        })

        const result = await fetch(url, {
            method: 'POST',
            headers
        });
        const resultJson = await result.json();

        await asyncDelay(1000);

        this.setState({
            searching: false,
            attachments: resultJson
        });
    }

    renderItem = ({ item }) => {
        let regExtension = extention(item.DUONGDAN_FILE);
        let extension = regExtension ? regExtension[0] : "";
        return <ListItem
            leftIcon={getFileExtensionLogo(extension)}
            title={item.TENTAILIEU}
            titleStyle={{
                marginLeft: 10,
                color: '#707070',
                fontWeight: 'bold'
            }}
            subtitle={
                getFileSize(item.KICHCO) + " | " + convertDateToString(item.NGAYTAO) + " " + convertTimeToString(item.NGAYTAO)
            }
            subtitleStyle={{
                fontWeight: 'normal',
                color: '#707070',
                marginLeft: 10,
            }}
            rightIcon={
                <RneIcon name='download' color={Colors.GREEN_PANTON_369C} size={verticalScale(25)} type='entypo' />
            }
            onPress={() => onDownloadFile(item.TENTAILIEU, item.DUONGDAN_FILE, item.DINHDANG_FILE)}
        />
    }

    render() {
        return (
            <Container>
                <Header searchBar style={NativeBaseStyle.container}>
                    <Item style={{ backgroundColor: Colors.WHITE }}>
                        <Icon name='ios-search' />
                        <Input placeholder='Tên tài liệu'
                            value={this.state.filterValue}
                            onChangeText={(filterValue) => this.setState({ filterValue })}
                            onSubmitEditing={() => this.onAttachFilter()} />
                    </Item>
                </Header>


                <Content contentContainerStyle={{ flex: 1, justifyContent: (this.state.searching) ? 'center' : 'flex-start' }}>
                    {
                        renderIf(this.state.searching)(
                            <ActivityIndicator size={indicatorResponsive} animating color={Colors.BLUE_PANTONE_640C} />
                        )
                    }

                    {
                        renderIf(!this.state.searching)(
                            <List containerStyle={DetailTaskStyle.listContainer}>
                                <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    data={this.state.attachments}
                                    renderItem={this.renderItem}
                                    ListEmptyComponent={() =>
                                        this.state.loading ? null : (
                                            emptyDataPage()
                                        )
                                    }
                                />
                            </List>
                        )
                    }
                </Content>
            </Container>
        );
    }
}

