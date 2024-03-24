import moment from 'moment';

const formatDateTimeStamp = (dateTime) => {
  const milliseconds =
    dateTime._seconds * 1000 + Math.round(dateTime._nanoseconds / 1000000);

  const formattedDateTime = moment(milliseconds).format("DD MMMM YYYY HH:mm:ss A");

  return formattedDateTime;
};

const formatDateDDMMMYYYY= (dateTime) => {
  const milliseconds =
    dateTime._seconds * 1000 + Math.round(dateTime._nanoseconds / 1000000);

  const formattedDateTime = moment(milliseconds).format("DD MMM YYYY");

  return formattedDateTime;
};

const formatDateInChart = (dateTime) => {
    const milliseconds = dateTime * 1000;
  
    const formattedDateTime = moment(milliseconds).format("DD MMM YYYY");
  
    return formattedDateTime;
  };
  

export { formatDateTimeStamp,formatDateDDMMMYYYY,formatDateInChart };
