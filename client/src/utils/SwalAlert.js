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

export { showNetworkErrorAlert, showLoadingAlert };
