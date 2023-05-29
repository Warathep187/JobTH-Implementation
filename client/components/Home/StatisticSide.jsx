import colors from "@/constant/colors";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import StatisticSideTopBar from "./StatisticSideTopBar";
import { useQuery } from "@apollo/client";
import jobsGql from "@/gql/jobs";
import Loading from "../Loading/Loading";

const Container = styled.div`
  margin-left: 2rem;
`;

const PopularTagsContainer = styled.div`
  position: relative;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
`;

const TagsList = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${colors.black_1};

  &:not(:first-child) {
    margin-left: 10px;
  }
`;

const TagItem = styled.div`
  background-color: ${colors.lightgrey_3};
  padding: 0.6rem 0.4rem;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 200;
  cursor: pointer;
  margin: 3px 1px;

  &:hover {
    opacity: 0.7;
  }
`;

const StatisticSide = () => {
  const { loading, data, error } = useQuery(jobsGql.GET_POPULAR_TAGS);

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <Container>
      <StatisticSideTopBar />
      <PopularTagsContainer>
        <Title>Popular tags</Title>
        {loading && <Loading />}
        {data && (
          <TagsList>
            {data.getPopularTags.map((tag) => (
              <StyledLink
                href={{
                  pathname: "/jobs/search",
                  query: {
                    keyword: "",
                    tags: [tag._id],
                  },
                }}
                key={tag._id}>
                <TagItem key={tag._id}>{tag.name}</TagItem>
              </StyledLink>
            ))}
          </TagsList>
        )}
      </PopularTagsContainer>
    </Container>
  );
};

export default StatisticSide;
