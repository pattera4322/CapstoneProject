import moment from 'moment';

const formatDateTimeStamp = (dateTime) => {
  const milliseconds =
    dateTime._seconds * 1000 + Math.round(dateTime._nanoseconds / 1000000);

  const adjustedMilliseconds = milliseconds - 7 * 60 * 60 * 1000;

  const formattedDateTime = moment(adjustedMilliseconds).format("DD MMMM YYYY HH:mm:ss A");

  return formattedDateTime;
};

const formatDateInChart = (dateTime) => {
    const milliseconds = dateTime * 1000;
    const adjustedMilliseconds = milliseconds - 7 * 60 * 60 * 1000;
  
    const formattedDateTime = moment(adjustedMilliseconds).format("DD MMM YYYY");
  
    return formattedDateTime;
  };
  

export { formatDateTimeStamp,formatDateInChart };
