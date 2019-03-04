/**
 * @description: định dạng style văn bản trình ký
 * @author: duynn
 * @since: 02/05/2018
 */
import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../../common/SystemConstant'
import {scale, verticalScale, moderateScale} from './ScaleIndicator';

export const DetailSignDocStyle = StyleSheet.create({
    container: {
        flex: 1,
    }, 
    listContainer: {
        marginTop: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderBottomColor: '#cbd2d9'
    }, 
    listItemContainer: {
        paddingTop: verticalScale(10),
        paddingRight: scale(10),
        paddingBottom: verticalScale(10),
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5'
    }, listItemTitleContainer: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: moderateScale(12,1.3)
    }, listItemSubTitleContainer: {
        fontSize: moderateScale(12,1.3),
        color: '#777',
        fontWeight: 'normal'
    }, timelineContainer: {
        paddingTop: verticalScale(20),
        flex: 1,
    }, timeContainer: {

    }, time: {
        
    }, commentButtonContainer: {
        justifyContent: 'center',
        flexDirection: 'row'
    }, commentCircleContainer: {
        width: 20,
        height: 20,
        marginLeft: -15,
        backgroundColor: Colors.BLUE_PANTONE_640C,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }, commentCountText: {
        fontSize: 10,
        color: Colors.WHITE,
        fontWeight: 'bold'
    }
});

export const ListSignDocStyle = StyleSheet.create({
    emtpyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyIcon: {
        width: moderateScale(100),
        height: moderateScale(100),
        resizeMode: 'contain'
    },
    emptyMessage: {
        color: '#ccc',
        fontSize: moderateScale(16,1.5),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    leftSide: {
        width: scale(30)
    },
    rightSize: {
        width: scale(30)
    },
    leftIcon: {
        
    },
    abridgment: {
        fontSize: moderateScale(12,1.2),
        flexWrap: 'wrap'
    },
    textNormal: {
        color: '#000'
    },
    textRead: {
        color: '#888'
    },
    loadMoreButton: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center',
        padding: moderateScale(10),
        backgroundColor: 'red',
    }, loadMoreButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});

