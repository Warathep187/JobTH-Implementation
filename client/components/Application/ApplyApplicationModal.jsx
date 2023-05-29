import applicationsGql from "@/gql/applications";
import resizeImage from "@/utils/base64Image";
import { useMutation } from "@apollo/client";
import { Button, Input, Modal, Upload } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.7rem;
  font-weight: 600;
`;

const FormContainer = styled.div`
  padding: 0 1rem;
  width: 70%;
  margin: 0 auto;
`;

const InputGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div``;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 300;
`;

const ButtonContainer = styled.div`
  text-align: end;
`;

const ApplyApplicationModal = ({ jobId, modalOpen, onSetModalOpen }) => {
  const [createNewApplication, { loading }] = useMutation(applicationsGql.CREATE_NEW_APPLICATION);
  const [contact, setContact] = useState({
    email: "",
    tel: "",
  });
  const [resume, setResume] = useState(null);

  const contactChangeHandler = (e) => {
    const { name, value } = e.target;
    setContact({
      ...contact,
      [name]: value,
    });
  };

  const resumeChangeHandler = async (e) => {
    const file = e.target.files[0];

    const base64Image = await resizeImage(file);
    setResume(base64Image);
  };

  const submitHandler = () => {
    createNewApplication({
      variables: {
        input: {
          contact,
          resume,
          jobId,
        },
      },
      onCompleted: (res) => {
        toast(res.createNewApplication.msg);
        setContact({
          email: "",
          tel: "",
        });
        setResume(null);
        onSetModalOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Modal
      title={<Title>ส่ง Resume ของคุณมาได้เลย!!</Title>}
      centered
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      open={modalOpen}
      onCancel={() => onSetModalOpen(false)}>
      <FormContainer>
        <InputGroup>
          <Label>Resume</Label>
          <InputWrapper>
            <Input type="file" onChange={resumeChangeHandler} accept="image/*" />
          </InputWrapper>
        </InputGroup>
        <InputGroup>
          <Label>อีเมลติดต่อ</Label>
          <InputWrapper>
            <Input
              size="large"
              placeholder="อีเมลติดต่อ"
              name="email"
              onChange={contactChangeHandler}
              value={contact.email}
            />
          </InputWrapper>
        </InputGroup>
        <InputGroup>
          <Label>เบอร์โทรติดต่อ</Label>
          <InputWrapper>
            <Input
              size="large"
              placeholder="xxx-xxx-xxxx"
              name="tel"
              onChange={contactChangeHandler}
              value={contact.tel}
            />
          </InputWrapper>
        </InputGroup>
        <ButtonContainer>
          <Button size="large" disabled={loading} onClick={submitHandler}>
            {loading ? "กำลังส่ง": "ส่ง"}
          </Button>
        </ButtonContainer>
      </FormContainer>
    </Modal>
  );
};

export default ApplyApplicationModal;
