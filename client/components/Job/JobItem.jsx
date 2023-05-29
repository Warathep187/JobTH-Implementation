import colors from "@/constant/colors";
import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { DeleteOutlined, DollarOutlined, EditOutlined, EnvironmentOutlined, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Popconfirm } from "antd";
import JobInformationModal from "./JobInformationModal";

const Box = styled.div`
  width: 49.2%;
  padding: 0.5rem;
  border: 0.5px solid ${colors.lightgrey_4};
  border-radius: 5px;
  margin-bottom: 1rem;
  border-bottom: 3px solid ${colors.orange};
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    box-shadow: 0.2rem 0.2rem 0.5rem ${colors.lightgrey_3};

    & > div:first-child {
      top: 0;
    }
  }
`;

const MenuBox = styled.div`
  width: 5.5rem;
  padding: 0.5rem;
  background-color: ${colors.black_1};
  opacity: 0.5;
  border-bottom-left-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;

  position: absolute;
  top: -5rem;
  right: 0;
`;

const EyeIcon = styled(EyeOutlined)`
  font-size: 1.3rem;
  color: white;
  cursor: pointer;

  &:hover {
    color: ${colors.lightgrey_4};
  }
`;

const PenIcon = styled(EditOutlined)`
  font-size: 1.3rem;
  color: white;
  cursor: pointer;

  &:hover {
    color: ${colors.lightgrey_4};
  }
`;

const BinIcon = styled(DeleteOutlined)`
  font-size: 1.3rem;
  color: white;
  cursor: pointer;

  &:hover {
    color: ${colors.lightgrey_4};
  }
`;

const TopContainer = styled.div`
  margin-bottom: 2rem;
`;

const PositionTitle = styled.span`
  font-size: 1.3rem;
  font-weight: 400;
`;

const BottomContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
`;

const JobInfoContainer = styled.div`
  width: 70%;
`;

const PairInformationContainer = styled.div`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 0.2rem;
  }
`;

const SalaryIcon = styled(DollarOutlined)`
  font-size: 1.3rem;
  color: ${colors.orange};
`;

const LocationIcon = styled(EnvironmentOutlined)`
  font-size: 1.3rem;
  color: ${colors.orange};
`;

const InformationText = styled.span`
  font-size: 1rem;
  font-weight: 300;
  margin-left: 3px;
`;

const CreatedAtContainer = styled.div`
  width: 30%;
  text-align: end;
`;

const CreatedAtSpan = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${colors.lightgrey_4};
`;

const JobItem = ({ job, onDeleteJobHandler }) => {
  const [modalOpen, setModalOpen] = useState(false);

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

  const viewFullInformationHandler = () => {
    setModalOpen(true);
  };

  const deleteJobHandler = () => {
    onDeleteJobHandler(job._id);
  };

  return (
    <Box>
      <MenuBox>
        <EyeIcon onClick={viewFullInformationHandler} />
        <Link href={`/jobs/${job._id}/edit`}>
          <PenIcon />
        </Link>
        <Popconfirm
          placement="topRight"
          title={`คุณต้องการที่จะลบงาน ${job.position} หรือไม่`}
          onConfirm={deleteJobHandler}
          okText="ใช่"
          cancelText="ไม่">
          <BinIcon />
        </Popconfirm>
      </MenuBox>
      {job && modalOpen && <JobInformationModal job={job} modalOpen={modalOpen} onSetModalOpen={setModalOpen} />}
      <TopContainer>
        <PositionTitle>{job.position}</PositionTitle>
      </TopContainer>
      <BottomContainer>
        <JobInfoContainer>
          <PairInformationContainer>
            <SalaryIcon />
            {displaySalary(job.salary.min, job.salary.max)}
          </PairInformationContainer>
          <PairInformationContainer>
            <LocationIcon />
            <InformationText>
              {job.location.district}
              {", "}
              {job.location.province}
            </InformationText>
          </PairInformationContainer>
        </JobInfoContainer>
        <CreatedAtContainer>
          <CreatedAtSpan>{moment(job.createdAt).format("ddd-MM-yyyy")}</CreatedAtSpan>
        </CreatedAtContainer>
      </BottomContainer>
    </Box>
  );
};

export default JobItem;
