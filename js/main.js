//phân rã lớp đối tượng
/**
 * Staff:
 *
 * 1. account
 * 2. fullName
 * 3. email
 * 4. password
 * 5. workedDay
 * 6. basicSalary
 * 7. position
 * 8. workedHoursInMonth
 * 9. calcTotalSalary()
 * 10. calcTypeOfStaff()
 * 11.
 */

var staffList = [];

var mode = "create";

function submitForm() {
  if (mode === "create") createStaff();
  else if (mode === "update") updateStaff();
}

function createStaff() {
  //validate
  if (!validateForm()) return;
  //1, DOM lấy input
  var account = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var workedDay = document.getElementById("datepicker").value;
  var basicSalary = +document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var workedHoursInMonth = +document.getElementById("gioLam").value;
  //2. check trùng acccount
  for (var i = 0; i < staffList.length; i++) {
    if (staffList[i].account === account) {
      alert("Tài khoản đã tồn tại, vui lòng nhập lại");
      return;
    }
  }
  //3. tạo đối tượng staff
  var staff = new Staff(
    account,
    fullName,
    email,
    password,
    workedDay,
    basicSalary,
    position,
    workedHoursInMonth
  );
  //4, thêm đối tượng staff vào danh sách
  staffList.push(staff);
  //in ra màn hình
  renderStaff();
  //lưu staffList vào local storage
  saveStaffList();
}

function renderStaff(data) {
  data = data || staffList;
  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `<tr>
                <td>${data[i].account}</td>
                <td>${data[i].fullName}</td>
                <td>${data[i].email}</td>
                <td>${data[i].workedDay}</td>
                <td>${data[i].position}</td>
                <td>${data[i].calcTotalSalary()}</td>
                <td>${data[i].calcTypeOfStaff()}</td>
                <td>
                    <button
                    onclick="deleteStaff('${data[i].account}')"
                    class="btn btn-danger">Xóa</button>
                    <button
                    data-toggle="modal"
                    data-target="#myModal"
                    onclick="getUpdateStaff('${data[i].account}')"
                    class="btn btn-info">Sửa</button>
                </td>
            </tr>`;
  }
  document.getElementById("tableDanhSach").innerHTML = html;
}

function saveStaffList() {
  //chuyển staffList về chuỗi JSON
  var staffListJson = JSON.stringify(staffList);

  localStorage.setItem("SL", staffListJson);
}

// lấy dữ liệu từ local storage

function getStaffList() {
  var staffListJson = localStorage.getItem("SL");

  //check nếu dưới local k có dữ liệu thì return về mảng rỗng
  if (!staffListJson) return [];

  //chuyển từ json về object
  return JSON.parse(staffListJson);
}

//input: dataLocal => output: data mới
function mapStaffList(local) {
  var result = [];
  for (var i = 0; i < local.length; i++) {
    var oldStaff = local[i];
    var newStaff = new Staff(
      oldStaff.account,
      oldStaff.fullName,
      oldStaff.email,
      oldStaff.password,
      oldStaff.workedDay,
      oldStaff.basicSalary,
      oldStaff.position,
      oldStaff.workedHoursInMonth
    );
    result.push(newStaff);
  }
  return result;
}

function deleteStaff(account) {
  var index = findByAccount(account);
  if (index === -1) return alert("Account không tồn tại");

  staffList.splice(index, 1);

  renderStaff();

  saveStaffList();
}

//sửa staff part 1: điền thông tin cũ lên form lại, gắn lên button "sửa"
function getUpdateStaff(account) {
  var index = findByAccount(account);
  if (index === -1) return alert("Account không tồn tại");

  var staff = staffList[index];

  document.getElementById("tknv").value = staff.account;
  document.getElementById("name").value = staff.fullName;
  document.getElementById("email").value = staff.email;
  document.getElementById("password").value = staff.password;
  document.getElementById("datepicker").value = staff.workedDay;
  document.getElementById("luongCB").value = staff.basicSalary;
  document.getElementById("chucvu").value = staff.position;
  document.getElementById("gioLam").value = staff.workedHoursInMonth;

  //disable account
  document.getElementById("tknv").disabled = true;

  //đổi mode sang update
  mode = "update";

  //thay đổi button thêm thành thay đổi
  document.getElementById("btnThemNV").innerHTML = "Lưu thay đổi";
  document.getElementById("btnThemNV").classList.add("btn-info");

  //add thêm button cancel update
  //có 2 cách: 1: tạo sẵn ở html rồi ẩn đi
  //            2: tạo bằng JS
  // var btnClose = document.getElementById("btnDong");
  // var btnCancel = document.createElement("button");
  // btnCancel.id = "btnCancel";
  // btnCancel.innerHTML = "Hủy cập nhật";
  // btnCancel.onclick = cancelUpdate;
  // btnCancel.classList.add("btn", "btn-danger");
  // btnClose.before(btnCancel);
  var btnCancel = document.getElementById("btnCancel");
  btnCancel.classList.add("d-block");
}

function cancelUpdate() {
  mode = "create";
  var btnCancel = document.getElementById("btnCancel");

  document.getElementById("btnThemNV").innerHTML = "Thêm người dùng";
  document.getElementById("btnThemNV").classList.remove("btn-info");
  var btnGroupDiv = document.getElementById("modal-footer");
  // btnGroupDiv.removeChild(btnGroupDiv.children[1]);
  btnCancel.classList.add("d-none");
  btnCancel.classList.remove("d-block");

  //reset form
  document.getElementById("form").reset();
  document.getElementById("tknv").disabled = false;
}

