import { ERC20 } from "@usedapp/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getDexScreenerPrice } from "src/helpers";
import { useWeb3Context } from "src/hooks";

export function useMarketPrice() {
  const [marketPrice, setMarketPrice] = useState<number>();

  useEffect(() => {
    async function getMarketPrice() {
      const stableCoinPriceOfFtw = await getDexScreenerPrice("0x3347453ced85bd288d783d85cdec9b01ab90f9d8", "FTW");
      console.log(stableCoinPriceOfFtw);
      setMarketPrice(stableCoinPriceOfFtw);
    }

    getMarketPrice();
  }, []);

  return marketPrice;
}

export function useCircSupply() {
  const [circSupply, setCircSupply] = useState<number>();

  const { provider } = useWeb3Context();

  useEffect(() => {
    async function getCircSupply() {
      if (!provider) return;

      const ftwContract = new ethers.Contract("0x3347453Ced85bd288D783d85cDEC9b01Ab90f9D8", ERC20.abi, provider);
      const ftwCircSupply = await ftwContract.totalSupply();
      const ftwCircSupplyFormatted = ethers.utils.formatUnits(ftwCircSupply, 9);
      console.log(ftwCircSupplyFormatted);
      setCircSupply(+ftwCircSupplyFormatted);
    }

    getCircSupply();
  }, [provider]);

  return circSupply;
}

export function useMarketCap() {
  const [marketCap, setMarketCap] = useState<number>();
  const marketPrice = useMarketPrice();
  const circSupply = useCircSupply();

  useEffect(() => {
    if (marketPrice === undefined || circSupply === undefined) return;

    const marketCap = marketPrice * circSupply;
    setMarketCap(marketCap);
  }, [marketPrice, circSupply]);

  return marketCap;
}

export function useBackingPerOhm() {
  const circSupply = useCircSupply();
  const treasuryBalance = useTreasuryBalance();

  const backingPerOhm =
    circSupply !== undefined && treasuryBalance !== undefined ? treasuryBalance / circSupply : undefined;

  return backingPerOhm;
}

function useTreasuryBalance() {
  const [treasuryBalance, setTreasuryBalance] = useState<number>();

  const { provider } = useWeb3Context();

  useEffect(() => {
    if (!provider) return;

    const getTreasuryBalance = async () => {
      // treasury only really has dai, so hardcoded to it for now
      const daiContract = new ethers.Contract("0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", ERC20.abi, provider);
      const daiBalanceTreasury = await daiContract.balanceOf("0x68d91Bb4b1760Bc131555D23a438585D937A8e6d");
      const daiBalanceTreasuryFormatted = ethers.utils.formatEther(daiBalanceTreasury);
      // msig only really has dai, so hardcoded to it for now
      const daiBalanceMsig = await daiContract.balanceOf("0xBbE6d178d6E11189B46ff4A9f034AB198C2E8A0f");
      const daiBalanceMsigFormatted = ethers.utils.formatEther(daiBalanceMsig);
      // ft portfolio value (this is tough, no api)
      const ftPortfolioValue = 137849.3085;
      const treasuryBalance = +daiBalanceTreasuryFormatted + +daiBalanceMsigFormatted + ftPortfolioValue;
      setTreasuryBalance(treasuryBalance);
    };

    getTreasuryBalance();
  }, [provider]);

  return treasuryBalance;
}

export function useStakingTvl() {
  const [stakingTvl, setStakingTvl] = useState<number>();
  const { provider } = useWeb3Context();

  useEffect(() => {
    if (!provider) return;

    async function getTvl() {
      const stakedAmount = await getStakedAmount(provider);
      const stableCoinPriceOfFtw = await getDexScreenerPrice("0x3347453ced85bd288d783d85cdec9b01ab90f9d8", "FTW");
      const tvl = stakedAmount * stableCoinPriceOfFtw;
      setStakingTvl(tvl);
    }

    getTvl();
  }, [provider]);

  return stakingTvl;
}

async function getStakedAmount(provider: ethers.providers.JsonRpcProvider) {
  const stakingContract = new ethers.Contract("0x6f82d82e6fecb6d0daf08b8ffd9772d596582f4a", stakingAbi, provider);
  const staked = await stakingContract.contractBalance();
  return parseFloat(ethers.utils.formatUnits(staked, 9));
}

const stakingAbi = [
  {
    inputs: [
      { internalType: "address", name: "_OHM", type: "address" },
      { internalType: "address", name: "_sOHM", type: "address" },
      { internalType: "uint256", name: "_epochLength", type: "uint256" },
      { internalType: "uint256", name: "_firstEpochNumber", type: "uint256" },
      { internalType: "uint256", name: "_firstEpochTime", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipPulled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipPushed",
    type: "event",
  },
  {
    inputs: [],
    name: "OHM",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_recipient", type: "address" }],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "distributor",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "epoch",
    outputs: [
      { internalType: "uint256", name: "length", type: "uint256" },
      { internalType: "uint256", name: "number", type: "uint256" },
      { internalType: "uint256", name: "endTime", type: "uint256" },
      { internalType: "uint256", name: "distribute", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "forfeit", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "giveLockBonus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "index",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "locker",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "manager",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "pullManagement", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "address", name: "newOwner_", type: "address" }],
    name: "pushManagement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "rebase", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "renounceManagement", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "returnLockBonus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sOHM",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "enum OlympusStaking.CONTRACTS", name: "_contract", type: "uint8" },
      { internalType: "address", name: "_address", type: "address" },
    ],
    name: "setContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_warmupPeriod", type: "uint256" }],
    name: "setWarmup",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_recipient", type: "address" },
    ],
    name: "stake",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "toggleDepositLock", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "totalBonus",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "bool", name: "_trigger", type: "bool" },
    ],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "warmupContract",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "warmupInfo",
    outputs: [
      { internalType: "uint256", name: "deposit", type: "uint256" },
      { internalType: "uint256", name: "gons", type: "uint256" },
      { internalType: "uint256", name: "expiry", type: "uint256" },
      { internalType: "bool", name: "lock", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "warmupPeriod",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
