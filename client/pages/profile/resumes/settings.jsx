import Settings from "@/components/Profile/Edit/Settings";
import colors from "@/constant/colors";
import menuItems from "@/constant/profileMenuItems";
import { Menu } from "antd";
import styled from "styled-components";
import profileGql from "../../../gql/profile";
import ErrorBox from "@/components/Error/ErrorBox";
import { useQuery } from "@apollo/client";
import Loading from "@/components/Loading/Loading";
import Head from "next/head";

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

const SettingPage = () => {
  const { loading, data, error } = useQuery(profileGql.GET_SETTINGS, {
    fetchPolicy: "no-cache",
  });

  if (error) {
    return <ErrorBox msg={error.message} />;
  }

  return (
    <>
      <Head>
        <title>JobTH - การตั้งค่า</title>
      </Head>
      <Container>
        <LeftSideContainer>
          <Menu selectedKeys={["settings"]} mode="vertical" items={menuItems} style={{ fontSize: "1rem" }} />
        </LeftSideContainer>
        <RightSideContainer>
          {loading && <Loading />}
          {data && <Settings settings={data.getMyProfile.settings} />}
        </RightSideContainer>
      </Container>
    </>
  );
};

export default SettingPage;
