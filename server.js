const express = require('express');
const app = express();
const Eth = require('web3-eth');
const abi = require('./erc20-abi.js');

/* Environment */
require('dotenv').config();

const PORT = process.env.PORT || 3000;
if (!process.env.ENDPOINT) {
  throw new Error('Environment variable ENDPOINT is not defined.');
}

/* Routes */
app.get('/:tokenAddress/:holderAddress', async (req, res) => {
  try {
    const eth = new Eth(process.env.ENDPOINT);
    // FIXME I am unsure if creating a new ABI for each Contract() call is necessary
    // as it gets modified. If reuse is ok, we could change the abi() call to a constant
    const tokenInst = new eth.Contract(abi(), req.params.tokenAddress);

    // Get the decimals and balance, we will need the number of decimals to format.
    const decimals = await tokenInst.methods.decimals().call()
    let balance = await tokenInst.methods.balanceOf(req.params.holderAddress).call()

    // We receive balance as a string. Add the decimal if we have it and respond.
    if (decimals) {
      balance = balance.slice(0, -decimals) + '.' + balance.slice(-decimals);
    }

    res.status(200).send(balance);
  } catch (err) {
    res.status(500).send("Failed to get number of tokens.");
    console.log(err);
  }
});


/* Server */
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}...`);
})
