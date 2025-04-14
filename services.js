// Khởi tạo mảng lưu trữ dịch vụ
let services = JSON.parse(localStorage.getItem("services")) || [];

// Thêm dữ liệu mẫu nếu chưa có dữ liệu
if (services.length === 0) {
  services = [
    {
      name: "Gym",
      description: "Tập luyện với các thiết bị hiện đại",
      image: "accets/img/ảnh gym.jpeg",
    },
    {
      name: "Yoga",
      description: "Thư giãn và cải thiện tâm trí",
      image: "accets/img/yoga1.png",
    },
    {
      name: "Zumba",
      description: "Đốt cháy calories với những điệu nhảy sôi động",
      image: "/accets/img/zumba.png",
    },
  ];
  localStorage.setItem("services", JSON.stringify(services));
  updateHomePageServices();
}

// Hàm cập nhật dịch vụ ở trang chủ
function updateHomePageServices() {
  // Cập nhật các card ở trang chủ
  const cards = document.querySelectorAll(".card");
  if (cards.length > 0) {
    services.forEach((service, index) => {
      if (cards[index]) {
        const card = cards[index];
        card.querySelector(".card-img-top").src = service.image;
        card.querySelector(".card-img-top").alt = service.name;
        card.querySelector(".card-title").textContent = service.name;
        card.querySelector(".card-text").textContent = service.description;
      }
    });
  }
}

