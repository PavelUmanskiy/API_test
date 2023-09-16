// ReactDOM.render(<div>
//     <h1>Hello</h1>
//     <h2>World</h2>
// </div>, document.getElementById("result"))
class WalletForm extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleSubmit(event) {
      event.preventDefault();
      const data = new FormData(event.target);
  
      // fetch('/api/form-submit-url', {
      //   method: 'POST',
      //   body: data,
      // });
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