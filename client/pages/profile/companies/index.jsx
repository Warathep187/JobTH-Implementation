import CompanyEditProfileForm from "@/components/Company/Edit/EditProfileForm";
import ErrorBox from "@/components/Error/ErrorBox";
import Loading from "@/components/Loading/Loading";
import colors from "@/constant/colors";
import profileGql from "@/gql/profile";
import { getStoredCookie } from "@/utils/manageCookie";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled, { keyframes } from "styled-components";

const RootContainer = styled.div`
  background-color: ${colors.lightgrey_2};
  padding-top: 1.5rem;
`;

const slideUp = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  80% {
    transform: translateY(-3%);
    opacity: .8;
  }
  100% {
    transform: translateY(0%);
    opacity: 1;
  }
`;

const Container = styled.div`
  background-color: ${colors.white};
  width: 50%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  margin: 0 auto;
  padding: 3rem;
  box-shadow: 1rem 1rem 2rem ${colors.lightgrey_3};
  border-bottom: 8px solid ${colors.orange};
  position: relative;

  animation: ${slideUp} 0.5s;
`;

const ViewMainPageContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const StyledLink = styled(Link)`
  font-size: 1.1rem;
  text-decoration: none;
  color: ${colors.primary};

  &:hover {
    color: ${colors.orange};
    text-decoration: underline;
  }
`;

const index = () => {
  const { loading, data, error } = useQuery(profileGql.GET_COMPANY_PROFILE, {
    variables: {
      getCompanyId: getStoredCookie("userId"),
    },
    fetchPolicy: "no-cache",
  });

  if (error) {
    return <ErrorBox msg={error.message} />;
  }

  return (
    <>
      <Head>
        <title>JobTH - โปรไฟล์ส่วนตัว</title>
      </Head>
      <RootContainer>
        <Container>
          {loading && <Loading />}
          {data && (
            <>
              <ViewMainPageContainer>
                <StyledLink href={`/companies/${data.getCompany._id}`}>ดูหน้าหลัก&rarr;</StyledLink>
              </ViewMainPageContainer>
              <CompanyEditProfileForm company={data.getCompany} />
            </>
          )}
        </Container>
      </RootContainer>
    </>
  );
};

export default index;
