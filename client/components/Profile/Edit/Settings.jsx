import colors from "@/constant/colors";
import profileGql from "@/gql/profile";
import { useMutation } from "@apollo/client";
import { Switch } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

const Container = styled.div`
  background-color: ${colors.white};
  padding: 3rem 5rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
`;

const FormContainer = styled.div`
  width: 80%;
  margin: 0 auto;
`;

const InputWrapper = styled.div`
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: 1rem;
`;

const Settings = ({ settings }) => {
  const [updateSetting] = useMutation(profileGql.UPDATE_SETTING);
  const [mySettings, setMySettings] = useState(settings);

  const settingChangeHandler = (setting) => {
    updateSetting({
      variables: {
        input: {
          canViewEducation: !mySettings[setting],
        },
      },
      onCompleted: (res) => {
        toast(res.updateSetting.msg);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    setMySettings({
      ...mySettings,
      [setting]: !mySettings[setting],
    });
  };

  return (
    <Container>
      <Title>ตั้งค่า</Title>
      <FormContainer>
        <InputWrapper>
          <Label>บริษัทสามารถดูประวัติการศึกษาได้</Label>
          <Switch
            size="small"
            checked={mySettings.canViewEducation}
            onChange={() => settingChangeHandler("canViewEducation")}
          />
        </InputWrapper>
      </FormContainer>
    </Container>
  );
};

export default Settings;