//part 2: cho người dùng sửa trên form ròi nhấn nút lưu
function updateStaff() {
  if (!validateForm()) return;

  //1, DOM lấy input
  var account = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var workedDay = document.getElementById("datepicker").value;
  var basicSalary = +document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var workedHoursInMonth = +document.getElementById("gioLam").value;

  var index = findByAccount(account);
  var staff = staffList[index];
  staff.fullName = fullName;
  staff.email = email;
  staff.password = password;
  staff.workedDay = workedDay;
  staff.basicSalary = basicSalary;
  staff.position = position;
  staff.workedHoursInMonth = workedHoursInMonth;

  renderStaff();
  saveStaffList();
  cancelUpdate();
}

//input: account=> output: index
function findByAccount(account) {
  for (var i = 0; i < staffList.length; i++) {
    if (staffList[i].account === account) {
      return i;
    }
  }
  return -1;
}
//khi nào gọi hàm getStaffList chạy? => chạy từ khi người dùng mới vào web
window.onload = function () {
  //code muốn chạy ngay lập tức khi laod trang
  var staffListFromlocal = getStaffList();

  //đưa dữ liệu mới từ local vào mảng staffList
  staffList = mapStaffList(staffListFromlocal);

  //in ra màn hình giá trị mới
  renderStaff();
};

function searchStaffWithType(e) {
  var keyword = e.target.value.toLowerCase().trim();
  var result = [];

  for (var i = 0; i < staffList.length; i++) {
    var typeOfStaff = staffList[i].calcTypeOfStaff().toLowerCase();
    if (typeOfStaff.includes(keyword)) {
      result.push(staffList[i]);
    }
  }
  renderStaff(result);
}

//VALIDATION
function require(val, config) {
  if (val.length > 0) {
    document.getElementById(config.errorAccount).innerHTML = "";
    return true;
  }

  document.getElementById(config.errorAccount).innerHTML =
    "*Không được để trống";
  return false;
}

//check length
function length(val, config) {
  if (val.length < config.min || val.length > config.max) {
    document.getElementById(
      config.errorAccount
    ).innerHTML = `*Độ dài phải từ ${config.min} đến ${config.max} ký tự`;
    return false;
  }
  document.getElementById(config.errorAccount).innerHTML = "";
  return true;
}

//pattern
function pattern(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorAccount).innerHTML = "";
    return true;
  }
  document.getElementById(config.errorAccount).innerHTML =
    "*Không đúng định dạng";
  return false;
}

//check patterrn date
function patternDate(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorAccount).innerHTML = "";
    return true;
  }
  document.getElementById(config.errorAccount).innerHTML =
    "*Không đúng định dạng MM/DD/YYYY";
  return false;
}

//check salary
function checkSalary(val, config) {
  val = +document.getElementById("luongCB").value;
  if (val >= 1000000 && val <= 20000000) {
    document.getElementById(config.errorAccount).innerHTML = "";
    return true;
  }
  document.getElementById(config.errorAccount).innerHTML =
    "Mức lương từ 1,000,000 đến 20,000,000";
  return false;
}

//check workedHours
function workedHours(val, config) {
  val = +document.getElementById("gioLam").value;
  if (val >= 80 && val <= 200) {
    document.getElementById(config.errorAccount).innerHTML = "";
    return true;
  }
  document.getElementById(config.errorAccount).innerHTML =
    "Số giờ làm phải từ 80 giờ đến 200 giờ";
  return false;
}

function validateForm() {
  var account = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var workedDay = document.getElementById("datepicker").value;
  var basicSalary = document.getElementById("luongCB").value;
  var position = document.getElementById("chucvu").value;
  var workedHoursInMonth = document.getElementById("gioLam").value;
  var testRegexpName =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/g;

  var testRegexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  var testRegexpPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/g;
  var testRegexpDate =
    /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[0-1])\/(19|20)\d{2}$/g;

  var accountValid =
    require(account, { errorAccount: "accountError" }) &&
    length(account, { errorAccount: "accountError", min: 4, max: 6 });

  var nameValid =
    require(fullName, { errorAccount: "nameError" }) &&
    pattern(fullName, { errorAccount: "nameError", regexp: testRegexpName });

  var emailValid =
    require(email, { errorAccount: "emailError" }) &&
    pattern(email, { errorAccount: "emailError", regexp: testRegexpEmail });

  var passwordValid =
    require(password, { errorAccount: "passwordError" }) &&
    length(password, { errorAccount: "passwordError", min: 6, max: 10 }) &&
    pattern(password, {
      errorAccount: "passwordError",
      regexp: testRegexpPassword,
    });

  var workedDayValid =
    require(workedDay, { errorAccount: "workedDayError" }) &&
    patternDate(workedDay, {
      errorAccount: "workedDayError",
      regexp: testRegexpDate,
    });

  var salaryValid =
    require(basicSalary, { errorAccount: "salaryError" }) &&
    checkSalary(basicSalary, { errorAccount: "salaryError" });

  var positionValid = require(position, { errorAccount: "positionError" });

  var workedHoursValid =
    require(workedHoursInMonth, { errorAccount: "workedHoursError" }) &&
    workedHours(workedHoursInMonth, { errorAccount: "workedHoursError" });

  var isFormValid =
    accountValid &&
    nameValid &&
    emailValid &&
    passwordValid &&
    workedDayValid &&
    salaryValid &&
    positionValid &&
    workedHoursValid;

  return isFormValid;
}
