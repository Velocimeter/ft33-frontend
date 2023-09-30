import { useSelector } from "react-redux";
import { Paper, Grid, Typography, Box, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";

function Dashboard() {
  // Use marketPrice as indicator of loading.
  const isAppLoading = useSelector(state => !state.app?.marketPrice ?? true);
  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector(state => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector(state => {
    return state.app.totalSupply;
  });
  const marketCap = useSelector(state => {
    return state.app.marketCap;
  });

  return (
    <div id="dashboard-view">
      <Typography variant="h5" style={{ marginBottom: 20, marginLeft: 20, fontWeight: "bold" }}>
        Dune
      </Typography>
      <div className="dune-cards">
        <iframe src="https://dune.com/embeds/3066160/5106359" title="Friend tech holdings in ETH after tax" />
        <iframe src="https://dune.com/embeds/3066111/5106265" title="eth earned" />
        <iframe src="https://dune.com/embeds/3066114/5106275" title="price + volume" />
        <iframe src="https://dune.com/embeds/3066115/5106279" title="MC in ETH" />
        <iframe src="https://dune.com/embeds/3066147/5106338" title="holders all time" />
        <iframe src="https://dune.com/embeds/3066185/5106414" title="keyholders" />
      </div>
    </div>
  );
}

export default Dashboard;
