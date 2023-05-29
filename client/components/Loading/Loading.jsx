import colors from "@/constant/colors";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";
import styled from "styled-components";

const LoadingContainer = styled.div`
  position: absolute;
  z-index: 150;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  background-color: ${colors.white};
`;

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 6rem;
  color: ${colors.orange};
`;

const Loading = () => {
  return (
    <LoadingContainer>
      <LoadingIcon />
    </LoadingContainer>
  );
};

export default Loading;
