import Swal from "sweetalert2";

const showNetworkErrorAlert = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  Swal.fire({
    icon: "error",
    title: "Network Error",
    text: "Something went wrong! Please refresh the page",
    confirmButtonText: "Refresh",
  }).then((result) => {
    if (result.isConfirmed) {
      handleRefresh();
    }
  });
};

const showExpiredTokenAlert = (callback) => {
  const handleConfirmButton = () => {
    localStorage.clear();
  };

  Swal.fire({
    icon: "error",
    title: "Your session has expired.",
    text: "Please log in again to continue use our website",
    confirmButtonText: "Login again",
  }).then((result) => {
    if (result.isConfirmed) {
      handleConfirmButton();
      if (callback) {
        callback();
        window.location.reload();
      }
    }
  });
};

const showLoadingAlert = () => {
  Swal.fire({
    title: "Logging In",
    html: "Please wait while we log you in...",
    allowOutsideClick: false,
    showConfirmButton: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    },
  });
};

export { showNetworkErrorAlert, showLoadingAlert, showExpiredTokenAlert };
