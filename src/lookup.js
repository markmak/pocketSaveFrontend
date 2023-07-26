import { MdFastfood, MdOutlineBedroomParent } from "react-icons/md";
import {
  RiMoneyPoundBoxFill,
  RiMoneyPoundBoxLine,
  RiBillFill,
} from "react-icons/ri";
import { BsGraphUpArrow } from "react-icons/bs";
import { CgMoreO, CgGames } from "react-icons/cg";
import { FaCarSide, FaMoneyCheckAlt } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { MdSpaceDashboard, MdSettings } from "react-icons/md";
import { SiTarget } from "react-icons/si";

const monthLookup = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const incomeTypes = [
  "full time salary",
  "investment income",
  "part time salary",
  "others",
];
const expenseTypes = [
  "bills",
  "entertainment",
  "food",
  "investment",
  "rent",
  "tax",
  "travel",
  "others",
];
const expenseColorList = [
  "#F2DA57",
  "#F6B656",
  "#E25A42",
  "#DCBDCF",
  "#B0CBDB",
  "#B396AD",
  "#C8D7A1",
  "#E5E2E0",
];
const typeIconLookup = {
  "full time salary": <RiMoneyPoundBoxFill className="type-icon" />,
  "part time salary": <RiMoneyPoundBoxLine className="type-icon" />,
  "investment income": <BsGraphUpArrow className="type-icon" />,
  others: <CgMoreO className="type-icon" />,
  food: <MdFastfood className="type-icon" />,
  travel: <FaCarSide className="type-icon" />,
  entertainment: <CgGames className="type-icon" />,
  investment: <BsGraphUpArrow className="type-icon" />,
  tax: <GiPayMoney className="type-icon" />,
  rent: <MdOutlineBedroomParent className="type-icon" />,
  bills: <RiBillFill className="type-icon" />,
};

const sideBarPages = [
  { name: "dashboard", icon: <MdSpaceDashboard className="sidebar-icon" /> },
  { name: "target", icon: <SiTarget className="sidebar-icon" /> },
  { name: "records", icon: <FaMoneyCheckAlt className="sidebar-icon" /> },
  { name: "setting", icon: <MdSettings className="sidebar-icon" /> },
];
const templateRequireList = ["templateName", "recordType", "type"];
const recordRequireList = ["recordType", "date", "name", "type", "amount"];
const filterKeys = ["startDate", "endDate", "recordType", "type", "name"];

const baseURL = "https://api.pocketsave.co.uk/api/v1/";
const imgBaseURL = "https://api.pocketsave.co.uk/";
export {
  monthLookup,
  incomeTypes,
  expenseTypes,
  typeIconLookup,
  expenseColorList,
  sideBarPages,
  baseURL,
  imgBaseURL,
  templateRequireList,
  recordRequireList,
  filterKeys,
};
