import { Collapse, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const P = styled.div`
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const QAs = [
  {
    q: "What is FTW DAO?",
    a: (
      <>
        <P>
          FTW DAO is a decentralized reserve currency protocol based on the FTW token. FTW protocol was inspired
          by OlympusDAO.
        </P>
        <P>
          Each FTW is backed by a basket of assets (e.g. ETH) in the FTW treasury, giving the token an intrinsic
          value that it should not fall below.
        </P>
        <P>FTW DAO will leverage similar staking and bonding dynamics of OlympusDAO.</P>
      </>
    ),
  },
  {
    q: "What is FTW DAO's mission?",
    a: (
      <>
        <P>FTW DAO has two main missions.</P>
        <ul>
          <li>
            <P>
              First is to be as fair a launch as possible and to include anyone that is interested in taking part,
              regardless of their monetary position and connections. The auctions are also spread out over several days,
              spanning all time zones, so that everyone anywhere can take part.
            </P>
          </li>
          <li>
            <P>
              Secondly, it aims to attempt to influence the mindsets of people's connection to pricing everything in
              USDs. Instead, we hope that through FTW DAO people might start to value things in terms of ETH.
            </P>
          </li>
        </ul>
      </>
    ),
  },
  {
    q: "What is the purpose of the NFT auction?",
    a: (
      <P>
        This NFT auction is designed as a bootstrapping system that anyone can participate in. All protocols need
        initial capital for liquidity pools. The choice is usually to either take on board investors or to seek
        investment from the ecosystem in a crowdfunding manner; but we have elected to sell NFTs to raise the funds for
        our initial LPs. FTW NFTs will be infused with FTW tokens.
      </P>
    ),
  },
  {
    q: "What do I get if I win an auction?",
    a: (
      <P>
        Winners of an auction get the NFT art work, and voting right on the protocol. There is no more bootstrapping
        incentive to bid and win. For more info check
        <Link href="https://FTW-dao.gitbook.io/FTWdao/nft-auctions/nft-bootstrap-auctions"> here</Link>.
      </P>
    ),
  },
  {
    q: "How long is the auction?",
    a: (
      <P>
        In the first 24 hour, 24 NFTs will be auctioned, 1 every hour. Thereafter, the time will change to be 1 NFT
        auctioned every 2 hours. This time frame was chosen to help make this possibility fair for everyone, everywhere,
        regardless of their timezone. We definitely want to avoid a gas war.
      </P>
    ),
  },
  {
    q: "Why several artists?",
    a: (
      <P>
        Several artists were commissioned to produce art for these auctions. We decided to do this so we can showcase
        and have a positive effect on multiple artists instead of 1. As an additional benefit, we hope that by having
        several artists, and therefore more styles, we will be able to accommodate everyone's tastes.
      </P>
    ),
  },
  {
    q: "What is the FTW token?",
    a: (
      <P>
        FTW is a token that is designed to grow in values versus the value of ETH. So, as ETH grows in value, FTW
        should grow in value faster. Every FTW is backed by at least 1 ETH. However, through the accumulation of
        income-generating assets in the FTW treasury, FTW can reach valuations well beyond that of ETH
      </P>
    ),
  },
  {
    q: "What is a FTW capsule?",
    a: (
      <>
        <P>
          The FTW capsule (bond) is the mechanic we use to raise select assets, such as ETH or FTW-ETH LPs, for the
          treasury. Users that want to purchase FTW, should first check if they can get a discount by buying a
          capsule, and if not purchase from LP. When users purchase capsules the FTW they are owed are vested linearly
          over several days. In most cases it's better to purchase a capsule than to buy FTW from the market, but
          there can be times when the market is trading at a price lower than the capsules.
        </P>
        <P>
          The main benefit of a capsule is price consistency. Users that purchase capsules commit capital upfront, and
          will receive a predetermined amount of FTW as the capsules hatch. A capsule's profit would depend on FTW
          price when the capsule fully hatches. Capsules benefit from a rising or static FTW price.
        </P>
      </>
    ),
  },
  {
    q: "What is FTW Hibernation?",
    a: (
      <P>
        Usually, the best use of FTW is to put it into hibernation. FTW that is in this state will be joined by more
        and more FTW. These additional FTW come from supply growth. The protocol mints new FTW tokens from the
        treasury, the majority of which are distributed to the hibernating FTW. Thus, the gain for hibernators will
        come from their auto-compounding balances.
      </P>
    ),
  },
  {
    q: "FTW is backed, not pegged.",
    a: (
      <>
        <P>
          Each FTW is backed by 1 ETH (or 1ETH in equivalent value), not pegged to it. Because the treasury backs
          every FTW with at least 1 ETH, the protocol would buy back and burn FTW when it trades below 1 ETH. This
          has the effect of pushing FTW price back up to 1 ETH. FTW could always trade above 1 ETH because there is
          no upper limit imposed by the protocol.
        </P>
        <P>Think pegged == 1, while backed {">"}= 1.</P>
        <P>
          You might say that the FTW floor price or intrinsic value is 1 ETH. We believe that the actual price will
          always be 1 ETH + premium, but in the end that is up to the market to decide.
        </P>
      </>
    ),
  },
  {
    q: "Who created FTW DAO?",
    a: <P>Anons</P>,
  },
  {
    q: "Who runs FTW DAO?",
    a: (
      <P>
        No one. FTW is DAO-governed. All decisions are formed by community members on the forum and made by token
        holders through snapshot voting.
      </P>
    ),
  },
];

const FAQ: React.FC = () => {
  return (
    <Wrapper>
      <Typography style={{ fontSize: "2rem" }}>FAQ</Typography>
      <FaqList>
        {QAs.map((qa, idx) => (
          <QA q={qa.q} a={qa.a} key={idx} />
        ))}
      </FaqList>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8rem;
`;

const FaqList = styled(List)``;

const QA: React.FC<{ q: string; a: React.ReactNode }> = ({ q, a }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <ListItem button onClick={() => setExpanded(!expanded)}>
        <Q disableTypography primary={q} />
        <ListItemIcon style={{ minWidth: "unset" }}>{expanded ? <RemoveIcon /> : <AddIcon />}</ListItemIcon>
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ListItem>
          <A>{a}</A>
        </ListItem>
      </Collapse>
    </>
  );
};

const FaqItem = styled(ListItem)`
  display: flex;
`;

const Q = styled(ListItemText)`
  font-size: 1.5rem;
`;

const A = styled(ListItemText)`
  font-size: 1rem;
  color: #c1c3cb;
`;

export default FAQ;
