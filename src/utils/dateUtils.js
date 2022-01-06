export const monthFromNumber = index => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[index] || months[0];
};

export const monthFromDate = date => {
  if (!date) return;
  return monthFromNumber(date.getMonth());
}

export const dayOrderFromDate = date => {
  if (!date) return;
  const day = date.getDate().toFixed(0);
  if (day.endsWith('1')) {
    return day + 'st';
  } else if (day.endsWith('2')) {
    return day + 'nd';
  } else if (day.endsWith('3')) {
    return day + 'rd';
  } else {
    return day + 'th';
  }
}