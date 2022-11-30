function Staff(
  account,
  fullName,
  email,
  password,
  workedDay,
  basicSalary,
  position,
  workedHoursInMonth
) {
  this.account = account;
  this.fullName = fullName;
  this.email = email;
  this.password = password;
  this.workedDay = workedDay;
  this.basicSalary = basicSalary;
  this.position = position;
  this.workedHoursInMonth = workedHoursInMonth;

  this.calcTotalSalary = function () {
    var totalSalary = 0;

    if (this.position === "Sếp") {
      totalSalary = this.basicSalary * 3;
    } else if (this.position === "Trưởng phòng") {
      totalSalary = this.basicSalary * 2;
    } else {
      totalSalary = this.basicSalary;
    }
    return totalSalary;
  };

  this.calcTypeOfStaff = function () {
    var typeOfStaff = "";
    if (this.workedHoursInMonth < 160) {
      typeOfStaff = "Nhân viên trung bình";
    } else if (this.workedHoursInMonth < 176) {
      typeOfStaff = "Nhân viên khá";
    } else if (this.workedHoursInMonth < 192) {
      typeOfStaff = "Nhân viên giỏi";
    } else {
      typeOfStaff = "Nhân viên xuất sắc";
    }
    return typeOfStaff;
  };
}
