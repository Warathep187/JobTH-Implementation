import colors from "@/constant/colors";
import styled from "styled-components";
import CompanyMenu from "./CompanyMenu";
import JobSeekerMenu from "./JobSeekerMenu";
import UnauthorizedMenu from "./UnauthorizedMenu";
import { removeStoredCookie } from "@/utils/manageCookie";
import { useRouter } from "next/router";
import roles from "@/constant/roles";
import { useDispatch, useSelector } from "react-redux";
import { removeLoggedInInfo, setInitialLoggedInInfo } from "@/store/reducers/loggedInInfoSlice";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import authGql from "@/gql/auth";
import { useEffect } from "react";

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.2rem;
  background-color: ${colors.white};
  border-bottom: 4px solid ${colors.orange};
  padding: 0 3rem;
`;

const NavTitle = styled(Link)`
  display: inline-block;
  font-size: 2rem;
  color: ${colors.orange};
  font-weight: 700;
  text-decoration: none;
`;

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { role, isSignedIn } = useSelector((state) => state.loggedInInfo);
  const { loading, data, error } = useQuery(authGql.GET_AUTHENTICATED_INFO);

  const logoutHandler = () => {
    removeStoredCookie("token");
    dispatch(removeLoggedInInfo());
    router.push(`/auth/resumes/login`);
  };

  useEffect(() => {
    if (data) {
      dispatch(setInitialLoggedInInfo(data.getAuthenticationInfo));
    }
  }, [data]);

  const renderMenu = () => {
    if (isSignedIn) {
      if (role === roles.JOB_SEEKER) {
        return <JobSeekerMenu onLogoutHandler={logoutHandler} />;
      } else if (role === roles.COMPANY) {
        return <CompanyMenu onLogoutHandler={logoutHandler} />;
      }
    }

    return <UnauthorizedMenu />;
  };

  return (
    <NavContainer>
      <div>
        <NavTitle href="/">
          <img src="/header-icon.png" />
        </NavTitle>
      </div>
      {renderMenu()}
    </NavContainer>
  );
};

export default Navbar;
