# d-office
quản lý điều hành văn bản

**Ghi chú**: Repo này chỉ hỗ trợ iOS

## Note for Android

Các phiên bản mới của Android yêu cầu có HTTPS trong request (giống như iOS), để có thể dùng được HTTP, hãy thêm dòng sau vào `AndroidManifest.xml` trong thư mục `android/app/src/main/`

```
<application
  ...
  android:usesCleartextTraffic="true" <!-- Dòng này này -->
...>
```

Có thể ký bằng 2 loại khoá

1. Release Key: Key riêng của từng hệ thống
2. Upload Key: Key mà Google chứng nhận bằng chứng thư số

Dùng khoá nào trong 2 cái trên để ký đều được, upload đều nhận. Nhưng nếu dùng Upload Key thì mới gửi được `.aab` thay vì `.apk` (nghe nói là giảm được kích thước xuống).

Nếu muốn update version (phiên bản) mới của một ứng dụng có sẵn trên store, phải kiểm tra kỹ xem dùng Key nào. Nếu không trùng thì không tải được cập nhật, nếu mất thì chỉ có nước xoá bản cũ đi và tải một bản mới cóng lên. Hãy giữ các keystore này thật cẩn thận.

Để kiểm tra key của bản APK hiện tại, dùng câu lệnh sau. Mặc định tên của bản APK được tạo ra sẽ là app_release.

`keytool -list -printcert -jarfile <tên_của_bản_APK>.apk`

## Note for maintainer

_Đây là ghi chú cho maintainer của d-office_

### Cấu trúc thư mục

* `android`, `ios`: thư mục dùng để build/release các phiên bản cho hai nền tảng
* `HDSD`: chứa file HDSD dành cho người dùng cuối
* `native-base-theme`: chứa theme cho toàn bộ ứng dụng (đối với các component thuộc thư viện `native-base`), style một lần tại đây và sử dụng ở khắp nơi
* `node_modules`: chứa các thư viện node để chạy và build chương trình, không chỉnh sửa và cũng đừng đẩy cái này lên bất cứ svn/git nào (nặng nhất repo)
* `resource`: chứa toàn bộ source code của project
  - `assets`: chứa ảnh và style dùng toàn bộ project (lần lượt trong các folder là `images` và `styles`)
  - `common`: chứa các file được dùng đi dùng lại, thường là các method, cần chú ý
    * `Api`: chứa các api gọi lên máy chủ, mọi api được định nghĩa tại đây
    * `Images`: chứa toàn bộ đường dẫn ảnh được sử dụng trong ứng dụng, thêm ảnh mới rồi thì vào đây để đăng ký đường dẫn
    * `Ultilities`: chứa một số phương thức xử lý tự định nghĩa
  - `firebase`: không còn được sử dụng nữa sau khi nâng cấp firebase
  - `redux`: chứa định nghĩa các phương thức và state trong redux
    * `common`: chứa global reduceer và store
    * `modules`: chứa các thành phần redux cho từng chức năng (nếu có)
  - `views`: chứa toàn bộ các file hiển thị cho ứng dụng (màn hình, compoennts)
    * `common`: có thể tái sử dụng
    * `modules`: chứa các màn hình 

Ngoài ra còn một số file thêm, như `package.json` lưu lại các thư viện sử dụng cho project. Đừng bao giờ chỉnh sửa các file ở ngoài nếu chưa biết cách. Nếu cần có thể tra google để biết thêm lý do tại sao có chúng.

### Cách thêm mới màn hình

Để thêm một màn hình mới, nếu là một `module` mới, thì thêm một folder trong `modules`, và thêm một file, ví dụ là `TenManHinh.js`.

Cách viết thì như viết một component bình thường thôi,

```
import React from 'react';

class TenManHinh extends React.Component {
  //Nội dung component
}

export default TenManHinh;
```

Nếu màn hình đó cần sử dụng thêm các thứ trong Redux thì

```
import { connect } from 'react-redux';

// viết ở cuối file

//nếu cần sử dụng lại state
const mapStateToProps = (state) => {
  return {
    currentStateName: state.reduxState.state,
  }
}
//nếu cần sử dụng lại dispatch
const mapDispatchToProps = (dispatch) => {
  return {
    currentMethodName: (params) => dispatch(action.methodToDispatch(params),)
  }
}

//connect với component hiện tại
export default connect(mapStateToProps, mapDispatchToProps)(TenManHinh);

//nếu không dùng lại state hoặc dispatch thì để chỗ đó là null, chẳng hạn
export default connect(null, mapDispatchToProps)(TenManHinh);
```

Sau khi đã code xong, thì gắn màn hình vào Route để ứng dụng điều hướng được tới màn hình đó.

1. Vào ModuleNav
2. Import màn hình vào
3. Thêm một thuộc tính vào `baseStack` theo kiểu như sau:

```
TenManHinhScreen: {
  screen: TenManHinh
},
```

Nếu đó là màn hình liên quan đến luồng Account hoặc Auth thì thêm vào stack tương ứng.
