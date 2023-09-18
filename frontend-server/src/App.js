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

  const [currentPage, setCurrentPage] = useState(1);
  const [fetchStatisticsError, setFetchStatisticsError] = useState(false);
  const [fetchListError, setFetchListError] = useState(false)

  const DisplayStatistics = () => {
    return (
      <>
      <div
      className='bg-gray-50 text-center border-gray-500 border-2 w-1/3 mx-auto rounded mt-3'
      >
        <div
        className='text-left w-fit mx-auto'>
          <span>Total Amount of Transactions: {statisticsData?.amountTransactions}</span>
          <br/>
          <span>Average Transaction sum: {BigInt(statisticsData?.avgTransactions).toString(10)}</span>
          <br/>
          <span>Sum of all Transactions: {BigInt(statisticsData?.sumTransactions).toString(10)}</span>
          <br/>
        </div>
      </div>
      </>
    )
  };

  const DisplayTransactions = () => {
    return (
      <>
      <div
      className='bg-gray-50 text-center border-gray-500 border-2 w-1/3 mx-auto rounded mt-3'
      >
        <span className='inline-block mt-5 font-medium text-lg'>List of all Transactions:</span>
        <br/>
        <div className='px-5'>
          <table className='border-2 border-gray-400 bg-slate-50 mx-auto w-1/2'>
            <tr>
              <th className='inline-block mr-3'>Number</th><th>Transaction Sum</th>
            </tr>
            {transactionsList?.map((x, index) => {
              return (
                <tr key={index}>
                  <td className={(index % 2) ? 'bg-gray-50' : 'bg-gray-100'}>{index+1}</td>
                  <td className={(index % 2) ? 'bg-gray-50' : 'bg-gray-100'}>{BigInt(x).toString(10)}</td>
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
        }}
        className='border-2 rounded-sm border-gray-400 bg-gray-100 mb-2 px-1'
        >
          NextPage
        </button>
      </div>
      </>
    )
  };

  const fetchStatistics = () => {
    const statisticsURL = `http://127.0.0.1:8000/api/inner/ask-polygonscan/statistics/?address=${formData}`;
    fetch(statisticsURL).then((result) => {
      result.json().then((parsedResult) => {
        if (parsedResult.status !== 'bad response') {
          setStatisticsData(parsedResult)
        } else {
          setFetchStatisticsError(true)
        }
      })
    })
  };

  const fetchList = () => {
    const listURL = `http://127.0.0.1:8000/api/inner/ask-polygonscan/paginated/?address=${formData}&page=${currentPage}`;
    fetch(listURL).then((result) => {
      result.json().then((parsedResult) => {
        if (parsedResult.length) {
          setTransactionsList(parsedResult)
        } else {
          setFetchListError(true)
        }
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
        <form onSubmit={handleSubmit} className='bg-yellow-50 border-b-2 border-amber-700'>
          <label htmlFor="walletAddress" className='my-6'>Enter wallet address:</label>
          <br/>
          <input
            id="walletAddress" 
            name="walletAddress" 
            type="text" 
            placeholder="Wallet address"
            value={formData}
            onChange={handleInput}
            className='border-solid border-2 rounded-sm border-gray-400 px-1 w-1/3'
          />
          <br/>
          <button
          className='border-solid border-2 rounded border-gray-400 bg-gray-100 my-2 px-1'
          >Get Transactions</button>
        </form>
        {statisticsData ? DisplayStatistics() : ''}
        {fetchStatisticsError ? 'Failed to get statistics' : ''}

        {transactionsList ? DisplayTransactions() : ''}
        {fetchListError ? 'Failed to get Transactions List' : ''}
    </div>
  );
}

export default App;
