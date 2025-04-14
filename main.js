// Kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
  const currentUser = localStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : null;
}

// Lưu trạng thái đăng nhập
function saveLoginStatus(userData) {
  localStorage.setItem("currentUser", JSON.stringify(userData));
}

// Xóa trạng thái đăng nhập (đăng xuất)
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "/accets/pages/auth/login.html";
}

// Hiển thị modal chào mừng
function showWelcomeModal() {
  const currentUser = checkLoginStatus();
  if (!currentUser) return;

  // Kiểm tra xem đã hiển thị modal chưa
  const hasShownModal = sessionStorage.getItem("hasShownWelcomeModal");
  if (hasShownModal) return;

  // Tạo modal
  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = "welcomeModal";
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "welcomeModalLabel");
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="welcomeModalLabel">Chào mừng</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="welcome-icon">
                        <i class="fas fa-handshake fa-3x text-primary mb-3"></i>
                    </div>
                    <h4>Xin chào, ${
                      currentUser.fullName || currentUser.email
                    }!</h4>
                    <p class="text-muted">Chúc bạn có những trải nghiệm tuyệt vời tại phòng tập của chúng tôi.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Bắt đầu</button>
                </div>
            </div>
        </div>
    `;

  // Thêm modal vào body
  document.body.appendChild(modal);

  // Hiển thị modal
  const welcomeModal = new bootstrap.Modal(modal);
  welcomeModal.show();

  // Lưu trạng thái đã hiển thị modal
  sessionStorage.setItem("hasShownWelcomeModal", "true");

  // Xóa modal khỏi DOM sau khi đóng
  modal.addEventListener("hidden.bs.modal", function () {
    modal.remove();
  });
}

// Kiểm tra quyền truy cập trang
function checkAccess() {
  const currentUser = checkLoginStatus();
  const currentPath = window.location.pathname;

  // Danh sách các trang yêu cầu đăng nhập
  const protectedPages = [
    "/accets/pages/booking/schedule.html",
    "/accets/pages/admin/dashboard.html",
  ];

  // Nếu là trang admin và không phải admin thì chuyển hướng
  if (
    currentPath.includes("/admin/") &&
    (!currentUser || currentUser.email !== "admin@gmail.com")
  ) {
    window.location.href = "/accets/pages/auth/login.html";
    return;
  }

  // Nếu là trang yêu cầu đăng nhập và chưa đăng nhập thì chuyển hướng
  if (protectedPages.includes(currentPath) && !currentUser) {
    window.location.href = "/accets/pages/auth/login.html";
    return;
  }
}

// Cập nhật giao diện navbar dựa trên trạng thái đăng nhập
function updateNavbar() {
  const currentUser = checkLoginStatus();
  const navbar = document.querySelector(".navbar-nav");

  if (!navbar) return;

  // Xóa tất cả các nút cũ
  navbar.innerHTML = "";

  // Thêm nút Trang chủ
  const homeBtn = document.createElement("li");
  homeBtn.className = "nav-item";
  homeBtn.innerHTML = `
    <a class="nav-link" href="/accets/index.html">
      <i class="fas fa-home"></i> Trang chủ
    </a>
  `;
  navbar.appendChild(homeBtn);

  // Thêm nút Đặt lịch
  const bookingBtn = document.createElement("li");
  bookingBtn.className = "nav-item";
  bookingBtn.innerHTML = `
    <a class="nav-link" href="/accets/pages/booking/schedule.html">
      <i class="fas fa-calendar-alt"></i> Đặt lịch
    </a>
  `;
  navbar.appendChild(bookingBtn);

  if (currentUser) {
    // Nếu đã đăng nhập
    const userInfo = document.createElement("li");
    userInfo.className = "nav-item user-info";
    userInfo.innerHTML = `
      <span class="nav-link text-white">
        Xin chào, ${currentUser.fullName || currentUser.email}
      </span>
    `;
    navbar.appendChild(userInfo);

    // Nếu là admin, thêm nút quản lý
    if (currentUser.email === "admin@gmail.com") {
      const adminBtn = document.createElement("li");
      adminBtn.className = "nav-item admin-btn";
      adminBtn.innerHTML = `
        <a class="nav-link" href="/accets/pages/admin/dashboard.html">
          <i class="fas fa-cog"></i> Quản lý
        </a>
      `;
      navbar.appendChild(adminBtn);
    }
  } else {
    // Nếu chưa đăng nhập
    const loginBtn = document.createElement("li");
    loginBtn.className = "nav-item login-btn";
    loginBtn.innerHTML = `
      <a class="nav-link" href="/accets/pages/auth/login.html">
        <i class="fas fa-sign-in-alt"></i> Đăng nhập
      </a>
    `;
    navbar.appendChild(loginBtn);
  }

  // Nút đăng xuất
  const logoutBtn = document.createElement("li");
  logoutBtn.className = "nav-item";
  logoutBtn.innerHTML = `
      <a class="nav-link logout-btn" href="#" onclick="logout()">
        <i class="fas fa-sign-out-alt"></i> Đăng xuất
      </a>
    `;
  navbar.appendChild(logoutBtn);
}

// Hàm cập nhật dịch vụ trên trang chủ
function updateHomeServices() {
  // Lấy dữ liệu dịch vụ từ localStorage
  const services = JSON.parse(localStorage.getItem("services")) || [];

  // Lấy container chứa các card dịch vụ
  const cardContainer = document.querySelector(".row");
  if (!cardContainer) return;

  // Xóa tất cả card hiện tại
  cardContainer.innerHTML = "";

  // Tạo card mới cho mỗi dịch vụ
  services.forEach((service) => {
    const cardHtml = `
          <div class="col-md-4">
              <div class="card">
                  <img src="${service.image}" class="card-img-top" alt="${service.name}">
                  <div class="card-body">
                      <h5 class="card-title">${service.name}</h5>
                      <p class="card-text">${service.description}</p>
                      <a href="/accets/pages/booking/schedule.html" class="btn btn-primary">Đặt lịch</a>
                  </div>
              </div>
          </div>
      `;
    cardContainer.innerHTML += cardHtml;
  });
}

// Gọi hàm cập nhật khi trang được tải
document.addEventListener("DOMContentLoaded", updateHomeServices);

// Chạy khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  checkAccess();
  updateNavbar();
  showWelcomeModal();
});