// Hàm hiển thị danh sách dịch vụ
function displayServices() {
  const tableBody = document.getElementById("serviceTableBody");
  tableBody.innerHTML = "";

  services.forEach((service, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${service.name}</td>
            <td>${service.description}</td>
            <td>
                <img src="${service.image}" alt="${service.name}" style="width: 100px; height: 60px; object-fit: cover;">
            </td>
            <td>
                <button class="btn btn-link text-decoration-none" onclick="editService(${index})">Sửa</button>
                <button class="btn btn-link text-decoration-none text-danger" onclick="deleteService(${index})">Xóa</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// Hàm validate form
function validateForm() {
  const name = document.getElementById("serviceName").value.trim();
  const description = document
    .getElementById("serviceDescription")
    .value.trim();
  const image = document.getElementById("serviceImage").value.trim();

  resetFormErrors();
  let hasError = false;

  // Validate từng trường
  const nameError = validateServiceName(name);
  const descriptionError = validateDescription(description);
  const imageError = validateImageUrl(image);

  if (nameError) {
    showError("serviceName", nameError);
    hasError = true;
  }
  if (descriptionError) {
    showError("serviceDescription", descriptionError);
    hasError = true;
  }
  if (imageError) {
    showError("serviceImage", imageError);
    hasError = true;
  }

  return !hasError;
}

// Thêm sự kiện blur cho các trường input
document.getElementById("serviceName").addEventListener("blur", function () {
  const error = validateServiceName(this.value.trim());
  if (error) {
    showError("serviceName", error);
  }
});

document
  .getElementById("serviceDescription")
  .addEventListener("blur", function () {
    const error = validateDescription(this.value.trim());
    if (error) {
      showError("serviceDescription", error);
    }
  });

document.getElementById("serviceImage").addEventListener("blur", function () {
  const error = validateImageUrl(this.value.trim());
  if (error) {
    showError("serviceImage", error);
  }
});

// Hàm hiển thị form thêm dịch vụ
function showServiceForm() {
  document.getElementById("serviceForm").reset();
  resetFormErrors();
  document.querySelector(".modal-title").textContent = "Thêm dịch vụ mới";
  document.getElementById("serviceForm").removeAttribute("data-edit-index");
  document.getElementById("serviceFormModal").style.display = "block";
}

// Hàm ẩn form
function hideServiceForm() {
  document.getElementById("serviceFormModal").style.display = "none";
  document.getElementById("serviceForm").reset();
  resetFormErrors();
}

// Hàm sửa dịch vụ
function editService(index) {
  const service = services[index];
  document.querySelector(".modal-title").textContent = "Sửa dịch vụ";
  document.getElementById("serviceName").value = service.name;
  document.getElementById("serviceDescription").value = service.description;
  document.getElementById("serviceImage").value = service.image;
  document.getElementById("serviceForm").setAttribute("data-edit-index", index);
  document.getElementById("serviceFormModal").style.display = "block";
}

// Hàm xóa dịch vụ
function deleteService(index) {
  Swal.fire({
    title: "Bạn có muốn xoá không?",
    text: "Bạn sẽ không thể hủy bỏ!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Có, xóa nó",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      services.splice(index, 1);
      localStorage.setItem("services", JSON.stringify(services));
      displayServices();
      updateHomePageServices();
      Swal.fire({
        title: "Đã xóa!",
        text: "Dịch vụ đã được xóa thành công.",
        icon: "success",
      });
    }
  });
}

// Hàm validate tên dịch vụ
function validateServiceName(name) {
  if (!name) {
    return "Tên dịch vụ không được để trống";
  }
  if (name.length < 2 || name.length > 50) {
    return "Tên dịch vụ phải từ 2 đến 50 ký tự";
  }
  if (!/^[a-zA-ZÀ-ỹ0-9\s]+$/.test(name)) {
    return "Tên dịch vụ không được chứa ký tự đặc biệt";
  }
  return "";
}

// Hàm validate mô tả
function validateDescription(description) {
  if (!description) {
    return "Mô tả không được để trống";
  }
  if (description.length < 10 || description.length > 500) {
    return "Mô tả phải từ 10 đến 500 ký tự";
  }
  return "";
}

// Hàm validate URL hình ảnh
function validateImageUrl(url) {
  if (!url) {
    return "URL hình ảnh không được để trống";
  }
  try {
    new URL(url);
  } catch {
    return "URL hình ảnh không hợp lệ";
  }
  if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
    return "URL phải kết thúc bằng định dạng ảnh (.jpg, .jpeg, .png, .gif, .webp)";
  }
  return "";
}

// Hàm reset form và thông báo lỗi
function resetFormErrors() {
  document
    .querySelectorAll(".error")
    .forEach((error) => (error.textContent = ""));
  document
    .querySelectorAll(".form-control")
    .forEach((input) => input.classList.remove("is-invalid"));
}

// Hàm hiển thị lỗi
function showError(elementId, errorMessage) {
  const element = document.getElementById(elementId);
  const errorElement = document.getElementById(elementId + "Error");
  if (element && errorElement) {
    element.classList.add("is-invalid");
    errorElement.textContent = errorMessage;
  }
}

// Xử lý submit form
document
  .getElementById("serviceForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Validate form trước khi submit
    if (!validateForm()) {
      return;
    }

    const name = document.getElementById("serviceName").value.trim();
    const description = document
      .getElementById("serviceDescription")
      .value.trim();
    const image = document.getElementById("serviceImage").value.trim();

    const newService = { name, description, image };
    const editIndex = this.getAttribute("data-edit-index");

    if (editIndex !== null) {
      // Cập nhật dịch vụ
      services[editIndex] = newService;
    } else {
      // Kiểm tra tên dịch vụ đã tồn tại chưa
      if (
        services.some(
          (service) => service.name.toLowerCase() === name.toLowerCase()
        )
      ) {
        showError("serviceName", "Tên dịch vụ đã tồn tại");
        return;
      }
      // Thêm dịch vụ mới
      services.push(newService);
    }

    // Lưu vào localStorage và cập nhật giao diện
    localStorage.setItem("services", JSON.stringify(services));
    displayServices();
    updateHomePageServices();
    hideServiceForm();

    // Hiển thị thông báo thành công
    Swal.fire({
      title: editIndex !== null ? "Đã cập nhật!" : "Đã thêm!",
      text:
        editIndex !== null
          ? "Dịch vụ đã được cập nhật thành công."
          : "Dịch vụ mới đã được thêm thành công.",
      icon: "success",
    });
  });

// Thêm sự kiện input để xóa thông báo lỗi khi người dùng bắt đầu nhập
document.querySelectorAll(".form-control").forEach((input) => {
  input.addEventListener("input", function () {
    this.classList.remove("is-invalid");
    const errorElement = document.getElementById(this.id + "Error");
    if (errorElement) {
      errorElement.textContent = "";
    }
  });
});

function updateServiceTable() {
  const tableBody = document.getElementById("serviceTableBody");
  tableBody.innerHTML = ""; // Xóa nội dung cũ

  services.forEach((service) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${service.name}</td>
        <td>${service.description}</td>
        <td><img src="${service.image}" alt="${service.name}" style="width: 100px; height: auto;"></td>
        <td>
          <button class="btn btn-primary" onclick="editService('${service.name}')">Sửa</button>
          <button class="btn btn-danger" onclick="deleteService('${service.name}')">Xóa</button>
        </td>
      `;
    tableBody.appendChild(row);
  });
}

// Hiển thị danh sách khi trang được tải
displayServices();

// Thêm sự kiện đóng modal khi click bên ngoài
window.onclick = function (event) {
  const modal = document.getElementById("serviceFormModal");
  if (event.target == modal) {
    hideServiceForm();
  }
};
