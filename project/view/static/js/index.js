import { createRoot } from 'react-dom/client';
class WalletForm extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    async handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        let url = `api/inner/ask-polygonscan/?address=${data.get('walletAddress')}`;
        let response = await fetch(url);
        let result = await response.json()
        const container = document.getElementById('result');
        const root = createRoot(container);
        root.render(result);
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="walletAddress">Enter wallet address</label>
          <br/>
          <input id="walletAddress" name="walletAddress" type="text" placeholder="Wallet address"/>
          <br/>
          <button>Get Transactions</button>
        </form>
      );
    }
  }
  let walletAddressForm = new WalletForm()
  ReactDOM.render(walletAddressForm.render(), document.getElementById("walletAddressForm"))