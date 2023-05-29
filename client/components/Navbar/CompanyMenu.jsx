import colors from "@/constant/colors";
import { FileOutlined, HomeOutlined, InboxOutlined } from "@ant-design/icons";
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

const LogoutItem = styled.div`
  border-radius: 5px;
  background-color: transparent;
  font-size: 1rem;
  cursor: pointer;
  padding: 5px 15px;
  color: ${colors.black_1};

  &:hover {
    background-color: ${colors.lightgrey_1};
  }
`;

const CompanyMenu = ({ onLogoutHandler }) => {
  return (
    <Menu>
      <MenuItem>
        <Link href="/profile/companies"><HomeOutlined style={{fontSize: "15px"}} />{" "}ข้อมูลบริษัท</Link>
      </MenuItem>
      <MenuItem>
        <Link href="/jobs"><FileOutlined style={{fontSize: "15px"}} />{" "}งานที่รับสมัคร</Link>
      </MenuItem>
      <MenuItem>
        <Link href="/applications/inbox"><InboxOutlined style={{fontSize: "18px"}} />{" "}การสมัคร</Link>
      </MenuItem>
      <Divider type="vertical" />
      <LogoutItem onClick={onLogoutHandler}>ออกจากระบบ</LogoutItem>
    </Menu>
  );
};

export default CompanyMenu;
