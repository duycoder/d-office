import { Dimensions } from 'react-native'
export const WEB_URL = 'http://vanban.vnio.vn'
// export const API_URL = 'http://192.168.1.29:8098';
export const API_URL = 'http://101.96.76.204:8999';
// export const API_URL = 'http://123.30.149.48:8099';
// export const API_URL = 'http://192.168.1.7:8098';

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

export const VANBANDI_CONSTANT = {
	CHUA_XULY: 1,
	DA_XULY: 2,
	THAMGIA_XULY: 3,
	DA_BANHANH: 4,
}

export const VANBANDEN_CONSTANT = {
	CHUA_XULY: 1,
	DA_XULY: 2,
	THAMGIA_XULY: 3,
	NOIBO_DAXULY: 4,
	NOIBO_CHUAXULY: 5
}

export const CONGVIEC_CONSTANT = {
	CA_NHAN: 1,
	DUOC_GIAO: 2,
	PHOIHOP_XULY: 3,
	DAGIAO_XULY: 4,
	CHO_XACNHAN: 5
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
	GRAY: '#bdc6cf', DARK_GRAY: '#96a2ad',
	CLOUDS: '#ecf0f1',
	GREEN_PANTON_376C: '#7DBA00',
	GREEN_PANTON_369C: '#4FA800',
	GREEN_PANTONE_364C: '#337321',
	BLUE_PANTONE_640C: '#0082ba', //00aeef 007cc2
	RED_PANTONE_186C: '#FF0033',
	RED_PANTONE_021C: '#FF6600',
	DANK_BLUE: '#007cc2',
	LITE_BLUE: '#00aeef'
}

export const BASEDOCSEARCH_CONSTANT = {
	NGUOI_KY: 1,
	LINHVUC_DONVI: 2,
	DO_QUANTRONG: 3,
	THOI_GIAN: 4
}

export const SYSTEM_FUNCTION = {
	VanBanDenFunction: {
		code: 'HSCV_VANBANDEN',
		actionCodes: [
			'HSCV_VANBANDEN_CHUAXULY',
			'HSCV_VANBANDEN_NOIBO_CHUAXULY',
			'HSCV_VANBANDEN_THAMGIA_XULY',
			'HSCV_VANBANDEN_DAXULY',
			'HSCV_VANBANDEN_NOIBO_DAXULY'
		]
	},

	VanBanDiFunction: {
		code: 'HSCV_VANBANDI',
		actionCodes: [
			'VANBANDI_CHUAXULY',
			'VANBANDI_THAMGIA_XULY',
			'VANBANDI_DAXULY',
			'VANBANDI_DA_BANHANH'
		]
	},

	CongViecFunction: {
		code: 'HSCV_CONGVIEC',
		actionCodes: [
			'CONGVIEC_CANHAN',
			'CONGVIEC_DUOCGIAO',
			'CONGVIEC_PHOIHOPXULY',
			'PROCESSED_JOB'
		]
	},
	LichCongTacFunction:{
		code: 'LICHCONGTAC_LANHDAO',
		actionCodes: [
			'QL_LICHCONGTAC_LD',
		]
	},
	UyQuyenFunction:{
		code: 'QUANLY_UYQUYEN',
		actionCodes: [
			'QL_UYQUYEN_LD',
		]
	}
}

export const SIDEBAR_CODES = {
	THONGBAO: {
		code: 'NOTIFICATION'
	},
	TAIKHOAN: {
		code: 'ACCOUNT',
		actionCodes: [
			'ACCOUNT_INFO',
			'CHANGE_PASSWORD'
		]
	},
	DANGXUAT: {
		code: 'SIGN_OUT'
	},
	CHEVRON: {
		right: 'CHEVRON-RIGHT',
		down: 'CHEVRON-DOWN'
	}
}

export const DM_FUNCTIONS = {
	VANBANDEN: {
		_CHUAXULY: {
			NAME: 'HSCV_VANBANDEN_CHUAXULY',
			IDTHAOTAC: 26,
			MOBILENAME: 'CHƯA XỬ LÝ'
		},
		_NOIBO_CHUAXULY: {
			NAME: 'HSCV_VANBANDEN_NOIBO_CHUAXULY',
			IDTHAOTAC: 55,
			MOBILENAME: 'NỘI BỘ CHƯA XỬ LÝ'
		},
		_THAMGIA_XULY: {
			NAME: 'HSCV_VANBANDEN_THAMGIA_XULY',
			IDTHAOTAC: 27,
			MOBILENAME: 'THAM GIA XỬ LÝ'
		},
		_DAXULY: {
			NAME: 'HSCV_VANBANDEN_DAXULY',
			IDTHAOTAC: 25,
			MOBILENAME: 'ĐÃ XỬ LÝ'
		},
		_NOIBO_DAXULY: {
			NAME: 'HSCV_VANBANDEN_NOIBO_DAXULY',
			IDTHAOTAC: 56,
			MOBILENAME: 'NỘI BỘ ĐÃ XỬ LÝ'
		},
	},

	VANBANDI: {
		_CHUAXULY: {
			NAME: 'VANBANDI_CHUAXULY',
			IDTHAOTAC: 35,
			MOBILENAME: 'CHƯA XỬ LÝ'
		},
		_THAMGIA_XULY: {
			NAME: 'VANBANDI_THAMGIA_XULY',
			IDTHAOTAC: 49,
			MOBILENAME: 'THAM GIA XỬ LÝ'
		},
		_DAXULY: {
			NAME: 'VANBANDI_DAXULY',
			IDTHAOTAC: 36,
			MOBILENAME: 'ĐÃ XỬ LÝ'
		},
		_DA_BANHANH: {
			NAME: 'VANBANDI_DA_BANHANH',
			IDTHAOTAC: 92,
			MOBILENAME: 'ĐÃ BAN HÀNH'
		}
	},

	CONGVIEC: {
		_CANHAN: {
			NAME: 'CONGVIEC_CANHAN',
			IDTHAOTAC: 42,
			MOBILENAME: 'CÁ NHÂN'
		},
		_DUOCGIAO: {
			NAME: 'CONGVIEC_DUOCGIAO',
			IDTHAOTAC: 41,
			MOBILENAME: 'ĐƯỢC GIAO'
		},
		_PHOIHOPXULY: {
			NAME: 'CONGVIEC_PHOIHOPXULY',
			IDTHAOTAC: 40,
			MOBILENAME: 'PHỐI HỢP XỬ LÝ'
		},
		_PROCESSED_JOB: {
			NAME: 'PROCESSED_JOB',
			IDTHAOTAC: 46,
			MOBILENAME: 'CHỜ XÁC NHẬN'
		}
	},
	LICHCONGTAC_LANHDAO: {
		_DANHSACH: {
			NAME: 'QL_LICHCONGTAC_LD',
			IDTHAOTAC: 106,
			MOBILENAME: 'LỊCH CÔNG TÁC'
		}
	},

	QUANLY_UYQUYEN: {
		_DANHSACH: {
			NAME: 'DANHSACH_UYQUYEN',
			IDTHAOTAC: 108,
			MOBILENAME: 'ỦY QUYỀN'
		}
	}
}

export const BRIEF_CONSTANT = {
	_DANHSACHCONGVIEC: 'DANHSACH_CONGVIEC',
	_VANBANPHANHOI: 'VANBANPHANHOI'
}

export const MODULE_CONSTANT = {
	MD_VANBANTRINHKY: 'MD_VANBANTRINHKY',
}