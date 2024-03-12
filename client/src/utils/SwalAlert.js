import Swal from "sweetalert2";

const showErrorAlert = (error) => {
  const handleRefresh = () => {
    window.location.reload();
    window.location.href = `${process.env.PUBLIC_URL}/Login`;
  };
//TODO: test on prod is it work
  Swal.fire({
    icon: "error",
    title: `${error} Error [${process.env.PUBLIC_URL}]`,
    text: "Something went wrong! Please refresh the page",
    confirmButtonText: "Refresh",
  }).then((result) => {
    if (result.isConfirmed) {
      handleRefresh();
    }
  });
};

//TODO: test on prod is it work
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
  }).then((result) => {
    if (result.isConfirmed) {
      handleConfirmButton();
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

export { showErrorAlert, showLoadingAlert, showExpiredTokenAlert };
