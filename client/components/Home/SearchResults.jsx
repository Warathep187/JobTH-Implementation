import colors from "@/constant/colors";
import { DollarCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-left: 2rem;
`;

const TopBar = styled.div`
  background-image: url("/home-img.svg");
  background-repeat: no-repeat;
  background-position: right bottom -1px;
  background-size: 65%;
  border-bottom: 1px solid ${colors.orange};
  height: 5rem;
  margin-bottom: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TopTitleText = styled.h1`
  font-size: 1.2rem;
  font-weight: 300;
`;

const TopTitleTextBolded = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${colors.orange};
`;

const SearchResultContainer = styled.div``;

const Box = styled.div`
  padding: 0.5rem 0;
  border-bottom: 0.5px solid ${colors.orange};
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: ${colors.lightgrey_3};
  }
`;

const TopBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
`;

const TopBarSpan = styled.span`
  font-size: 0.7rem;
  font-weight: 300;
  color: ${colors.lightgrey_4};
`;

const DetailsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem 0.8rem;
  position: relative;
  overflow: hidden;
`;

const LeftContainer = styled.div`
  width: 60%;
`;

const JobPositionTitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 700;
`;

const CompanyNameTitle = styled.h1`
  font: 100.3rem;
  font-weight: 300;
  margin-bottom: 2rem;
`;

const InformationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PairInformationContainer = styled.div`
  display: flex;
  align-items: center;
`;

const InformationText = styled.span`
  font-size: 1rem;
  font-weight: 300;
  margin-left: 8px;
`;

const SalaryIcon = styled(DollarCircleOutlined)`
  font-size: 1.4rem;
  color: ${colors.orange};
`;

const LocationIcon = styled(EnvironmentOutlined)`
  font-size: 1.4rem;
  color: ${colors.orange};
`;

const RightContainer = styled.div`
  width: 40%;
  display: flex;
  justify-content: end;
  align-items: center;
`;

const ImageContainer = styled.div`
  width: 50%;
  height: 50%;
  border: 3px solid ${colors.lightgrey_3};
  border-radius: 8px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NotFoundContainer = styled.div`
  height: 68vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchResults = ({ result }) => {
  const router = useRouter();

  const displaySalary = (min, max) => {
    if (min === max) {
      return <InformationText>{min} THB</InformationText>;
    }

    return (
      <InformationText>
        {min} - {max} THB
      </InformationText>
    );
  };

  const redirectHandler = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <Container>
      <TopBar>
        <TopTitleText>
          พบ <TopTitleTextBolded>{result.length}</TopTitleTextBolded> ตำแหน่งงาน
        </TopTitleText>
      </TopBar>
      <SearchResultContainer>
        {result.length === 0 && (
          <NotFoundContainer>
            <Empty description="ไม่พบตำแหน่งงานที่คุณค้นหา" />
          </NotFoundContainer>
        )}
        {result.length > 0 &&
          result.map((job, index) => (
            <Box key={job._id} onClick={() => redirectHandler(job._id)}>
              <TopBarContainer>
                <TopBarSpan>{index + 1}</TopBarSpan>
                <TopBarSpan>{moment(job._source.createdAt).format("DD MMM yyyy")}</TopBarSpan>
              </TopBarContainer>
              <DetailsContainer>
                <LeftContainer>
                  <JobPositionTitle>{job._source.position}</JobPositionTitle>
                  <CompanyNameTitle>{job._source.company.companyName}</CompanyNameTitle>
                  <InformationContainer>
                    <PairInformationContainer>
                      <SalaryIcon />
                      {displaySalary(job._source.salary.min, job._source.salary.max)}
                    </PairInformationContainer>
                    <PairInformationContainer>
                      <LocationIcon />
                      <InformationText>
                        {job._source.location.district}
                        {", "}
                        {job._source.location.province}
                      </InformationText>
                    </PairInformationContainer>
                  </InformationContainer>
                </LeftContainer>
                <RightContainer>
                  <ImageContainer>
                    <Image src={job._source.company.image.url} />
                  </ImageContainer>
                </RightContainer>
              </DetailsContainer>
            </Box>
          ))}
      </SearchResultContainer>
    </Container>
  );
};

export default SearchResults;
