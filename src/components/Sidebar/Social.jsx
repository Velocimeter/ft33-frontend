import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faDiscord, faGithub, faReddit } from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";

export default function Social() {
  return (
    <div className="social-row">
      <Link href="https://twitter.com/friendtech33" target="_blank">
        <SvgIcon color="primary" component={Twitter} />
      </Link>
      <Link href="https://discord.gg/WBE8B5PC" target="_blank">
        <Icon icon={faDiscord} size="1x" />
      </Link>
    </div>
  );
}

const Icon = styled(FontAwesomeIcon)`
  color: black;
  font-size: 16px;

  &:hover {
    color: black;
  }
`;
