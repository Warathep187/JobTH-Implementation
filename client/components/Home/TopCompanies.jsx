import colors from "@/constant/colors";
import jobsGql from "@/gql/jobs";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import ErrorBox from "../Error/ErrorBox";
import Loading from "../Loading/Loading";

const Container = styled.div`
  padding: 2rem 0;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
`;

const CompanyContainer = styled.div`
  display: flex;
  align-items: center;

  position: relative;
`;

const CompanyCard = styled.div`
  border: 0.5px solid ${colors.lightgrey_4};
  border-radius: 6px;
  overflow: hidden;
  width: 20%;
  height: 17rem;
  cursor: pointer;

  &:not(:first-child) {
    margin-left: 10px;
  }

  &:hover {
    background-color: ${colors.lightgrey_2};
  }

  &:hover img {
    transform: scale(1.2);
  }
`;

const CardImageContainer = styled.div`
  height: 10rem;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all .3s;
`;

const InformationContainer = styled.div`
  padding: 0.5rem;
  display: flex;
  height: 7rem;
  flex-direction: column;
  justify-content: space-between;
`;

const CompanyNameTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 500;
`;

const DescriptionTextContainer = styled.div`
  text-align: end;
`;

const DescriptionText = styled.span`
  font-size: 0.8rem;
  font-weight: 100;
`;

const JobAmountText = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${colors.orange};
`;

const TopCompanies = () => {
  const router = useRouter();
  const { loading, data, error } = useQuery(jobsGql.GET_TOP_COMPANIES);

  if (error) {
    return <ErrorBox msg={error.message} />;
  }

  const redirectHandler = (companyId) => {
    router.push(`/companies/${companyId}`);
  };

  return (
    <Container>
      <Title>TOP COMPANIES</Title>
      <CompanyContainer>
        {loading && <Loading />}
        {data &&
          data.getTopCompanies.map((company) => (
            <CompanyCard onClick={() => redirectHandler(company._id)} key={company._id}>
              <CardImageContainer>
                <Image src={company.image.url} />
              </CardImageContainer>
              <InformationContainer>
                <CompanyNameTitle>{company.companyName}</CompanyNameTitle>
                <DescriptionTextContainer>
                  <DescriptionText>
                    ประกาศรับงานจำนวน <JobAmountText>{company.count}</JobAmountText> งาน
                  </DescriptionText>
                </DescriptionTextContainer>
              </InformationContainer>
            </CompanyCard>
          ))}
      </CompanyContainer>
    </Container>
  );
};

export default TopCompanies;
