import colors from "@/constant/colors";
import { DeleteOutlined, DollarCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const Box = styled.div`
  border-bottom: 0.5px solid ${colors.orange};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.8rem 0.8rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: ${colors.lightgrey_3};
  }

  &:hover > div:first-child {
    transform: translateY(60px);
  }
`;

const LeftContainer = styled.div`
  width: 60%;
`;

const JobPositionTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
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

const OptionsContainer = styled.div`
  position: absolute;
  top: -60px;
  right: 0px;
  padding: 5px;
  border-bottom-left-radius: 10px;
  background-color: ${colors.black_1};
  opacity: 0.7;
  transition: all 0.4s;
  z-index: 100;
`;

const BinIcon = styled(DeleteOutlined)`
  font-size: 1.4rem;
  color: white;
  cursor: pointer;

  &:hover {
    color: ${colors.lightgrey_4};
  }
`;

const FavoriteJobItem = ({ job, onRemoveFavoriteJobHandler }) => {
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

  const redirectHandler = () => {
    router.push(`/jobs/${job.jobId._id}`);
  };

  return (
    <Box onClick={redirectHandler}>
      <OptionsContainer>
        <BinIcon
          onClick={(e) => {
            e.stopPropagation();
            onRemoveFavoriteJobHandler(job.jobId._id);
          }}
        />
      </OptionsContainer>
      <LeftContainer>
        <JobPositionTitle>{job.jobId.position}</JobPositionTitle>
        <CompanyNameTitle>{job.jobId.company.companyName}</CompanyNameTitle>
        <InformationContainer>
          <PairInformationContainer>
            <SalaryIcon />
            {displaySalary(job.jobId.salary.min, job.jobId.salary.max)}
          </PairInformationContainer>
          <PairInformationContainer>
            <LocationIcon />
            <InformationText>
              {job.jobId.location.district}
              {", "}
              {job.jobId.location.province}
            </InformationText>
          </PairInformationContainer>
        </InformationContainer>
      </LeftContainer>
      <RightContainer>
        <ImageContainer>
          <Image src={job.jobId.company.image.url} />
        </ImageContainer>
      </RightContainer>
    </Box>
  );
};

export default FavoriteJobItem;
