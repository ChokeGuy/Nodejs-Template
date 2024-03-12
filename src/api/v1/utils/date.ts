function isValidDate(dateString: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  const currentDate = new Date();
  const inputDate = new Date(dateString);
  return inputDate < currentDate;
}

export { isValidDate };
