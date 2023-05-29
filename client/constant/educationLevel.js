const levels = {
  FIRST: "ระดับประถมศึกษา",
  SECOND: "ระดับมัธยมศึกษา",
  THIRD: "ระดับอุดมศึกษา",
};

export const educationLevels = [
  {
    value: "THIRD",
    label: levels["THIRD"],
  },
  {
    value: "SECOND",
    label: levels["SECOND"],
  },
  {
    value: "FIRST",
    label: levels["FIRST"],
  },
];

export const getEducationLevel = (val) => {
  return levels[val];
};
