import { ERC20 } from "@usedapp/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getDexScreenerPrice } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { Weather } from "./ftResponse";

const BVM_ADDRESS = "0xd386a121991e51eab5e3433bf5b1cf4c8884b47a";
const FTW_ADDRESS = "0x3347453ced85bd288d783d85cdec9b01ab90f9d8";
const DAI_ADDRESS = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb";
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
const FTW_DAI_ADDRESS = "0x7B809866EAA8137D902f83bF7CbE77B41D0Df70c";
const FTW_DAI_GAUGE_ADDRESS = "0x108ef56f5146a060c847bb1a7755beb24eec4bd8";
const BVM_WETH_ADDRESS = "0x53713F956A4DA3F08B55A390B20657eDF9E0897B";
const BVM_WETH_GAUGE_ADDRESS = "0x3f5129112754d4fbe7ab228c2d5e312b2bc79a06";
const MSIG_ADDRESS = "0xBbE6d178d6E11189B46ff4A9f034AB198C2E8A0f";
const HOT_WALLET_ADDRESS = "0x1a6c20D8DDAf118F4d96BB074Fa5170b667399cC";
const TRASURY_ADDRESS = "0x68d91Bb4b1760Bc131555D23a438585D937A8e6d";
const ROUTER_ADDRESS = "0xE11b93B61f6291d35c5a2beA0A9fF169080160cF";
const STAKING_ADDRESS = "0x6f82d82e6fecb6d0daf08b8ffd9772d596582f4a";

export function useMarketPrice(tokenAddress = FTW_ADDRESS, tokenSymbol = "FTW") {
  const [marketPrice, setMarketPrice] = useState<number>();

  useEffect(() => {
    async function getMarketPrice() {
      const stableCoinPriceOfFtw = await getDexScreenerPrice(tokenAddress, tokenSymbol);
      setMarketPrice(stableCoinPriceOfFtw);
    }

    getMarketPrice();
  }, [tokenAddress, tokenSymbol]);

  return marketPrice;
}

export function useCircSupply() {
  const [circSupply, setCircSupply] = useState<number>();

  const { provider } = useWeb3Context();

  useEffect(() => {
    async function getCircSupply() {
      if (!provider) return;

      const ftwContract = new ethers.Contract(FTW_ADDRESS, ERC20.abi, provider);
      const ftwCircSupply = await ftwContract.totalSupply();
      const ftwCircSupplyFormatted = ethers.utils.formatUnits(ftwCircSupply, 9);
      setCircSupply(+ftwCircSupplyFormatted);
    }

    getCircSupply();
  }, [provider]);

  return circSupply;
}

export function useMarketCap() {
  const marketPrice = useMarketPrice();
  const circSupply = useCircSupply();

  const marketCap = marketPrice !== undefined && circSupply !== undefined ? marketPrice * circSupply : undefined;

  return marketCap;
}

export function useBackingPerOhm() {
  const circSupply = useCircSupply();
  const totalReserves = useTotalReserves();

  const backingPerOhm =
    circSupply !== undefined && totalReserves !== undefined ? totalReserves.totalReserve / circSupply : undefined;

  return backingPerOhm;
}

export function useTreasuryReserves() {
  const [treasuryBalance, setTreasuryBalance] = useState<number>();

  const { provider } = useWeb3Context();

  useEffect(() => {
    if (!provider) return;

    const getTreasuryBalance = async () => {
      // ftw_dai lp reserve
      const pairContract = new ethers.Contract(
        FTW_DAI_ADDRESS,
        [
          "function getAmountOut(uint amountIn, address tokenIn) external view returns (uint)",
          "function balanceOf(address owner) view returns (uint balance)",
        ],
        provider,
      );
      const routerContract = new ethers.Contract(
        ROUTER_ADDRESS,
        [
          "function quoteRemoveLiquidity(address tokenA, address tokenB, bool stable, uint liquidity) external view returns (uint amountA, uint amountB)",
        ],
        provider,
      );
      const ftwDaiBalanceTreasury = await pairContract.balanceOf(TRASURY_ADDRESS);
      const amountsOut = await routerContract.quoteRemoveLiquidity(
        FTW_ADDRESS,
        DAI_ADDRESS,
        false,
        ftwDaiBalanceTreasury,
      );
      const ftwDaiReserve = +ethers.utils.formatUnits(amountsOut[1], 18);

      // dai reserve
      const daiContract = new ethers.Contract(DAI_ADDRESS, ERC20.abi, provider);

      const daiBalanceTreasury = await daiContract.balanceOf(TRASURY_ADDRESS);
      const daiBalanceTreasuryFormatted = ethers.utils.formatEther(daiBalanceTreasury);

      setTreasuryBalance(+daiBalanceTreasuryFormatted + ftwDaiReserve);
    };

    getTreasuryBalance();
  }, [provider]);

  return treasuryBalance;
}

