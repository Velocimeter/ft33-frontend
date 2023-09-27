import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getDexScreenerPrice } from "src/helpers";
import { useWeb3Context } from "src/hooks";

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
