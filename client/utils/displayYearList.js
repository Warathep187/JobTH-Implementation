export const get50YearsAgo = () => {
  const currentYear = new Date().getFullYear();
  const yearsList = [];
  for (let i = 0; i < 50; i++) {
    yearsList.push({
      label: currentYear - i,
      value: currentYear - i
    });
  }
  return yearsList;
};

export const getNext10Years = () => {
  const currentYear = new Date().getFullYear();
  const yearsList = [];
  for (let i = 10; i > 0; i--) {
    yearsList.push({
      label: currentYear + i,
      value: currentYear + i
    });
  }
  return yearsList;
};