import colors from "@/constant/colors";
import { AuditOutlined, HeartOutlined, UserOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import Link from "next/link";
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
  background-color: ${(props) => (props.isCurrentPage ? `${colors.lightgrey_1}` : "transparent")};

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

const JobSeekerMenu = ({ onLogoutHandler }) => {
  return (
    <Menu>
      <MenuItem>
        <Link href="/profile/resumes">
          <UserOutlined style={{ fontSize: "15px" }} /> ประวัติส่วนตัว
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href="/applications">
          <AuditOutlined style={{ fontSize: "15px" }} /> งานที่สมัคร
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href="/jobs/favorites">
          <HeartOutlined style={{ fontSize: "15px" }} /> งานที่ถูกใจ
        </Link>
      </MenuItem>
      <Divider type="vertical" />
      <LogoutItem onClick={onLogoutHandler}>ออกจากระบบ</LogoutItem>
    </Menu>
  );
};

export default JobSeekerMenu;
