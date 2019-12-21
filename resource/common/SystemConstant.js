import { Dimensions } from 'react-native'
// export const WEB_URL = 'http://vanban.vnio.vn'; //web vnio
export const WEB_URL = 'http://192.168.1.10:8022/'; //local web test
// export const WEB_URL = 'http://222.252.27.60:8022';//remote web test
// export const API_URL = 'http://101.96.76.204:8999'; //api vnio
export const API_URL = 'http://192.168.1.10:8111'; //local api test
// export const API_URL = 'http://222.252.27.60:8111'; //remote api test

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

/**
 * Giá trị độ khẩn
 */
export const DOKHAN_CONSTANT = {
	KHAN: 1,
	THUONG: 2,
	THUONG_KHAN: 3
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
	CHO_XACNHAN: 5,
	CUA_THUKY: 6,
}

//thông báo
export const THONGBAO_CONSTANT = {
	CONGVIEC: 1,
	VANBAN: 2
}

export const DATXE_CONSTANT = {
	DATXE_STATUS: {
		MOI_TAO: 1,
		DA_GUI: 2,
		DA_HUY: 3,
		DA_TIEP_NHAN: 4,
		DANG_THUC_HIEN: 5,
		DA_HOAN_THANH: 6,
	},
	CHUYEN_STATUS: {
		MOI_TAO: 1,
		DANG_CHAY: 2,
		DA_HOAN_THANH: 3
	}
}

export const LICHTRUC_CONSTANT = {
	CHUYEN_MON: "LT_LICHTRUC_CHUYENMON",
	KHAM_CHUA_BENH: "LT_LICHKHAM_CHUABENH",
	STATUS: {
		BAN_THAO: 1,
		DA_PHE_DUYET: 3
	}
}

