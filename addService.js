document
  .getElementById("serviceForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let serviceName = document.getElementById("serviceName").value.trim();
    let serviceDescription = document
      .getElementById("serviceDescription")
      .value.trim();
    let serviceImage = document.getElementById("serviceImage").value.trim();

    // Lấy reference đến các input
    let serviceNameInput = document.getElementById("serviceName");
    let serviceDescriptionInput = document.getElementById("serviceDescription");
    let serviceImageInput = document.getElementById("serviceImage");

    // Reset thông báo lỗi và trạng thái input
    document.getElementById("serviceNameError").textContent = "";
    document.getElementById("serviceDescriptionError").textContent = "";
    document.getElementById("serviceImageError").textContent = "";

    serviceNameInput.classList.remove("invalid");
    serviceDescriptionInput.classList.remove("invalid");
    serviceImageInput.classList.remove("invalid");

    let errorMessages = [];

    // Validate Tên dịch vụ
    if (!serviceName) {
      errorMessages.push("Tên dịch vụ không được để trống");
      serviceNameInput.classList.add("invalid");
      document.getElementById("serviceNameError").textContent =
        "Tên dịch vụ không được để trống";
    }

    // Validate Mô tả
    if (!serviceDescription) {
      errorMessages.push("Mô tả không được để trống");
      serviceDescriptionInput.classList.add("invalid");
      document.getElementById("serviceDescriptionError").textContent =
        "Mô tả không được để trống";
    }

    // Validate URL hình ảnh
    if (!serviceImage) {
      errorMessages.push("URL hình ảnh không được để trống");
      serviceImageInput.classList.add("invalid");
      document.getElementById("serviceImageError").textContent =
        "URL hình ảnh không được để trống";
    } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(serviceImage)) {
      errorMessages.push("URL hình ảnh không hợp lệ");
      serviceImageInput.classList.add("invalid");
      document.getElementById("serviceImageError").textContent =
        "URL hình ảnh không hợp lệ";
    }

    // Nếu có lỗi, hiển thị modal với thông báo lỗi
    if (errorMessages.length > 0) {
      return; // Dừng lại nếu có lỗi
    }

    // Nếu dữ liệu hợp lệ, thực hiện thêm dịch vụ
    let newService = {
      name: serviceName,
      description: serviceDescription,
      image: serviceImage,
    };

    // Lưu dịch vụ vào localStorage hoặc gửi đến server
    console.log("Dịch vụ mới đã được thêm:", newService);
    alert("Dịch vụ mới đã được thêm thành công!");
    hideServiceForm(); // Đóng modal sau khi thêm dịch vụ
  });

// Hàm để ẩn modal
function hideServiceForm() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("serviceFormModal")
  );
  modal.hide();
}
