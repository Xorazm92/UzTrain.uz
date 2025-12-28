const getDate = () => {
  const currentDate = new Date();

  // create date string
  const dayNum = currentDate.getDay();
  const monthNum = currentDate.getMonth();
  const dateNum = currentDate.getDate();
  const date = dateNum.toString();

  let day = "";
  switch (dayNum) {
    case 1:
      day = "Dush";
      break;
    case 2:
      day = "Sesh";
      break;
    case 3:
      day = "Chor";
      break;
    case 4:
      day = "Pay";
      break;
    case 5:
      day = "Juma";
      break;
    case 6:
      day = "Shan";
      break;
    case 0:
      day = "Yak";
      break;
  }

  let month = "";
  switch (monthNum) {
    case 0:
      month = "Yan";
      break;
    case 1:
      month = "Fev";
      break;
    case 2:
      month = "Mar";
      break;
    case 3:
      month = "Apr";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "Iyun";
      break;
    case 6:
      month = "Iyul";
      break;
    case 7:
      month = "Avg";
      break;
    case 8:
      month = "Sen";
      break;
    case 9:
      month = "Okt";
      break;
    case 10:
      month = "Noy";
      break;
    case 11:
      month = "Dek";
      break;
  }

  // finish work on date
  const dateOutput = `${day} ${date} ${month}`;

  // create time string
  let hours: string;
  const hoursNum = currentDate.getHours();
  if (hoursNum < 10) {
    const hourString = hoursNum.toString();
    hours = `0${hourString}`;
  } else {
    hours = hoursNum.toString();
  }

  let minutes: string;
  const minutesNum = currentDate.getMinutes();
  if (minutesNum < 10) {
    minutes = `0${minutesNum}`;
  } else {
    minutes = minutesNum.toString();
  }

  // finish work on time (Uzbek style usually 24h, but we can keep simple)
  const timeOutput = `${hours}:${minutes}`;

  // return date and time
  return [dateOutput, timeOutput];
};

export default getDate;