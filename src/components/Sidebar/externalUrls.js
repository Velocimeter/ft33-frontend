import { ReactComponent as ForumIcon } from "../../assets/icons/forum.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as FeedbackIcon } from "../../assets/icons/feedback.svg";
import { SvgIcon } from "@material-ui/core";

const externalUrls = [
  {
    title: "Docs",
    url: "https://docs.friendtech33.xyz/",
    icon: <SvgIcon color="primary" component={DocsIcon} style={{ fill: "none" }} />,
  },
  {
    title: "Governance",
    url: "https://snapshot.org/#/friendtech33.eth",
    icon: <SvgIcon color="primary" component={GovIcon} style={{ fill: "none" }} />,
  },
];

export default externalUrls;
