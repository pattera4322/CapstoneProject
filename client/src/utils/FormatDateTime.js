import moment from "moment";

const formatDateTimeStamp = (dateTime) => {
  const milliseconds =
    dateTime._seconds * 1000 + Math.round(dateTime._nanoseconds / 1000000);

  const formattedDateTime = moment(milliseconds).format(
    "DD MMMM YYYY HH:mm:ss A"
  );

  return formattedDateTime;
};

const formatDateDDMMMYYYY = (dateString) => {
  let date = moment(dateString, "DD-MM-YYYY");

  let formattedDateTime = date.format("DD-MMM-YYYY");

  return formattedDateTime;
};

const formatDateYYYYMMDD = (dateString) => {
  let date = moment(dateString, "DD-MM-YYYY");

  let formattedDate = date.format("YYYY-MM-DD");

  return formattedDate;
};

const formatStringToDate = (dateString) => {
  let date = moment(dateString, "DD-MMM-YYYY");

  return date;
};

const formatDateInChart = (dateTime) => {
  const milliseconds = dateTime * 1000;

  const formattedDateTime = moment(milliseconds).format("DD MMM YYYY");

  return formattedDateTime;
};

export {
  formatDateTimeStamp,
  formatDateDDMMMYYYY,
  formatDateInChart,
  formatDateYYYYMMDD,
  formatStringToDate
};
