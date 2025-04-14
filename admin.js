// Khởi tạo dữ liệu mẫu
let schedules = JSON.parse(localStorage.getItem("schedules")) || [];
let services = JSON.parse(localStorage.getItem("services")) || [];

// Các biến phân trang
let currentPage = 1;
const itemsPerPage = 10;

// Các biến lọc
let currentFilter = {
  email: "",
  class: "",
  date: "",
};

// Hàm kiểm tra quyền admin
function checkAdminAccess() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.email !== "admin@gmail.com") {
    window.location.href = "/accets/pages/auth/login.html";
    return false;
  }
  return true;
}

// Hàm hiển thị danh sách lịch
function displaySchedules() {
  const tableBody = document.getElementById("scheduleTableBody");
  if (!tableBody) return;

  // Lọc dữ liệu
  let filteredSchedules = schedules;
  if (currentFilter.email) {
    filteredSchedules = filteredSchedules.filter((schedule) =>
      schedule.email.toLowerCase().includes(currentFilter.email.toLowerCase())
    );
  }
  if (currentFilter.class) {
    filteredSchedules = filteredSchedules.filter(
      (schedule) => schedule.class === currentFilter.class
    );
  }
  if (currentFilter.date) {
    filteredSchedules = filteredSchedules.filter(
      (schedule) => schedule.date === currentFilter.date
    );
  }

  // Phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex);

  // Hiển thị dữ liệu
  tableBody.innerHTML = "";
  paginatedSchedules.forEach((schedule, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${schedule.class}</td>
      <td>${formatDate(schedule.date)}</td>
      <td>${schedule.time}</td>
      <td>${schedule.name}</td>
      <td>${schedule.email}</td>
      <td>
        <button class="btn btn-primary" onclick="editSchedule(${index})">Sửa</button>
        <button class="btn btn-danger" onclick="deleteSchedule(${index})">Xóa</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Hiển thị phân trang
  displayPagination(filteredSchedules.length);
}

// Hàm hiển thị phân trang
function displayPagination(totalItems) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let paginationHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <button class="pagination-btn ${i === currentPage ? "active" : ""}" 
              onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }

  pagination.innerHTML = paginationHTML;
}

// Hàm thay đổi trang
function changePage(page) {
  currentPage = page;
  displaySchedules();
}

// Hàm lọc dữ liệu
function applyFilter() {
  currentFilter = {
    email: document.getElementById("filterEmail").value,
    class: document.getElementById("filterClass").value,
    date: document.getElementById("filterDate").value,
  };
  currentPage = 1;
  displaySchedules();
}

// Hàm thống kê
function displayStats() {
  const stats = {
    gym: schedules.filter((s) => s.class === "gym").length,
    yoga: schedules.filter((s) => s.class === "yoga").length,
    zumba: schedules.filter((s) => s.class === "zumba").length,
  };

  document.getElementById("gymCount").textContent = stats.gym;
  document.getElementById("yogaCount").textContent = stats.yoga;
  document.getElementById("zumbaCount").textContent = stats.zumba;

  // Vẽ biểu đồ
  drawChart(stats);
}

// Hàm vẽ biểu đồ
function drawChart(stats) {
  const ctx = document.getElementById("scheduleChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Gym", "Yoga", "Zumba"],
      datasets: [
        {
          label: "Số lượng lịch đặt",
          data: [stats.gym, stats.yoga, stats.zumba],
          backgroundColor: [
            "rgba(59, 130, 246, 0.5)",
            "rgba(16, 185, 129, 0.5)",
            "rgba(245, 158, 11, 0.5)",
          ],
          borderColor: [
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(245, 158, 11)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Hàm định dạng ngày
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

// Hàm xóa lịch
function deleteSchedule(index) {
  if (confirm("Bạn có chắc chắn muốn xóa lịch này?")) {
    schedules.splice(index, 1);
    localStorage.setItem("schedules", JSON.stringify(schedules));
    displaySchedules();
    displayStats();
  }
}

// Hàm sửa lịch
function editSchedule(index) {
  const schedule = schedules[index];
  // Hiển thị form sửa
  showEditForm(schedule, index);
}

// Hàm hiển thị form sửa
function showEditForm(schedule, index) {
  // Tạo modal form sửa
  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = "editModal";
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Sửa lịch</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="editForm">
            <div class="mb-3">
              <label class="form-label">Lớp học</label>
              <select class="form-select" name="class" required>
                <option value="gym" ${
                  schedule.class === "gym" ? "selected" : ""
                }>Gym</option>
                <option value="yoga" ${
                  schedule.class === "yoga" ? "selected" : ""
                }>Yoga</option>
                <option value="zumba" ${
                  schedule.class === "zumba" ? "selected" : ""
                }>Zumba</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Ngày</label>
              <input type="date" class="form-control" name="date" value="${
                schedule.date
              }" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Thời gian</label>
              <select class="form-select" name="time" required>
                <option value="06:00" ${
                  schedule.time === "06:00" ? "selected" : ""
                }>06:00 - 08:00</option>
                <option value="08:00" ${
                  schedule.time === "08:00" ? "selected" : ""
                }>08:00 - 10:00</option>
                <option value="14:00" ${
                  schedule.time === "14:00" ? "selected" : ""
                }>14:00 - 16:00</option>
                <option value="16:00" ${
                  schedule.time === "16:00" ? "selected" : ""
                }>16:00 - 18:00</option>
                <option value="18:00" ${
                  schedule.time === "18:00" ? "selected" : ""
                }>18:00 - 20:00</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Họ tên</label>
              <input type="text" class="form-control" name="name" value="${
                schedule.name
              }" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" name="email" value="${
                schedule.email
              }" required>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
          <button type="button" class="btn btn-primary" onclick="saveEdit(${index})">Lưu</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  const editModal = new bootstrap.Modal(modal);
  editModal.show();

  // Xóa modal khi đóng
  modal.addEventListener("hidden.bs.modal", function () {
    modal.remove();
  });
}

// Hàm lưu chỉnh sửa
function saveEdit(index) {
  const form = document.getElementById("editForm");
  const formData = new FormData(form);

  schedules[index] = {
    class: formData.get("class"),
    date: formData.get("date"),
    time: formData.get("time"),
    name: formData.get("name"),
    email: formData.get("email"),
  };

  localStorage.setItem("schedules", JSON.stringify(schedules));
  displaySchedules();
  displayStats();

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("editModal")
  );
  modal.hide();
}

// Khởi tạo khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  if (!checkAdminAccess()) return;

  displaySchedules();
  displayStats();

  // Thêm sự kiện cho các nút lọc
  document
    .getElementById("filterEmail")
    ?.addEventListener("input", applyFilter);
  document
    .getElementById("filterClass")
    ?.addEventListener("change", applyFilter);
  document
    .getElementById("filterDate")
    ?.addEventListener("change", applyFilter);
});
