/**
 * @description: thông tin chính văn bản trình ký
 * @author: duynn
 * @since: 04/05/2018
 */
import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'

//lib
import { List, ListItem, Icon } from 'react-native-elements'
import _ from 'lodash';
import HTMLView from 'react-native-htmlview';
//styles
import { DetailSignDocStyle } from '../../../assets/styles/SignDocStyle';
//common
import { convertDateToString, asyncDelay, formatLongText, extention, convertTimeToString, onDownloadFile } from '../../../common/Utilities';
import { Colors, API_URL } from '../../../common/SystemConstant';
import { getFileExtensionLogo, getFileSize } from '../../../common/Effect';
import { verticalScale } from '../../../assets/styles/ScaleIndicator';

export default class MainInfoSignDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.info.VanBanTrinhKy,
            userId: props.userId,
            docInfo: null,
            fromBrief: props.fromBrief,
            ListTaiLieu: null
        }
    }

    componentWillMount() {
        const { VANBANDEN_ID } = this.props.info.VanBanTrinhKy;
        if (VANBANDEN_ID !== null) {
            this.fetchData(VANBANDEN_ID);
        }
        this.fetchAttachment();
    }

    fetchData = async (docId) => {
        const url = `${API_URL}/api/VanBanDen/GetDetail/${docId}/${this.state.userId}/0`;

        const result = await fetch(url);
        const resultJson = await result.json();

        await asyncDelay();

        this.setState({
            docInfo: resultJson,
        });
    }
    fetchAttachment = async () => {
        const url = `${API_URL}/api/VanBanDi/SearchAttachment?id=${this.state.info.ID}&attQuery=`;
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
            ListTaiLieu: resultJson
        });
    }

    getDetailDoc = (screenName, targetScreenParams) => {
        if (!this.state.fromBrief) {
            this.props.navigateToDetailDoc(screenName, targetScreenParams);
        }
    }

    render() {
        let relateDoc;
        if (this.state.docInfo && this.state.docInfo.hasOwnProperty("entityVanBanDen")) {
            const { SOHIEU, TRICHYEU, NGUOIKY, ID } = this.state.docInfo.entityVanBanDen;
            relateDoc = (
                <ListItem
                    style={DetailSignDocStyle.listItemContainer}
                    hideChevron={true}
                    title={
                        <Text style={DetailSignDocStyle.listItemTitleContainer}>
                            Văn bản đến liên quan
                        </Text>
                    }
                    subtitle={
                        <Text style={[DetailSignDocStyle.listItemSubTitleContainer, { color: this.state.fromBrief ? '#777' : '#262626' }]}>
                            <Text>{`Số hiệu: ${SOHIEU}` + "\n"}</Text>
                            <Text>{`Trích yếu: ${formatLongText(TRICHYEU, 50)}` + "\n"}</Text>
                            <Text>{`Người ký: ${NGUOIKY}`}</Text>
                        </Text>
                    }
                    onPress={
                        () => this.getDetailDoc("VanBanDenDetailScreen", { docId: ID, docType: 1, from: 'detail' })
                    }
                    containerStyle={{ backgroundColor: !this.state.fromBrief ? 'rgba(189,198,207, 0.6)' : Colors.WHITE }}
                />
            );
        }
        return (
            <View style={DetailSignDocStyle.container}>
                <ScrollView>
                    <List containerStyle={DetailSignDocStyle.listContainer}>
                        {
                            this.state.docInfo && relateDoc
                        }

                        {
                            this.state.ListTaiLieu && this.state.ListTaiLieu.length > 0
                                ? <ListItem style={DetailSignDocStyle.listItemContainer}
                                    hideChevron={true}
                                    title={
                                        <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                            Đính kèm
                                        </Text>
                                    }
                                    subtitle={
                                        <View>
                                            {
                                                this.state.ListTaiLieu.map((item, index) => {
                                                    let regExtension = extention(item.DUONGDAN_FILE);
                                                    let extension = regExtension ? regExtension[0] : "";
                                                    return <ListItem
                                                        key={index.toString()}
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
                                                            <Icon name='download' color={Colors.GREEN_PANTON_369C} size={verticalScale(25)} type='entypo' />
                                                        }
                                                        containerStyle={{ borderBottomWidth: 0 }}
                                                        onPress={() => onDownloadFile(item.TENTAILIEU, item.DUONGDAN_FILE, item.DINHDANG_FILE)}
                                                    />
                                                })
                                            }
                                        </View>
                                    } />
                                : null
                        }

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    Trích yếu
                            </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.TRICHYEU}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    Loại văn bản
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.STR_LOAIVANBAN}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    Lĩnh vực
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.STR_LINHVUCVANBAN}
                                </Text>
                            } />

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    Mức độ quan trọng
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.props.info.STR_DOKHAN}
                                </Text>
                            } />



                        {
                            this.state.info.NGAYVANBAN && <ListItem style={DetailSignDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                        Ngày văn bản
                                    </Text>
                                }
                                subtitle={
                                    <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                        {convertDateToString(this.state.info.NGAYVANBAN)}
                                    </Text>
                                } />
                        }

                        {
                            this.state.info.NGAYBANHANH && <ListItem style={DetailSignDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                        Ngày ban hành
                                    </Text>
                                }
                                subtitle={
                                    <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                        {convertDateToString(this.state.info.NGAYBANHANH)}
                                    </Text>
                                } />
                        }

                        {
                            this.state.info.NGAYCOHIEULUC && <ListItem style={DetailSignDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                        Ngày hiệu lực
                                </Text>
                                }
                                subtitle={
                                    <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                        {convertDateToString(this.state.info.NGAYCOHIEULUC)}
                                    </Text>
                                } />
                        }

                        {
                            this.state.info.NGAYHETHIEULUC && <ListItem style={DetailSignDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                        Ngày hết hiệu lực
                                </Text>
                                }
                                subtitle={
                                    <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                        {convertDateToString(this.state.info.NGAYHETHIEULUC)}
                                    </Text>
                                } />
                        }

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    Số bản
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {this.state.info.SOBANSAO || 'N/A'}
                                </Text>
                            } />

                        {
                            !!this.props.info.STR_NGUOIKY && <ListItem style={DetailSignDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                        Người ký
                                    </Text>
                                }
                                subtitle={
                                    <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                        {`${this.state.info.CHUCVU || ""} ${this.props.info.STR_NGUOIKY}`}
                                    </Text>
                                } />
                        }

                        {
                            !!this.state.info.NOIDUNG && <ListItem style={DetailSignDocStyle.listItemContainer}
                                hideChevron={true}
                                title={
                                    <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                        Nội dung văn bản
                                </Text>
                                }
                                subtitle={
                                    <HTMLView
                                        value={this.state.info.NOIDUNG}
                                        stylesheet={{ p: DetailSignDocStyle.listItemSubTitleContainer }}
                                    />
                                } />
                        }

                        <ListItem style={DetailSignDocStyle.listItemContainer}
                            hideChevron={true}
                            title={
                                <Text style={DetailSignDocStyle.listItemTitleContainer}>
                                    Ngày tạo
                                </Text>
                            }
                            subtitle={
                                <Text style={DetailSignDocStyle.listItemSubTitleContainer}>
                                    {convertDateToString(this.state.info.CREATED_AT)}
                                </Text>
                            } />

                    </List>
                </ScrollView>
            </View>
        );
    }
}