export function useMsigReserves() {
  const [treasuryBalance, setTreasuryBalance] = useState<number>();

  const { provider } = useWeb3Context();

  const wethPrice = useMarketPrice(WETH_ADDRESS, "WETH");

  useEffect(() => {
    if (!provider || wethPrice === undefined) return;

    const getTreasuryBalance = async () => {
      // treasury only really has dai, so hardcoded to it for now
      const daiContract = new ethers.Contract(DAI_ADDRESS, ERC20.abi, provider);
      const wethContract = new ethers.Contract(WETH_ADDRESS, ERC20.abi, provider);

      // msig only really has dai, so hardcoded to it for now
      const daiBalanceMsig = await daiContract.balanceOf(MSIG_ADDRESS);
      const daiBalanceMsigFormatted = ethers.utils.formatEther(daiBalanceMsig);

      const wethBalanceMsig = await wethContract.balanceOf(MSIG_ADDRESS);
      const wethBalanceMsigFormatted = ethers.utils.formatEther(wethBalanceMsig);

      setTreasuryBalance(+daiBalanceMsigFormatted + +wethBalanceMsigFormatted * wethPrice);
      console.log("wethprice", wethPrice);
    };

    getTreasuryBalance();
  }, [provider, wethPrice]);

  return treasuryBalance;
}

export function useHotWalletReserves() {
  const [treasuryBalance, setTreasuryBalance] = useState<number>();

  const { provider } = useWeb3Context();

  const wethPrice = useMarketPrice(WETH_ADDRESS, "WETH");

  useEffect(() => {
    if (!provider || wethPrice === undefined) return;

    const getTreasuryBalance = async () => {
      // treasury only really has dai, so hardcoded to it for now
      const daiContract = new ethers.Contract(DAI_ADDRESS, ERC20.abi, provider);
      const wethContract = new ethers.Contract(WETH_ADDRESS, ERC20.abi, provider);

      // ft wallet dai balance
      const daiBalanceFtWallet = await daiContract.balanceOf(HOT_WALLET_ADDRESS);
      const daiBalanceFtWalletFormatted = ethers.utils.formatEther(daiBalanceFtWallet);

      const ethBalance = await provider.getBalance(HOT_WALLET_ADDRESS);
      const ethBalanceFormatted = ethers.utils.formatEther(ethBalance);

      const wethBalanceFtWallet = await wethContract.balanceOf(HOT_WALLET_ADDRESS);
      const wethBalanceFtWalletFormatted = ethers.utils.formatEther(wethBalanceFtWallet);

      const ethValue = +ethBalanceFormatted * wethPrice;
      const wethValue = +wethBalanceFtWalletFormatted * wethPrice;

      setTreasuryBalance(+daiBalanceFtWalletFormatted + ethValue + wethValue);
    };

    getTreasuryBalance();
  }, [provider, wethPrice]);

  return treasuryBalance;
}
export function useFtKeysValue() {
  const [treasuryBalance, setTreasuryBalance] = useState<number>();

  const { provider } = useWeb3Context();

  const wethPrice = useMarketPrice(WETH_ADDRESS, "WETH");

  useEffect(() => {
    if (!provider || wethPrice === undefined) return;

    const getTreasuryBalance = async () => {
      const res = await fetch("https://preview.frenfren.pro/api/users/0x1a6c20D8DDAf118F4d96BB074Fa5170b667399cC");
      const data = (await res.json()) as Weather;
      const ftPortfolioEth = data.portfolio.liquidation;

      const ftPortfolioValue = ftPortfolioEth * wethPrice;

      setTreasuryBalance(ftPortfolioValue);
    };

    getTreasuryBalance();
  }, [provider, wethPrice]);

  return treasuryBalance;
}

