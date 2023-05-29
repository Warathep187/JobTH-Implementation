const educationLevels = {
  "FIRST": "ระดับประถมศึกษา",
  "SECOND": "ระดับมัธยมศึกษา",
  "THIRD": "ระดับอุดมศึกษา"
}

const getEducationLevel = (level) => {
  return educationLevels[level]
}

export default getEducationLevel;