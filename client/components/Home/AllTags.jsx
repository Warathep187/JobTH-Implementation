import colors from "@/constant/colors";
import jobsGql from "@/gql/jobs";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import Loading from "../Loading/Loading";

const Container = styled.div``;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
`;

const TagsList = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
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
  margin: 5px 2px;

  &:hover {
    opacity: 0.7;
  }
`;

const AllTags = () => {
  const { loading, data, error } = useQuery(jobsGql.GET_TAGS);

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <Container>
      <Title>ALL TAGS</Title>
      <TagsList>
        {loading && <Loading />}
        {data &&
          data.getTags.map((tag) => (
            <StyledLink href={{ pathname: "/jobs/search", query: { keyword: "", tags: [tag._id] } }} key={tag._id}>
              <TagItem key={tag._id}>{tag.name}</TagItem>
            </StyledLink>
          ))}
      </TagsList>
    </Container>
  );
};

export default AllTags;
