import { useMutation } from "@apollo/client";
import authGql from "@/gql/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import colors from "@/constant/colors";
import { Button } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import Head from "next/head";

const Container = styled.div`
  height: 89vh;
  position: relative;
`;

const Box = styled.div`
  transform: translate(-50%, -50%);
  position: absolute;
  top: 35%;
  left: 50%;
  border-radius: 15px;
  border: 0.5px solid ${colors.lightgrey_3};
  box-shadow: 1rem 1rem 2rem ${colors.lightgrey_3};
  width: 35rem;
  height: 15rem;
  padding: 3rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StatusText = styled.h1`
  font-size: 2rem;
  font-weight: 300;
  text-align: center;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const VerifyPage = () => {
  const [verify] = useMutation(authGql.JOB_SEEKER_VERIFY_ACCOUNT);
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("Verifying..");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyId = router.query.verifyId;
    if (verifyId) {
      verify({
        variables: {
          input: {
            token: verifyId,
          },
        },
        onCompleted: (res) => {
          setStatusMessage(res.jobSeekerVerifyAccount.msg);
          setIsVerified(true);
        },
        onError: (error) => {
          setStatusMessage(error.message);
        },
      });
    }
  }, [router]);

  const redirect = () => {
    if (isVerified) {
      router.replace("/auth/resumes/login");
    } else {
      router.replace("/auth/resumes/create");
    }
  };

  return (
    <>
      <Head>
        <title>JobTH - อัปเดตงานคุณภาพทุกวัน</title>
      </Head>
      <Container>
        <Box>
          <StatusText>{statusMessage}</StatusText>
          <StyledButton size="large" icon={<DoubleRightOutlined />} onClick={redirect}>
            {isVerified ? "ลงชื่อเข้าใช้" : "สมัครมาชิก"}
          </StyledButton>
        </Box>
      </Container>
    </>
  );
};

export default VerifyPage;
