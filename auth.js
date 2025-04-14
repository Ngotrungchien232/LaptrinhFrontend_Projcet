console.log("File auth.js đang được load...");

// Đợi cho DOM được tải xong
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM đã được tải trong auth.js");

  // Kiểm tra localStorage
  if (typeof Storage === "undefined") {
    console.error("Trình duyệt không hỗ trợ localStorage");
    alert(
      "Trình duyệt của bạn không hỗ trợ lưu trữ dữ liệu. Vui lòng nâng cấp trình duyệt."
    );
    return;
  }

  const loginForm = document.getElementById("loginForm");
  if (!loginForm) {
    console.error("Không tìm thấy form đăng nhập");
    return;
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Form submit đã được kích hoạt");

    // Lấy giá trị từ các trường
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    // Reset thông báo lỗi và trạng thái input
    document.getElementById("loginEmailError").textContent = "";
    document.getElementById("loginPasswordError").textContent = "";
    emailInput.classList.remove("invalid");
    passwordInput.classList.remove("invalid");

    let isValid = true;

    // Validate Email
    if (!email) {
      document.getElementById("loginEmailError").textContent =
        "Email không được để trống";
      emailInput.classList.add("invalid");
      isValid = false;
    } else if (!email.includes("@") || !email.includes(".")) {
      document.getElementById("loginEmailError").textContent =
        "Email không hợp lệ";
      emailInput.classList.add("invalid");
      isValid = false;
    }

    // Validate Mật khẩu
    if (!password) {
      document.getElementById("loginPasswordError").textContent =
        "Mật khẩu không được để trống";
      passwordInput.classList.add("invalid");
      isValid = false;
    }

    if (isValid) {
      console.log("Đang kiểm tra đăng nhập...");

      // Kiểm tra nếu là tài khoản admin
      if (email === "admin@gmail.com" && password === "admin1234") {
        console.log("Đăng nhập admin thành công");
        // Lưu thông tin admin
        const adminData = {
          email: email,
          fullName: "Admin",
          isAdmin: true,
        };
        localStorage.setItem("currentUser", JSON.stringify(adminData));

        // Hiển thị modal chào mừng
        showWelcomeModal("Admin", true);
        return;
      }

      // Kiểm tra tài khoản user thường
      const storedUser = localStorage.getItem("user_" + email);
      if (!storedUser) {
        console.log("Email chưa được đăng ký");
        document.getElementById("loginEmailError").textContent =
          "Email chưa được đăng ký";
        emailInput.classList.add("invalid");
        return;
      }

      const userData = JSON.parse(storedUser);
      if (userData.password !== password) {
        console.log("Mật khẩu không đúng");
        document.getElementById("loginPasswordError").textContent =
          "Mật khẩu không đúng";
        passwordInput.classList.add("invalid");
        return;
      }

      console.log("Đăng nhập thành công");
      // Lưu thông tin user
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // Hiển thị modal chào mừng
      showWelcomeModal(userData.fullName || userData.email, false);
    }
  });
});

// Hàm hiển thị modal chào mừng
function showWelcomeModal(userName, isAdmin) {
  // Chuyển hướng ngay lập tức
  redirectAfterLogin(isAdmin);
}

// Hàm chuyển hướng sau khi đăng nhập
function redirectAfterLogin(isAdmin) {
  try {
    if (isAdmin) {
      window.location.href = "/accets/pages/admin/dashboard.html";
    } else {
      window.location.href = "/accets/index.html";
    }
  } catch (error) {
    console.error("Lỗi khi chuyển trang:", error);
    alert("Có lỗi xảy ra khi chuyển trang. Vui lòng thử lại.");
  }
}

// Hàm chuyển hướng sau khi đóng modal
function redirectAfterLogin(isAdmin) {
  try {
    if (isAdmin) {
      window.location.href = "/accets/pages/admin/dashboard.html";
    } else {
      window.location.href = "/accets/index.html";
    }
  } catch (error) {
    console.error("Lỗi khi chuyển trang:", error);
    alert("Có lỗi xảy ra khi chuyển trang. Vui lòng thử lại.");
  }
}