export function usePol() {
  const [treasuryBalance, setTreasuryBalance] = useState<{ polMarket: number; polReserve: number }>();

  const ftwDaiPol = usePolFtwDai();
  // const daiWethPol = usePolDaiWeth();
  const daiWethPol = 67000;
  const bvmWethPol = usePolBvmWeth();
  const ftwFt33Pol = {
    ftwFt33PolMarket: 14560,
    ftwFt33PolReserve: 7280,
  };
  console.log("dai-ftw", ftwDaiPol);
  console.log("dai-weth", daiWethPol);
  console.log("bvm-weth", bvmWethPol);
  
  console.log("ftw-ft33", ftwFt33Pol.ftwFt33PolReserve);

  useEffect(() => {
    if (ftwDaiPol?.ftwDaiPolMarket === undefined || daiWethPol === undefined || bvmWethPol === undefined) return;

    const polMarket = ftwDaiPol?.ftwDaiPolMarket + daiWethPol + bvmWethPol + ftwFt33Pol.ftwFt33PolMarket;
    const polReserve = ftwDaiPol?.ftwDaiPolReserve + daiWethPol + bvmWethPol + ftwFt33Pol.ftwFt33PolReserve;
    setTreasuryBalance({ polMarket, polReserve });
  }, [bvmWethPol, daiWethPol, ftwDaiPol, ftwFt33Pol.ftwFt33PolMarket, ftwFt33Pol.ftwFt33PolReserve]);

  return treasuryBalance;
}

export function usePolFtwDai() {
  const [treasuryBalance, setTreasuryBalance] = useState<{ ftwDaiPolMarket: number; ftwDaiPolReserve: number }>();

  const { provider } = useWeb3Context();

  const ftwPrice = useMarketPrice();

  useEffect(() => {
    if (!provider || ftwPrice === undefined) return;

    const getTreasuryBalance = async () => {
      // lp value
      const pairContract = new ethers.Contract(
        FTW_DAI_ADDRESS,
        [
          "function getAmountOut(uint amountIn, address tokenIn) external view returns (uint)",
          "function balanceOf(address owner) view returns (uint balance)",
        ],
        provider,
      );
      const gaugeContract = new ethers.Contract(
        FTW_DAI_GAUGE_ADDRESS,
        ["function balanceOf(address owner) view returns (uint balance)"],
        provider,
      );
      const routerContract = new ethers.Contract(
        ROUTER_ADDRESS,
        [
          "function quoteRemoveLiquidity(address tokenA, address tokenB, bool stable, uint liquidity) external view returns (uint amountA, uint amountB)",
        ],
        provider,
      );

      const lpBalanceMsigInGauge = await gaugeContract.balanceOf(MSIG_ADDRESS);
      const lpBalanceMsigInWallet = await pairContract.balanceOf(MSIG_ADDRESS);

      const lpBalanceMsig = lpBalanceMsigInGauge.add(lpBalanceMsigInWallet);

      const amountsOut = await routerContract.quoteRemoveLiquidity(FTW_ADDRESS, DAI_ADDRESS, false, lpBalanceMsig);

      const beefyFtwDaiHardcoded = 80000;

      const lpMarket =
        +ethers.utils.formatUnits(amountsOut[0], 9) * ftwPrice +
        +ethers.utils.formatUnits(amountsOut[1], 18) +
        beefyFtwDaiHardcoded;

      const lpReserve = +ethers.utils.formatUnits(amountsOut[1], 18) + beefyFtwDaiHardcoded / 2;

      setTreasuryBalance({
        ftwDaiPolMarket: lpMarket,
        ftwDaiPolReserve: lpReserve,
      });
    };

    getTreasuryBalance();
  }, [ftwPrice, provider]);

  return treasuryBalance;
}

export function usePolDaiWeth() {
  const [treasuryBalance, setTreasuryBalance] = useState<number>();

  const { provider } = useWeb3Context();

  const wethPrice = useMarketPrice(WETH_ADDRESS, "WETH");

  useEffect(() => {
    if (!provider || wethPrice === undefined) return;

    const getTreasuryBalance = async () => {
      // lp value
      const pairContract = new ethers.Contract(
        FTW_DAI_ADDRESS,
        [
          "function getAmountOut(uint amountIn, address tokenIn) external view returns (uint)",
          "function balanceOf(address owner) view returns (uint balance)",
        ],
        provider,
      );
      const gaugeContract = new ethers.Contract(
        FTW_DAI_GAUGE_ADDRESS,
        ["function balanceOf(address owner) view returns (uint balance)"],
        provider,
      );
      const routerContract = new ethers.Contract(
        ROUTER_ADDRESS,
        [
          "function quoteRemoveLiquidity(address tokenA, address tokenB, bool stable, uint liquidity) external view returns (uint amountA, uint amountB)",
        ],
        provider,
      );

      const lpBalanceMsigInGauge = await gaugeContract.balanceOf(MSIG_ADDRESS);
      const lpBalanceMsigInWallet = await pairContract.balanceOf(MSIG_ADDRESS);

      const lpBalanceMsig = lpBalanceMsigInGauge.add(lpBalanceMsigInWallet);

      const amountsOut = await routerContract.quoteRemoveLiquidity(DAI_ADDRESS, WETH_ADDRESS, false, lpBalanceMsig);

      const lpValue =
        +ethers.utils.formatUnits(amountsOut[0], 18) + +ethers.utils.formatUnits(amountsOut[1], 18) * wethPrice;

      setTreasuryBalance(lpValue);
    };

    getTreasuryBalance();
  }, [provider, wethPrice]);

  return treasuryBalance;
}

