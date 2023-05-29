import colors from "@/constant/colors";
import { CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Empty, Popconfirm } from "antd";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import applicationsGql from "../../gql/applications";
import { toast } from "react-toastify";

const ListContainer = styled.div`
  padding: 0.5rem 1rem;
`;

const ApplicationBox = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid ${colors.orange};
  display: flex;
  align-items: end;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: ${colors.lightgrey_3};
  }

  &:hover > div:first-child {
    transform: translateY(50px);
  }
`;

const LeftContainer = styled.div`
  width: 70%;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${colors.black_1};

  &:hover {
    text-decoration: underline;
    color: ${colors.orange};
  }
`;

const JobTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const InformationContainer = styled.div``;

const PairInformationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 300;
`;

const FullNameText = styled.span`
  font-size: 1rem;
  font-weight: 500;
  margin-left: 5px;
`;

const CreatedAtText = styled.span`
  font-size: 1rem;
  font-weight: 400;
  margin-left: 5px;
  color: ${colors.lightgrey_4};
`;

const RightContainer = styled.div`
  width: 30%;
  text-align: end;
`;

const MenuContainer = styled.div`
  position: absolute;
  top: -50px;
  right: 0;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  background-color: ${colors.black_0};
  opacity: 0.6;
  border-bottom-left-radius: 5px;
  transition: all 0.3s;
`;

const EyeIcon = styled(EyeOutlined)`
  font-size: 1.6rem;
  color: ${colors.white};
  cursor: pointer;

  &:hover {
    color: ${colors.white};
    opacity: 0.8;
  }
`;

const CheckIcon = styled(CheckCircleOutlined)`
  font-size: 1.4rem;
  color: ${colors.success};
  margin-left: 6px;
  cursor: pointer;

  &:hover {
    color: ${colors.success};
    opacity: 0.8;
  }
`;

const StatusText = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => (props.status === "WAITING" ? colors.warning : colors.success)};
`;

const NotFoundContainer = styled.div`
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ApplicationList = ({ applications }) => {
  const [updateStatus] = useMutation(applicationsGql.UPDATE_APPLICATION_STATUS);
  const [applicationsList, setApplicationsList] = useState(applications);

  const getStatusText = (status) => {
    if (status === "WAITING") {
      return "กำลังรอดำเนินการ";
    } else if (status === "RECEIVED") {
      return "ได้รับแล้ว";
    } else {
      return "";
    }
  };

  const checkApplicationHandler = (applicationId) => {
    updateStatus({
      variables: {
        updateApplicationStatusId: applicationId,
      },
      onCompleted: (res) => {
        toast(res.updateApplicationStatus.msg);
        const updatedApplications = applicationsList.map((application) => {
          if (application._id === applicationId) {
            return {
              ...application,
              status: "RECEIVED",
            };
          }
          return application;
        });
        setApplicationsList(updatedApplications);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <ListContainer>
      {applications.length === 0 && (
        <NotFoundContainer>
          <Empty description="ไม่พบการสมัครงาน" />
        </NotFoundContainer>
      )}
      {applicationsList.map((application) => (
        <ApplicationBox key={application._id}>
          <MenuContainer>
            <Link href={`/applications/${application._id}`} target="_blank">
              <EyeIcon />
            </Link>
            {application.status === "WAITING" && (
              <Popconfirm
                placement="topLeft"
                title={`คุณต้องการที่จะเปลี่ยนสถานะเป็น "ได้รับแล้ว" หรือไม่`}
                onConfirm={() => checkApplicationHandler(application._id)}
                okText="ยืนยัน"
                cancelText="ไม่">
                <CheckIcon />
              </Popconfirm>
            )}
          </MenuContainer>
          <LeftContainer>
            <StyledLink href={`/jobs/${application.job._id}`}>
              <JobTitle>{application.job.position}</JobTitle>
            </StyledLink>
            <InformationContainer>
              <PairInformationContainer>
                <Label>สมัครเมื่อ</Label>
                <CreatedAtText>{moment(application.createdAt).format("DD MMM yyyy")}</CreatedAtText>
              </PairInformationContainer>
            </InformationContainer>
          </LeftContainer>
          <RightContainer>
            <StatusText status={application.status}>{getStatusText(application.status)}</StatusText>
          </RightContainer>
        </ApplicationBox>
      ))}
    </ListContainer>
  );
};

export default ApplicationList;
