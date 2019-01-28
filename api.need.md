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