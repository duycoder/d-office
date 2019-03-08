/**
 * @description: tài liệu đính kèm văn bản đến
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react';
import {
    Alert, ActivityIndicator, FlatList, TouchableOpacity, Platform,
    PermissionsAndroid
} from 'react-native';

//lib
import { Container, Content, Header, Item, Icon, Input } from 'native-base';
import { List, ListItem, Icon as RneIcon } from 'react-native-elements';
import RNFetchBlob from 'rn-fetch-blob'
import OpenFile from 'react-native-doc-viewer';

//styles
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';

//utilities
import renderIf from 'render-if';
import { API_URL, WEB_URL, EMPTY_STRING, LOADER_COLOR, Colors } from '../../../common/SystemConstant';
import { asyncDelay, isImage, emptyDataPage, convertDateToString, convertTimeToString } from '../../../common/Utilities';
import { verticalScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';
import { getFileExtensionLogo, getFileSize } from '../../../common/Effect';
export default class AttachPublishDoc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            VB_ID: props.docId,
            ListTaiLieu: props.info,
            filterValue: EMPTY_STRING,
            searching: false
        }
    }

    async onFilter() {
        this.setState({
            searching: true
        });

        const url = `${API_URL}/api/VanBanDen/SearchAttachment?id=${this.state.VB_ID}&attQuery=${this.state.filterValue}`;
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        });

        const result = await fetch(url, {
            method: 'POST',
            headers
        });

        const resultJson = await result.json();

        await asyncDelay(1000);

        this.setState({
            searching: false,
            ListTaiLieu: resultJson
        });
    }

    async onDownloadFile(fileName, fileLink, fileExtension) {
        //config save path
        fileLink = fileLink.replace(/\\/, '');
        fileLink = fileLink.replace(/\\/g, '/');
        let date = new Date();
        let url = `${WEB_URL}/Uploads/${fileLink}`;
        // url = url.replace('\\', '/');
        // url = url.replace(/\\/g, '/');
        url = url.replace(/ /g, "%20");
        let regExtension = this.extention(url);
        let extension = "." + regExtension[0];
        const { config, fs } = RNFetchBlob;
        let { PictureDir, DocumentDir } = fs.dirs;

        let savePath = (Platform.OS === 'android' ? PictureDir : DocumentDir) + "/vnio_" + Math.floor(date.getTime() + date.getSeconds() / 2) + extension;

        let options = {};
        let isAllowDownload = true;
        if (Platform.OS == 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'CẤP QUYỀN TRUY CẬP CHO ỨNG DỤNG',
                    message:
                        'Ebiz Office muốn truy cập vào tài liệu của bạn',
                    buttonNeutral: 'Để sau',
                    buttonNegative: 'Thoát',
                    buttonPositive: 'OK',
                },
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                options = {
                    fileCache: true,
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        path: savePath,
                        description: 'VNIO FILE'
                    }
                }
            } else {
                isAllowDownload = false;
            }
        } else {
            options = {
                fileCache: true,
                path: savePath
            }
        }

        if (isAllowDownload) {
            config(options).fetch('GET', url).then((res) => {
                if (res.respInfo.status === 404) {
                    Alert.alert(
                        'THÔNG BÁO',
                        'KHÔNG TÌM THẤY TÀI LIỆU',
                        [
                            {
                                text: "ĐÓNG",
                                onPress: () => { }
                            }
                        ]
                    );
                } else {
                    Alert.alert(
                        'THÔNG BÁO',
                        `DOWN LOAD THÀNH CÔNG`,
                        [
                            {
                                text: 'MỞ FILE',
                                onPress: () => {
                                    let openDocConfig = {};

                                    if (Platform.OS == 'android') {
                                        openDocConfig = {
                                            url: `file://${res.path()}`,
                                            fileName: fileName,
                                            cache: false,
                                            fileType: regExtension[0]
                                        }
                                    } else {
                                        openDocConfig = {
                                            url: savePath,
                                            fileNameOptional: fileName
                                        }
                                    }

                                    OpenFile.openDoc([openDocConfig], (error, url) => {
                                        if (error) {
                                            Alert.alert(
                                                'THÔNG BÁO',
                                                error.toString(),
                                                [
                                                    {
                                                        text: 'OK',
                                                        onPress: () => { }
                                                    }
                                                ]
                                            )
                                        } else {
                                            console.log(url)
                                        }
                                    })
                                }
                            },
                            {
                                text: 'ĐÓNG',
                                onPress: () => { }
                            }
                        ]
                    );
                }
            }).catch((err) => {
                Alert.alert(
                    'THÔNG BÁO',
                    'DOWNLOAD THẤT BẠI',
                    [
                        {
                            text: err.toString(),
                            onPress: () => { }
                        }
                    ]
                )
            })
        }
    }

    extention(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    renderItem = ({ item }) => {
        let regExtension = this.extention(item.DUONGDAN_FILE);
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
            onPress={() => this.onDownloadFile(item.TENTAILIEU, item.DUONGDAN_FILE, item.DINHDANG_FILE)}
        />
    }

    render() {
        return (
            <Container>
                <Header searchBar style={{ backgroundColor: Colors.WHITE }}>
                    <Item style={{ backgroundColor: Colors.WHITE }}>
                        <Icon name='ios-search' />
                        <Input placeholder='Tên tài liệu'
                            value={this.state.filterValue}
                            onChangeText={(filterValue) => this.setState({ filterValue })}
                            onSubmitEditing={() => this.onFilter()} />
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
                            <List containerStyle={DetailSignDocStyle.listContainer}>
                                <FlatList
                                    data={this.state.ListTaiLieu}
                                    renderItem={this.renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    ListEmptyComponent={() =>
                                        emptyDataPage()
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