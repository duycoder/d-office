import { Dimensions } from'react-native'
export const WEB_URL = 'http://103.1.210.108';
export const API_URL = 'http://103.1.210.108:81';
 
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE_INDEX = 1;

export const EMPTY_STRING = '';

export const EMTPY_DATA_MESSAGE = 'KHÔNG CÓ DỮ LIỆU';
export const EMPTY_DATA_ICON_URI = require('../assets/images/empty_data.png');
export const SAD_FACE_ICON_URI = require('../assets/images/error.png');

export const { width, height } = Dimensions.get('window');

export const HEADER_COLOR = '#FF0033'
export const SUB_HEADER_COLOR = '#F7A30A';
export const SEARCHBAR_COLOR = '#FCC954';

export const LOADER_COLOR = '#0082ba';

export const LOADMORE_COLOR = '#0082ba';

export const PLANJOB_CONSTANT = {
	CHUALAPKEHOACH: 0,
    CHUATRINHKEHOACH: 1,
    DATRINHKEHOACH: 2,
    DAPHEDUYETKEHOACH: 3,
    LAPLAIKEHOACH: 4
}

export const WORKFLOW_PROCESS_TYPE = {
	MAIN_PROCESS: 1,
	JOIN_PROCESS: 2, 
	ALL_PROCESS: 3
}

export const TASK_PROCESS_TYPE = {
	MAIN_PROCESS: 1,
	JOIN_PROCESS: 2,
	ALL_PROCESS: 3
}

export const DOKHAN_CONSTANT = {
	KHAN: 98,
	THUONG: 99,
	THUONG_KHAN: 100
}

export const VANBAN_CONSTANT = {
	CHUA_XULY: 1,
	DA_XULY: 2,
	CAN_REVIEW: 3,
	DA_REVIEW: 4,
}

export const CONGVIEC_CONSTANT = {
	CA_NHAN: 1,
	DUOC_GIAO: 2,
	PHOIHOP_XULY: 3,
	DAGIAO_XULY: 4
}

//thông báo
export const THONGBAO_CONSTANT = {
	CONGVIEC: 1,
	VANBAN: 2
}

//colors
export const Colors = {
	WHITE: '#fff',
	BLACK: '#000',
	RED: '#f00',
	GRAY: '#bdc6cf',
	CLOUDS: '#ecf0f1',
	GREEN_PANTON_376C: '#7DBA00',
	GREEN_PANTON_369C: '#4FA800',
	GREEN_PANTONE_364C: '#337321',
	BLUE_PANTONE_640C: '#0082ba',
	RED_PANTONE_186C: '#FF0033',
	RED_PANTONE_021C: '#FF6600'
}