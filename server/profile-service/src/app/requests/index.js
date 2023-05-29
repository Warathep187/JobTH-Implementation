import executeValidator from "./requests";
import getByIdParam from "./getByIdParam";
import updateProfile from "./updateProfile";

export default {
  getByIdParam: executeValidator(getByIdParam),
  jobSeekerUpdateProfile: executeValidator(updateProfile.jobSeekerUpdateProfileValidateFieldsList),
  updateProfileImage: executeValidator(updateProfile.updateProfileImageValidateFieldsList),
  jobSeekerUpdateSetting: executeValidator(updateProfile.jobSeekerUpdateSettingValidateFieldsList),
  companyUpdateProfile: executeValidator(updateProfile.companyUpdateProfileValidateFieldsList),
};
