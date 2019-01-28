import React, { Component } from 'react';
import { View, Modal, NetInfo, Text, StyleSheet } from 'react-native';

//lib + redux
import { connect } from 'react-redux';
import * as networkAction from '../../redux/modules/network/Action';
import { Header, Icon } from 'react-native-elements';

//constant
import { Colors } from '../../common/SystemConstant';

//styles
import { scale, verticalScale, moderateScale } from '../../assets/styles/ScaleIndicator';

class NetworkStatus extends Component {
    constructor(props) {
        super(props);
    }

    handleNetInfo = (isConnected) => {
        this.props.updateNetworkStatus(isConnected);
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleNetInfo);
    }

    componentWillUnMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleNetInfo);
    }

    render() {
        return (
            <Modal animationType='slide'
                visible={!this.props.isConnected}
                transparent={true}
                onRequestClose={() => console.log('Đã đóng')}>
                <View style={styles.container}>
                    <View style={styles.body}>
                        <Header
                            leftComponent={
                                <Icon name='signal-wifi-off' type='MaterialIcons'
                                    size={moderateScale(40)} color={Colors.WHITE} />
                            }
                            outerContainerStyle={styles.headerOuter}
                            centerComponent={
                                <Text style={styles.headerTitle}>
                                    THÔNG BÁO NGOẠI TUYẾN
                                </Text>
                            }
                        />

                        <View style={styles.content}>
                            <Text style={styles.bodyTitle}>
                                Thiết bị hiện đang ở trạng thái ngoại tuyến! 
                                Vui lòng kiểm tra lại kết nối của bạn.
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
    }, body: {
        borderRadius: 15,
        width: scale(300),
        height: verticalScale(200),
        borderRadius: 3,
        backgroundColor: Colors.WHITE,
    }, headerOuter: {
        backgroundColor: Colors.BLUE_PANTONE_640C,
        height: verticalScale(50),
        width: '100%',
        borderRadius: 15
    }, headerTitle: {
        color: Colors.WHITE,
        fontWeight: 'bold',
        fontSize: moderateScale(16)
    }, bodyTitle: {
        color: Colors.BLACK,
        fontSize: moderateScale(15),
        textAlign: 'center'
    }, content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    }
})

const mapStateToProps = (state) => {
    return {
        isConnected: state.networkState.isConnected
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateNetworkStatus: (isConnected) => dispatch(networkAction.updateNetworkStatus(isConnected))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NetworkStatus);