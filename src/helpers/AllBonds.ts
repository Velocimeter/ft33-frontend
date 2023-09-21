import { StableBond, LPBond, NetworkID, CustomBond } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as OhmDaiImg } from "src/assets/tokens/OHM-DAI.svg";
import { ReactComponent as USDCImg } from "src/assets/tokens/usdc.svg";
import { ReactComponent as OhmFraxImg } from "src/assets/tokens/OHM-FRAX.svg";
import { ReactComponent as OhmLusdImg } from "src/assets/tokens/OHM-LUSD.svg";
import { ReactComponent as wETHImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as LusdImg } from "src/assets/tokens/LUSD.svg";
import { ReactComponent as SquidUsdtImg } from "src/assets/tokens/squid-usdt.svg";

import { abi as FraxOhmBondContract } from "src/abi/bonds/OhmFraxContract.json";
import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as BondOhmLusdContract } from "src/abi/bonds/OhmLusdContract.json";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as WethBondContract } from "src/abi/bonds/WethContract.json";
import { abi as ReserveOhmLusdContract } from "src/abi/reserves/OhmLusd.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { abi as ReserveOhmFraxContract } from "src/abi/reserves/OhmFrax.json";
import { abi as FraxBondContract } from "src/abi/bonds/FraxContract.json";
import { abi as LusdBondContract } from "src/abi/bonds/LusdContract.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const weth = new StableBond({
  active: true,
  name: "weth",
  displayName: "WETH",
  bondToken: "WETH",
  decimals: 18,
  bondIconSvg: wETHImg,
  bondContractABI: WethBondContract,
  networkAddrs: {
    [NetworkID.Base]: {
      bondAddress: "0x29d3646Af367dBa96E1b09A196c60FA20A3dAfF4",
      reserveAddress: "0x4200000000000000000000000000000000000006",
    },
  },
});

export const usdc = new StableBond({
  active: true, // unused
  name: "usdc",
  displayName: "USDC",
  bondToken: "USDC",
  decimals: 6,
  bondIconSvg: USDCImg,
  bondContractABI: FraxBondContract,
  networkAddrs: {
    [NetworkID.Base]: {
      bondAddress: "0x81Dcb847fc51487ba39D228425344ecB53ebfB6E",
      reserveAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
  },
});
export const dai = new StableBond({
  active: true, // unused
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  decimals: 18,
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Base]: {
      bondAddress: "0xb6e5bb847121daa62c18de25f15cbe2acffbccf2",
      reserveAddress: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    },
  },
});

export const ftw_dai_lp = new LPBond({
  active: true,
  name: "ftw_dai_lp",
  displayName: "FTW-DAI LP",
  bondToken: "ETH",
  decimals: 18,
  bondIconSvg: SquidUsdtImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Base]: {
      bondAddress: "0x0bec648ccde8a30a2650f622e8de3a4e94d456dc",
      reserveAddress: "0x7b809866eaa8137d902f83bf7cbe77b41d0df70c", // lp tokens
    }
  },
  lpUrl:
    "https://app.sushi.com/add/0x21ad647b8F4Fe333212e735bfC1F36B4941E6Ad2/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
});


// export const eth = new CustomBond({
//   active: false, // unused
//   name: "eth",
//   displayName: "wETH",
//   bondToken: "wETH",
//   bondIconSvg: wETHImg,
//   bondContractABI: EthBondContract,
//   networkAddrs: {
//     [NetworkID.Mainnet]: {
//       bondAddress: "0xE6295201CD1ff13CeD5f063a5421c39A1D236F1c",
//       reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
//     },
//     [NetworkID.Testnet]: {
//       bondAddress: "0xca7b90f8158A4FAA606952c023596EE6d322bcf0",
//       reserveAddress: "0xc778417e063141139fce010982780140aa0cd5ab",
//     },
//   },
//   customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
//     const ethBondContract = this.getContractForBond(networkID, provider);
//     let ethPrice = await ethBondContract.assetPrice();
//     ethPrice = ethPrice / Math.pow(10, 8);
//     const token = this.getContractForReserve(networkID, provider);
//     let ethAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
//     ethAmount = ethAmount / Math.pow(10, 18);
//     return ethAmount * ethPrice;
//   },
// });



// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
//export const allBonds = [dai, frax, eth, ohm_dai, ohm_frax, lusd, ohm_lusd];
export const allBonds = [ dai, ftw_dai_lp];
export const allBondsMap: { [name: string]: LPBond | StableBond } = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
