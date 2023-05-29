import colors from "@/constant/colors";
import React from "react";
import styled from "styled-components";

const ErrorContainer = styled.div`
  position: absolute;
  z-index: 150;
  background-color: ${colors.white};
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.span`
  font-size: 1.2rem;
  color: red;
`;

const CompanyNotFoundError = ({msg}) => {
  return (
    <ErrorContainer>
      <ErrorMessage>ไม่พบบริษัท</ErrorMessage>
    </ErrorContainer>
  );
};

export default CompanyNotFoundError;
