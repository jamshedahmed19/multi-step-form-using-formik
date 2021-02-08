import { AppBar, Grid, Toolbar, Typography } from "@material-ui/core";
import TransactionForm from "./components/TransactionForm";

function App() {
  return (
    <div>
      <AppBar style={{ flexGrow: 1 }}>
        <Toolbar>
          <Typography
            style={{ flexGrow: 1, padding: "20px", fontWeight: 300 }}
            variant="h4"
          >
            Transaction Form
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        spacing={4}
        alignItems="center"
        direction="row"
        justify="center"
      >
        <Grid item md={8} lg={6}>
          <TransactionForm />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
