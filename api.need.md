# This file contains what API we need

## API Form
* Verb (GET/POST/PUT)
* pseudo code
  * params
  * return
* all var must have type

Example
```
GET
func sendMessage (message: string) => status: bool
```

## API needing
### For Search
* IncomingDoc (Doc)
GET
func fetchList() => {
  listLinhvucVanban: [],
  listLoaiVanban: [],
  listDonviBanhanh: [],
  listSoVanban: []
}
* SignDoc
GET
func fetchList(userID: number) => {
  listLinhvucVanban: [],
  listLoaiVanban: [],
  listNguoiKy: []
}

GET
func onAdvancedSearch(modelSearch: object) => {
  data: [],
  status: bool,
  message: string
}
modelSearch: {} with all params the same as the web form

## API cần sửa
### Văn bản đi
`/api/WorkFlow/SaveFlow` -> khi văn thư trình cho trưởng phòng thì chỉ người tham gia xử lý nhận được văn bản còn người xử lý chính thì không.

### Màn hình chi tiết
`/api/VanBanDi/GetDetail/` -> không có `lstLog` dành cho phần hiển thị lịch sử xử lý 

### Màn hình danh sách
* Những item đã xử lý (ví dụ _đã trình cho trưởng phòng_) -> vẫn xuất hiện trong phần chưa xử lý/ tham gia xử lý