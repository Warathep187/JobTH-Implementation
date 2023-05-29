import colors from "@/constant/colors";
import { Divider } from "antd";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const Menu = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  justify-content: end;
`;

const MenuItem = styled.div`
  border-radius: 5px;
  background-color: transparent;
  padding: 5px 15px;

  &:hover {
    background-color: ${colors.lightgrey_1};
  }

  &:not(:last-child) {
    margin-right: 15px;
  }

  & a {
    text-decoration: none;
    color: ${colors.black_1};
    cursor: pointer;
    font-size: 1rem;
  }
`;

const CompanyMenu = () => {
  return (
    <Menu>
      <MenuItem>
        <Link href="/auth/resumes/login">เข้าสู่ระบบ</Link>
      </MenuItem>
    </Menu>
  );
};

export default CompanyMenu;
