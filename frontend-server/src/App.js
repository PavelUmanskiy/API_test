import './App.css';
import {useEffect, useState} from 'react';
/* global BigInt */

function App() {
  const [statisticsData, setStatisticsData] = useState(null);
  const [transactionsList, setTransactionsList] = useState(null);

  const [formData, setFormData] = useState('');
  const handleInput = (event) => {
    let newData = event.target.value
    setFormData(newData)
  };
  const [currentPage, setCurrentPage] = useState(1)


  const DisplayStatistics = () => {
    return (
      <>
      <span>Total Amount of Transactions: {statisticsData?.amountTransactions}</span>
      <br/>
      <span>Average Transaction sum: {BigInt(statisticsData?.avgTransactions).toString(10)}</span>
      <br/>
      <span>Sum of all Transactions: {BigInt(statisticsData?.sumTransactions).toString(10)}</span>
      <br/>
      </>
    )
  };

  const DisplayTransactions = () => {
    return (
      <>
      <span>List of all Transactions:</span>
      <br/>
      <div>
        <table>
          <tr>
            <th>Number</th><th>Transaction Sum</th>
          </tr>
          {transactionsList?.map((x, index) => {
            return (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{BigInt(x).toString(10)}</td>
              </tr>
            )
          })}
        </table>
        <span>Current Page: {currentPage}</span>
      </div>
      <button 
      type="button" 
      onClick={async (event) => {
        event.preventDefault()
        setCurrentPage(currentPage + 1)
      }}>
        NextPage
      </button>
      </>
    )
  };

  const fetchStatistics = () => {
    const statisticsURL = `http://127.0.0.1:8000/api/inner/ask-polygonscan/statistics/?address=${formData}`;
    fetch(statisticsURL).then((result) => {
      result.json().then((parsedResult) => {
        setStatisticsData(parsedResult)
      })
    })
  };

  const fetchList = () => {
    const listURL = `http://127.0.0.1:8000/api/inner/ask-polygonscan/paginated/?address=${formData}&page=${currentPage}`;
    fetch(listURL).then((result) => {
      result.json().then((parsedResult) => {
        setTransactionsList(parsedResult)
      })
    })
  };

  useEffect(() => {
    if (currentPage !== 1) fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const handleSubmit = async (event) => {
    event.preventDefault();
    fetchStatistics()
    fetchList()
  };


  return (
    <div className="App">
        <form onSubmit={handleSubmit}>
          <label htmlFor="walletAddress">Enter wallet address</label>
          <br/>
          <input
            id="walletAddress" 
            name="walletAddress" 
            type="text" 
            placeholder="Wallet address"
            value={formData}
            onChange={handleInput}
          />
          <br/>
          <button>Get Transactions</button>
        </form>
        {statisticsData ? DisplayStatistics() : ''}
        {transactionsList ? <DisplayTransactions/> : ''}
    </div>
  );
}

export default App;
