# d-office
quản lý điều hành văn bản

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