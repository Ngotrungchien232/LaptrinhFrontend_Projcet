// Khởi tạo mảng lưu trữ lịch đặt
let schedules = JSON.parse(localStorage.getItem("schedule")) || [];

// Thêm dữ liệu mẫu nếu chưa có dữ liệu
if (schedules.length === 0) {
  schedules = [
    {
      class: "gym",
      date: "2024-03-20",
      time: "06:00",
      name: "Ngô Trung Chiến ",
      email: "chien1410@gmail.com",
    },
    {
      class: "yoga",
      date: "2024-03-21",
      time: "08:00",
      name: "Nguyễn Văn A",
      email: "vanA@gmail.com",
    },
  ];
  localStorage.setItem("schedules", JSON.stringify(schedules));
}

// Hàm hiển thị danh sách lịch đặt
function displaySchedules() {
  const tableBody = document.getElementById("scheduleTableBody");
  tableBody.innerHTML = "";

  schedules.forEach((schedule, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${schedule.class}</td>
            <td>${formatDate(schedule.date)}</td>
            <td>${schedule.time}</td>
            <td>${schedule.name}</td>
            <td>${schedule.email}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editSchedule(${index})">Sửa</button>
                <button class="action-btn delete-btn" onclick="deleteSchedule(${index})">Xóa</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// Hàm format ngày tháng
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

// Hàm hiển thị form đặt lịch
function showBookingForm() {
  document.getElementById("bookingFormSection").style.display = "block";
  // Reset form và thông báo lỗi
  document.getElementById("bookingForm").reset();
  document
    .querySelectorAll(".error")
    .forEach((error) => (error.textContent = ""));
  document
    .querySelectorAll("input, select")
    .forEach((input) => input.classList.remove("invalid"));
}

// Hàm ẩn form đặt lịch
function hideBookingForm() {
  document.getElementById("bookingFormSection").style.display = "none";
  // Reset tiêu đề form về mặc định
  document.querySelector(".form-header h2").textContent = "Đặt lịch tập";
  // Reset form
  document.getElementById("bookingForm").reset();
  // Xóa index của lịch đang sửa
  delete document.getElementById("bookingForm").dataset.editIndex;
}

// Xử lý form đặt lịch
document
  .getElementById("bookingForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Lấy giá trị từ các trường
    let classValue = document.getElementById("class").value.trim();
    let dateValue = document.getElementById("date").value.trim();
    let timeValue = document.getElementById("time").value.trim();
    let nameValue = document.getElementById("name").value.trim();
    let emailValue = document.getElementById("email").value.trim();

    // Lấy reference đến các input
    let classInput = document.getElementById("class");
    let dateInput = document.getElementById("date");
    let timeInput = document.getElementById("time");
    let nameInput = document.getElementById("name");
    let emailInput = document.getElementById("email");

    // Reset thông báo lỗi và trạng thái input
    document.getElementById("classError").textContent = "";
    document.getElementById("dateError").textContent = "";
    document.getElementById("timeError").textContent = "";
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";

    classInput.classList.remove("invalid");
    dateInput.classList.remove("invalid");
    timeInput.classList.remove("invalid");
    nameInput.classList.remove("invalid");
    emailInput.classList.remove("invalid");

    let isValid = true;

    // Validate lớp học
    if (!classValue) {
      document.getElementById("classError").textContent =
        "Vui lòng chọn lớp học";
      classInput.classList.add("invalid");
      isValid = false;
    }

    // Validate ngày tập
    if (!dateValue) {
      document.getElementById("dateError").textContent =
        "Vui lòng chọn ngày tập";
      dateInput.classList.add("invalid");
      isValid = false;
    } else {
      const selectedDate = new Date(dateValue);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        document.getElementById("dateError").textContent =
          "Không thể đặt lịch cho ngày trong quá khứ";
        dateInput.classList.add("invalid");
        isValid = false;
      }
    }

    // Validate khung giờ
    if (!timeValue) {
      document.getElementById("timeError").textContent =
        "Vui lòng chọn khung giờ";
      timeInput.classList.add("invalid");
      isValid = false;
    }

    // Validate họ tên
    if (!nameValue) {
      document.getElementById("nameError").textContent =
        "Họ và tên không được để trống";
      nameInput.classList.add("invalid");
      isValid = false;
    }

    // else {
    //   let hasInvalidName = false;
    //   const lowerName = nameValue.toLowerCase().trim();

    //   for (let i = 0; i < nameValue.length; i++) {
    //     if (!/^[A-Z]/.test(nameValue.charAt(0))) {
    //       hasInvalidName = true;
    //       break;
    //     }
    //   }

    //   if (hasInvalidName) {
    //     document.getElementById("nameError").textContent =
    //       "Họ và tên phải bắt đầu bằng kí tự in hoa ";
    //     nameInput.classList.add("invalid");
    //     isValid = false;
    //   }
    // }

    // Validate email
    if (!emailValue) {
      document.getElementById("emailError").textContent =
        "Email không được để trống";
      emailInput.classList.add("invalid");
      isValid = false;
    } else if (!emailValue.includes("@") || !emailValue.includes(".")) {
      document.getElementById("emailError").textContent = "Email không hợp lệ";
      emailInput.classList.add("invalid");
      isValid = false;
    }

    // Kiểm tra trùng lịch
    const editIndex = this.dataset.editIndex;
    const isConflict = schedules.some(
      (schedule, index) =>
        index != editIndex && // Bỏ qua lịch đang sửa
        schedule.date === dateValue &&
        schedule.time === timeValue &&
        schedule.class === classValue
    );

    // if (isConflict) {
    //   document.getElementById("timeError").textContent =
    //     "Lớp học này đã có người đặt trong khung giờ này";
    //   timeInput.classList.add("invalid");
    //   isValid = false;
    // }

    // Nếu dữ liệu hợp lệ thì thêm hoặc cập nhật lịch
    if (isValid) {
      const newSchedule = {
        class: classValue,
        date: dateValue,
        time: timeValue,
        name: nameValue,
        email: emailValue,
      };

      if (editIndex !== undefined) {
        // Cập nhật lịch hiện có
        schedules[editIndex] = newSchedule;
        // Hiển thị thông báo sửa thành công
        Swal.fire({
          title: "Đã cập nhật!",
          text: "Lịch tập đã được cập nhật thành công.",
          icon: "success",
        });
      } else {
        // Thêm lịch mới
        schedules.push(newSchedule);
        // Hiển thị thông báo thêm thành công
        Swal.fire({
          title: "Đã thêm!",
          text: "Lịch tập mới đã được thêm thành công.",
          icon: "success",
        });
      }

      // Lưu vào localStorage
      localStorage.setItem("schedules", JSON.stringify(schedules));

      // Hiển thị lại danh sách
      displaySchedules();

      // Ẩn form và reset
      hideBookingForm();
    }
  });

// Hàm xóa lịch
function deleteSchedule(index) {
  Swal.fire({
    title: "Bạn có muốn xoá không?",
    text: "Bạn sẽ không thể hủy bỏ!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Có, xóa nó",
  }).then((result) => {
    if (result.isConfirmed) {
      schedules.splice(index, 1);
      localStorage.setItem("schedules", JSON.stringify(schedules));
      displaySchedules();
      Swal.fire({
        title: "Đã xóa",
        text: "Dữ liệu của bạn đã được xóa.",
        icon: "success",
      });
    }
  });
}

// Hàm sửa lịch
function editSchedule(index) {
  const schedule = schedules[index];
  // Hiển thị form
  showBookingForm();

  // Thay đổi tiêu đề form
  document.querySelector(".form-header h2").textContent = "Sửa lịch tập";

  // Điền thông tin vào form
  document.getElementById("class").value = schedule.class;
  document.getElementById("date").value = schedule.date;
  document.getElementById("time").value = schedule.time;
  document.getElementById("name").value = schedule.name;
  document.getElementById("email").value = schedule.email;

  // Lưu index của lịch đang sửa
  document.getElementById("bookingForm").dataset.editIndex = index;
}

// Hiển thị danh sách khi trang được tải
displaySchedules();
