import Error from "@/components/Error/ErrorBox";
import Loading from "@/components/Loading/Loading";
import BasicProfile from "@/components/Profile/Edit/BasicProfile";
import colors from "@/constant/colors";
import menuItems from "@/constant/profileMenuItems";
import profileGql from "@/gql/profile";
import { useQuery } from "@apollo/client";
import { Menu } from "antd";
import Head from "next/head";
import styled from "styled-components";

const Container = styled.div`
  width: 70%;
  margin: 2rem auto;
  display: flex;
  align-items: start;
`;

const LeftSideContainer = styled.div`
  width: 30%;
  border: 0.5px solid ${colors.lightgrey_3};
  border-radius: 15px;
  background-color: ${colors.white};
  overflow: hidden;
  padding: 0.5rem 0;
`;

const RightSideContainer = styled.div`
  width: 70%;
  border: 0.5px solid ${colors.lightgrey_3};
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border-bottom: 6px solid ${colors.orange};
  margin-left: 2rem;
  overflow: hidden;
  position: relative;
`;

const BasicInformationPage = () => {
  const { loading, data, error } = useQuery(profileGql.GET_BASIC_PROFILE, {
    fetchPolicy: "no-cache",
  });

  if (error) {
    return <Error msg={error.message} />;
  }

  return (
    <>
      <Head>
        <title>JobTH - โปรไฟล์ส่วนตัว</title>
      </Head>
      <Container>
        <LeftSideContainer>
          <Menu selectedKeys={["basic"]} mode="vertical" items={menuItems} style={{ fontSize: "1rem" }} />
        </LeftSideContainer>
        <RightSideContainer>
          {loading && <Loading />}
          {data && <BasicProfile profile={data.getMyProfile} />}
        </RightSideContainer>
      </Container>
    </>
  );
};

export default BasicInformationPage;