//colors
export const Colors = {
	WHITE: '#fff',
	/**
	 * Text bình thường
	 */
	BLACK: '#000',
	/**
	 * Text chưa đọc
	 */
	NOT_READ: '#0078d4',
	/**
	 * Text đã xử lý
	 */
	HAS_DONE: '#888',
	RED: '#f00',
	GRAY: '#bdc6cf',
	DARK_GRAY: '#96a2ad',
	/**
	 * Màu icon inactive
	 */
	DANK_GRAY: '#858585',
	VERY_DANK_GRAY: '#2F2F2F',
	CLOUDS: '#ecf0f1',
	GREEN_PANTON_376C: '#7DBA00',
	GREEN_PANTON_369C: '#4FA800',
	GREEN_PANTONE_364C: '#337321',
	BLUE_PANTONE_640C: '#0082ba', //00aeef 007cc2
	RED_PANTONE_186C: '#FF0033',
	RED_PANTONE_021C: '#FF6600',
	DANK_BLUE: '#007cc2',
	/**
	 * Màu header, icon active, action
	 */
	LITE_BLUE: '#1769b3', //00aeef
	OLD_LITE_BLUE: '#00aeef',
	LIGHT_GRAY_PASTEL: '#f4f3f3',
	MENU_BLUE: '#0078d4',

	RANDOM_COLOR_1: '#ad6b16',
	RANDOM_COLOR_2: '#1ab41a'
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
			'PROCESSED_JOB',
			'CONGVIEC_THEOCHIDAO'
		]
	},

	TienichFunction: {
		code: 'HSCV_TIENICH',
		actionCodes: [
			'DS_YEUCAU_XE',
			'DS_CHUYEN',
			'DS_LICHHOP',
			'DS_UYQUYEN',
			'DS_LICHTRUC',
			'DS_NHACNHO',
			'KHAC',
			'DS_LICHTRUC_CANHAN',
		]
	},
	LichCongTacFunction: {
		code: 'LICHCONGTAC_LANHDAO',
		actionCodes: [
			'QL_LICHCONGTAC_LD',
		]
	},
	UyQuyenFunction: {
		code: 'QUANLY_UYQUYEN',
		actionCodes: [
			'DANHSACH_UYQUYEN',
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
		},
		_THEOCHIDAO: {
			NAME: 'CONGVIEC_THEOCHIDAO',
			MOBILENAME: 'THEO CHỈ ĐẠO'
		},
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
	},
	TIENICH: {
		_DS_YEUCAU_XE: {
			NAME: 'DS_YEUCAU_XE',
			MOBILENAME: 'Lịch trình xe'
		},
		_DS_CHUYEN: {
			NAME: 'DS_CHUYEN',
			MOBILENAME: 'Chuyến xe'
		},
		_DS_LICHHOP: {
			NAME: 'DS_LICHHOP',
			MOBILENAME: 'Lịch họp'
		},
		_DS_UYQUYEN: {
			NAME: 'DS_UYQUYEN',
			MOBILENAME: 'Uỷ quyền'
		},
		_DS_LICHTRUC: {
			NAME: 'DS_LICHTRUC',
			MOBILENAME: 'Lịch trực - Lịch PK'
		},
		_DS_NHACNHO: {
			NAME: 'DS_NHACNHO',
			MOBILENAME: 'Nhắc việc'
		},
		_KHAC: {
			NAME: 'KHAC',
			MOBILENAME: 'Khác'
		},
		_DS_LICHTRUC_CANHAN: {
			NAME: 'DS_LICHTRUC_CANHAN',
			MOBILENAME: 'Lịch trực cá nhân'
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

export const SEPERATOR_STRING = '-HINETVNIO-';
export const SEPERATOR_UNDERSCORE = '-';

export const TOAST_DURATION_TIMEOUT = 1000;
export const ASYNC_DELAY_TIMEOUT = 1000;

/**
 * Lấy tên thao tác từ mã
 * @param {string} maThaotac Mã thao tác
 */
export function generateTitle(maThaotac) {
	const { VANBANDEN, VANBANDI, CONGVIEC, LICHCONGTAC_LANHDAO, QUANLY_UYQUYEN, TIENICH } = DM_FUNCTIONS;

	let tenThaotac = VANBANDEN._CHUAXULY.MOBILENAME;
	switch (maThaotac) {
		case VANBANDEN._CHUAXULY.NAME:
			tenThaotac = VANBANDEN._CHUAXULY.MOBILENAME;
			break;
		case VANBANDEN._DAXULY.NAME:
			tenThaotac = VANBANDEN._DAXULY.MOBILENAME;
			break;
		case VANBANDEN._NOIBO_CHUAXULY.NAME:
			tenThaotac = VANBANDEN._NOIBO_CHUAXULY.MOBILENAME;
			break;
		case VANBANDEN._NOIBO_DAXULY.NAME:
			tenThaotac = VANBANDEN._NOIBO_DAXULY.MOBILENAME;
			break;
		case VANBANDEN._THAMGIA_XULY.NAME:
			tenThaotac = VANBANDEN._THAMGIA_XULY.MOBILENAME;
			break;

		case VANBANDI._CHUAXULY.NAME:
			tenThaotac = VANBANDI._CHUAXULY.MOBILENAME;
			break;
		case VANBANDI._DAXULY.NAME:
			tenThaotac = VANBANDI._DAXULY.MOBILENAME;
			break;
		case VANBANDI._DA_BANHANH.NAME:
			tenThaotac = VANBANDI._DA_BANHANH.MOBILENAME;
			break;
		case VANBANDI._THAMGIA_XULY.NAME:
			tenThaotac = VANBANDI._THAMGIA_XULY.MOBILENAME;
			break;

		case CONGVIEC._CANHAN.NAME:
			tenThaotac = CONGVIEC._CANHAN.MOBILENAME;
			break;
		case CONGVIEC._DUOCGIAO.NAME:
			tenThaotac = CONGVIEC._DUOCGIAO.MOBILENAME;
			break;
		case CONGVIEC._PHOIHOPXULY.NAME:
			tenThaotac = CONGVIEC._PHOIHOPXULY.MOBILENAME;
			break;
		case CONGVIEC._PROCESSED_JOB.NAME:
			tenThaotac = CONGVIEC._PROCESSED_JOB.MOBILENAME;
			break;
		case CONGVIEC._THEOCHIDAO.NAME:
			tenThaotac = CONGVIEC._THEOCHIDAO.MOBILENAME;
			break;

		case TIENICH._DS_YEUCAU_XE.NAME:
			tenThaotac = TIENICH._DS_YEUCAU_XE.MOBILENAME;
			break;
		case TIENICH._DS_CHUYEN.NAME:
			tenThaotac = TIENICH._DS_CHUYEN.MOBILENAME;
			break;
		case TIENICH._DS_LICHHOP.NAME:
			tenThaotac = TIENICH._DS_LICHHOP.MOBILENAME;
			break;
		case TIENICH._DS_UYQUYEN.NAME:
			tenThaotac = TIENICH._DS_UYQUYEN.MOBILENAME;
			break;
		case TIENICH._DS_LICHTRUC.NAME:
			tenThaotac = TIENICH._DS_LICHTRUC.MOBILENAME;
			break;
		case TIENICH._DS_NHACNHO.NAME:
			tenThaotac = TIENICH._DS_NHACNHO.MOBILENAME;
			break;
		case TIENICH._KHAC.NAME:
			tenThaotac = TIENICH._KHAC.MOBILENAME;
			break;
		case TIENICH._DS_LICHTRUC_CANHAN.NAME:
			tenThaotac = TIENICH._DS_LICHTRUC_CANHAN.MOBILENAME;
			break;
		case LICHCONGTAC_LANHDAO._DANHSACH.NAME:
			tenThaotac = LICHCONGTAC_LANHDAO._DANHSACH.MOBILENAME;
			break;

		case QUANLY_UYQUYEN._DANHSACH.NAME:
			tenThaotac = QUANLY_UYQUYEN._DANHSACH.MOBILENAME;
			break;
		default:
			break;
	}
	return tenThaotac.charAt(0).toUpperCase() + tenThaotac.slice(1).toLowerCase();
}

export const EMAIL_VALIDATION = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASSWD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}$/;