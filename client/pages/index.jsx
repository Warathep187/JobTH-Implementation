import AllTags from "@/components/Home/AllTags";
import SearchBox from "@/components/Home/SearchingBox";
import StatisticSide from "@/components/Home/StatisticSide";
import TopCompanies from "@/components/Home/TopCompanies";
import colors from "@/constant/colors";
import Head from "next/head";
import styled from "styled-components";

const RootContainer = styled.div``;

const Container = styled.div`
  padding: 3rem 0;
  width: 70%;
  margin: 0 auto;
`;

const TopContainer = styled.div`
  display: flex;
  align-items: start;
  margin-bottom: 1rem;
`;

const SearchingSide = styled.div`
  width: 35%;
`;

const StatSide = styled.div`
  width: 65%;
`;

const BottomContainer = styled.div``;

export default function Home() {
  return (
    <>
      <Head>
        <title>JobTH - หางาน สมัครงาน</title>
      </Head>
      <RootContainer>
        <Container>
          <TopContainer>
            <SearchingSide>
              <SearchBox />
            </SearchingSide>
            <StatSide>
              <StatisticSide />
            </StatSide>
          </TopContainer>
          <BottomContainer>
            <TopCompanies />
            <AllTags />
          </BottomContainer>
        </Container>
      </RootContainer>
    </>
  );
}
