import Swal from "sweetalert2";

const showErrorAlertWithRefresh = (error) => {
  const handleRefresh = () => {
    window.location.reload();
  };
  Swal.fire({
    icon: "error",
    title: `${error} Error`,
    text: "Something went wrong! Please refresh the page",
    confirmButtonText: "Refresh",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      handleRefresh();
    }
  });
};

const showExpiredTokenAlert = () => {
  const handleConfirmButton = () => {
    localStorage.clear();
    window.location.reload();
    window.location.href = `${process.env.PUBLIC_URL}/Login`;
  };

  Swal.fire({
    icon: "error",
    title: "Your session has expired.",
    text: "Please log in again to continue use our website",
    confirmButtonText: "Login again",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      handleConfirmButton();
    }
  });
};

const showSuccessAlert = async (title) => {
  await Swal.fire({
    icon: "success",
    title: `${title}`,
    showConfirmButton: false,
    timer: 1500,
  });
};

const showErrorAlert = async (title, text) => {
  await Swal.fire({
    icon: "error",
    title: `${title}`,
    text: `${text}`,
    showConfirmButton: false,
  });
};

export {
  showErrorAlert,
  showExpiredTokenAlert,
  showSuccessAlert,
  showErrorAlertWithRefresh,
};
