import ErrorBox from "@/components/Error/ErrorBox";
import SearchResults from "@/components/Home/SearchResults";
import SearchBox from "@/components/Home/SearchingBox";
import Loading from "@/components/Loading/Loading";
import colors from "@/constant/colors";
import jobsSearchingGql from "@/gql/jobsSearching";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";

const RootContainer = styled.div`
  background-color: ${colors.white};
`;

const Container = styled.div`
  padding: 3rem 0;
  width: 70%;
  margin: 0 auto;
  display: flex;
  align-items: start;
`;

const SearchingSide = styled.div`
  width: 35%;
  height: 100%;
`;

const SearchResultsSide = styled.div`
  width: 65%;
  position: relative;
`;

const JobSearchingPage = () => {
  const router = useRouter();

  const { loading, data, error } = useQuery(jobsSearchingGql.SEARCH, {
    variables: {
      input: {
        keyword: router.query.keyword ? router.query.keyword : "",
        tags: router.query.tags
          ? typeof router.query.tags === "string"
            ? [router.query.tags]
            : router.query.tags
          : [],
        salary: {
          min: router.query.salaryMin ? +router.query.salaryMin : 0,
          max: router.query.salaryMax ? +router.query.salaryMax : 100000,
        },
        location: {
          district: router.query.district ? router.query.district : "",
          province: router.query.province ? router.query.province : "",
        },
      },
    },
    fetchPolicy: "no-cache",
  });

  if (error) {
    return <ErrorBox msg={error.message} />;
  }

  return (
    <>
      <Head>
        <title>JobTH - ค้นหางาน</title>
      </Head>
      <RootContainer>
        <Container>
          <SearchingSide>
            <SearchBox router={router} />
          </SearchingSide>
          <SearchResultsSide>
            {loading && <Loading />}
            {data && <SearchResults result={data.search} />}
          </SearchResultsSide>
        </Container>
      </RootContainer>
    </>
  );
};

export default JobSearchingPage;
