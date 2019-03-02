/**
 * @description: tài liệu đính kèm văn bản trình ký
 * @author: duynn
 * @since: 04/05/2018
 */
'use strict'
import React, { Component } from 'react';
import { Alert, ActivityIndicator, FlatList, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';

//lib
import { Container, Content, Header, Item, Icon, Input } from 'native-base';
import { List, ListItem, Icon as RneIcon } from 'react-native-elements';
import RNFetchBlob from 'rn-fetch-blob';
import OpenFile from 'react-native-doc-viewer';

//styles
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';

//utilities
import renderIf from 'render-if';
import { API_URL, WEB_URL, EMPTY_STRING, LOADER_COLOR, Colors } from '../../../common/SystemConstant';
import { asyncDelay, isImage, emptyDataPage } from '../../../common/Utilities';
import { verticalScale, indicatorResponsive } from '../../../assets/styles/ScaleIndicator';

export default class AttachSignDoc extends Component {
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

        const url = `${API_URL}/api/VanBanDi/SearchAttachment?id=${this.state.VB_ID}&attQuery=${this.state.filterValue}`;
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
        if (Platform.OS = 'android') {
            try {
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
                    var date = new Date();
                    var url = `${WEB_URL}//Uploads//${fileLink}`;
                    url = url.replace('\\', '/');
                    var ext = this.extention(url);
                    ext = "." + ext[0];
                    const { config, fs } = RNFetchBlob
                    let PictureDir = fs.dirs.PictureDir
                    let options = {
                        fileCache: true,
                        addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: true,
                            path: PictureDir + "/image_" + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
                            description: 'Image'
                        }
                    }
                    config(options).fetch('GET', url).then((res) => {
                        Alert.alert(
                            'THÔNG BÁO',
                            `DOWN LOAD THÀNH CÔNG`,
                            [
                                {
                                    text: 'OK',
                                    onPress: () => { }
                                }
                            ]
                        )
                    }).catch(()=> {
                        Alert.alert(
                            'THÔNG BÁO',
                            'DOWNLOAD THẤT BẠI',
                            [
                                {
                                    text: err,
                                    onPress: () => { }
                                }
                            ]
                        )
                    })
                } else {
                    Alert.alert(
                        'CẤP QUYỀN TRUY CẬP CHO ỨNG DỤNG',
                        'Ebiz Office không có quyền truy cập',
                        [
                            {
                                text: 'OK',
                                onPress: () => { }
                            }
                        ]
                    )
                }
            } catch (err) {
                Alert.alert({
                    'title': 'THÔNG BÁO',
                    'message': `Lỗi: ${err.toString()}`,
                    buttons: [
                        {
                            text: 'OK',
                            onPress: () => { }
                        }
                    ]
                })
            }
        }else{
            try {
                fileLink = WEB_URL + '/Uploads' + fileLink;
                fileLink = fileLink.replace(/\\/g, '/');
                fileLink = fileLink.replace(/ /g, "%20");
    
                const config = {
                    fileCache: true,
                    // android only options, these options be a no-op on IOS
                    addAndroidDownloads: {
                        notification: true, // Show notification when response data transmitted
                        title: fileName, // Title of download notification
                        description: 'An image file.', // File description (not notification description)
                        mime: fileExtension,
                        mediaScannable: true, // Make the file scannable  by media scanner
                    }
                }
                let dirs = RNFetchBlob.fs.dirs.DocumentDir
                let savedName = fileLink.split("/").pop()
                let savedPath = `${dirs}/${savedName}`
                if (Platform.OS == 'ios') {
                    config = {
                        fileCache: true,
                        // appendExt: 'png',
                        path: `${dirs}/${savedName}`
                    }
                }
    
                RNFetchBlob.fs.exists(savedPath)
                    .then(existStatus => {
                        if (existStatus) {
                            // console.tron.log("File da ton tai")
                            OpenFile.openDoc([{
                                url: savedPath,
                                fileNameOptional: fileName
                            }], (error, url) => {
                                if (error) {
                                    console.log(error)
                                } else {
                                    console.log(url)
                                }
                            })
                        }
                        else {
                            RNFetchBlob.config(config)
                                .fetch('GET', fileLink)
                                .then((response) => {
                                    //kiểm tra platform nếu là android và file là ảnh
                                    if (Platform.OS == 'android' && isImage(fileExtension)) {
                                        android.actionViewIntent(response.path(), fileExtension);
                                    }
                                    // console.tron.log(response.path())
    
                                    Alert.alert(
                                        'THÔNG BÁO',
                                        'TẢI FILE THÀNH CÔNG',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => { }
                                            }
                                        ]
                                    )
                                }).catch((err) => {
                                    Alert.alert(
                                        'THÔNG BÁO',
                                        'KHÔNG THỂ TẢI ĐƯỢC FILE',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => { }
                                            }
                                        ]
                                    )
                                });
                        }
                    }).catch(err => console.log(err))
            } catch (err) {
                Alert.alert({
                    'title': 'THÔNG BÁO',
                    'message': `Lỗi: ${err.toString()}`,
                    buttons: [
                        {
                            text: 'OK',
                            onPress: () => { }
                        }
                    ]
                })
            }
        }
    }

    extention(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    renderItem = ({ item }) => (
        <ListItem
            rightIcon={
                <TouchableOpacity onPress={() => this.onDownloadFile(item.TENTAILIEU, item.DUONGDAN_FILE, item.DINHDANG_FILE)}>
                    <RneIcon name='download' color={Colors.GREEN_PANTON_369C} size={verticalScale(25)} type='entypo' />
                </TouchableOpacity>
            }
            title={item.TENTAILIEU}
            titleStyle={{
                color: Colors.BLACK,
                fontWeight: 'bold'
            }} />
    )

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