export function usePolBvmWeth() {
  const [treasuryBalance, setTreasuryBalance] = useState<number>();

  const { provider } = useWeb3Context();

  const priceOfBvm = useMarketPrice(BVM_ADDRESS, "BVM");
  const priceOfWeth = useMarketPrice(WETH_ADDRESS, "WETH");

  useEffect(() => {
    if (!provider || priceOfBvm === undefined || priceOfWeth === undefined) return;

    const getTreasuryBalance = async () => {
      // lp value
      const pairContract = new ethers.Contract(
        BVM_WETH_ADDRESS,
        [
          "function getAmountOut(uint amountIn, address tokenIn) external view returns (uint)",
          "function balanceOf(address owner) view returns (uint balance)",
        ],
        provider,
      );
      const gaugeContract = new ethers.Contract(
        BVM_WETH_GAUGE_ADDRESS,
        ["function balanceOf(address owner) view returns (uint balance)"],
        provider,
      );
      const routerContract = new ethers.Contract(
        ROUTER_ADDRESS,
        [
          "function quoteRemoveLiquidity(address tokenA, address tokenB, bool stable, uint liquidity) external view returns (uint amountA, uint amountB)",
        ],
        provider,
      );

      const lpBalanceMsigInGauge = await gaugeContract.balanceOf(MSIG_ADDRESS);
      const lpBalanceMsigInWallet = await pairContract.balanceOf(MSIG_ADDRESS);

      const lpBalanceMsig = lpBalanceMsigInGauge.add(lpBalanceMsigInWallet);

      const amountsOut = await routerContract.quoteRemoveLiquidity(BVM_ADDRESS, WETH_ADDRESS, false, lpBalanceMsig);

      const lpValue =
        +ethers.utils.formatUnits(amountsOut[0], 18) * priceOfBvm +
        +ethers.utils.formatUnits(amountsOut[1], 18) * priceOfWeth;

      setTreasuryBalance(lpValue);
    };

    getTreasuryBalance();
  }, [priceOfBvm, priceOfWeth, provider]);

  return treasuryBalance;
}

export function useTotalReserves() {
  const [treasuryBalance, setTreasuryBalance] = useState<{ totalMarket: number; totalReserve: number }>();

  const pol = usePol();
  const ftKeysValue = useFtKeysValue();
  const hotWalletReserves = useHotWalletReserves();
  const msigReserves = useMsigReserves();
  const treasuryReserves = useTreasuryReserves();


  useEffect(() => {
    if (
      pol?.polReserve === undefined ||
      ftKeysValue === undefined ||
      hotWalletReserves === undefined ||
      msigReserves === undefined ||
      treasuryReserves === undefined
    )
      return;
    const totalReserve = pol?.polReserve + ftKeysValue + hotWalletReserves + msigReserves + treasuryReserves;
    const totalMarket = pol?.polMarket + ftKeysValue + hotWalletReserves + msigReserves + treasuryReserves;
    setTreasuryBalance({ totalMarket, totalReserve });
  }, [ftKeysValue, hotWalletReserves, msigReserves, pol, treasuryReserves]);

  return treasuryBalance;
}

export function useStakingTvl() {
  const [stakingTvl, setStakingTvl] = useState<number>();
  const { provider } = useWeb3Context();
  const ftwPrice = useMarketPrice();
  useEffect(() => {
    async function getTvl() {
      if (!provider || ftwPrice === undefined) return;
      const stakedAmount = await getStakedAmount(provider);
      const tvl = stakedAmount * ftwPrice;
      setStakingTvl(tvl);
    }

    getTvl();
  }, [ftwPrice, provider]);

  return stakingTvl;
}

async function getStakedAmount(provider: ethers.providers.JsonRpcProvider) {
  const stakingContract = new ethers.Contract(STAKING_ADDRESS, stakingAbi, provider);
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
