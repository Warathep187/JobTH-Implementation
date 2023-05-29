import { EditOutlined, LockOutlined, SettingOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";

const menuItems = [
  {
    label: <Link href="/profile/resumes">โปรไฟล์</Link>,
    key: "profile",
    icon: <UserOutlined />,
  },
  {
    label: <Link href="/profile/resumes/basic-information">แก้ไขข้อมูลทั่วไป</Link>,
    key: "basic",
    icon: <EditOutlined />,
  },
  {
    label: <Link href="/profile/resumes/education">แก้ไขประวัติการศึกษา</Link>,
    key: "education",
    icon: <SolutionOutlined />,
  },
  {
    label: <Link href="/profile/resumes/password">เปลี่ยนรหัสผ่าน</Link>,
    key: "password",
    icon: <LockOutlined />,
  },
  {
    label: <Link href="/profile/resumes/settings">ตั้งค่า</Link>,
    key: "settings",
    icon: <SettingOutlined />,
  },
];

export default menuItems;
