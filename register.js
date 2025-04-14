// đăng kí tài khoản
document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let fullName = document.getElementById("fullName").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    // Lấy reference đến các input
    let fullNameInput = document.getElementById("fullName");
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    let confirmPasswordInput = document.getElementById("confirmPassword");

    // Reset thông báo lỗi và trạng thái input
    document.getElementById("fullNameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("passwordError").textContent = "";
    document.getElementById("confirmPasswordError").textContent = "";

    fullNameInput.classList.remove("invalid");
    emailInput.classList.remove("invalid");
    passwordInput.classList.remove("invalid");
    confirmPasswordInput.classList.remove("invalid");

    let isValid = true;

    // Validate Họ và tên
    if (!fullName) {
      document.getElementById("fullNameError").textContent =
        "Họ và tên không được để trống";
      fullNameInput.classList.add("invalid");
      isValid = false;
    }

    // Validate Email
    if (!email) {
      document.getElementById("emailError").textContent =
        "Email không được để trống";
      emailInput.classList.add("invalid");
      isValid = false;
    } else if (!email.includes("@") || !email.includes(".")) {
      document.getElementById("emailError").textContent = "Email không hợp lệ";
      emailInput.classList.add("invalid");
      isValid = false;
    }

    // Validate Mật khẩu
    if (!password) {
      document.getElementById("passwordError").textContent =
        "Mật khẩu không được để trống";
      passwordInput.classList.add("invalid");
      isValid = false;
    } else if (password.length < 8) {
      document.getElementById("passwordError").textContent =
        "Mật khẩu tối thiểu 8 ký tự";
      passwordInput.classList.add("invalid");
      isValid = false;
    }

    // Validate Xác nhận mật khẩu
    if (!confirmPassword) {
      document.getElementById("confirmPasswordError").textContent =
        "Xác nhận mật khẩu không được để trống";
      confirmPasswordInput.classList.add("invalid");
      isValid = false;
    } else if (password !== confirmPassword) {
      document.getElementById("confirmPasswordError").textContent =
        "Mật khẩu không trùng khớp";
      confirmPasswordInput.classList.add("invalid");
      isValid = false;
    }

    // Nếu dữ liệu hợp lệ điều hướng sang trang chủ
    if (isValid) {
      let userData = { email, password };
      localStorage.setItem("user_" + email, JSON.stringify(userData));
      console.log(userData);
      // alert('Đăng ký thành công!');
      window.location.href = "../../index.html";
    }
  });
