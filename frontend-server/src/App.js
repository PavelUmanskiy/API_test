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
  const [fetchListDone, setFetchListDone] = useState(true)

  const DisplayStatistics = () => {
    return (
      <>
      <div
      className='flex flex-col justify-start items-center bg-[#56F0AA]/[0.9] rounded-xl gap-2 p-2 h-full'
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
        <img src='./Graph_placeholder.png' placeholder='graph'/>
      </div>
      </>
    )
  };

  const DisplayTransactions = () => {
    return (
      <>
      <div
      className='flex flex-col justify-center items-center bg-[#56F0AA]/[0.9] rounded-xl gap-2 p-2 h-full'
      >
        <span className='inline-block mt-5 font-medium text-lg'>List of all Transactions:</span>
        <br/>
        <div className='px-5 w-full'>
          <table className='mx-auto w-full'>
            <tr>
              <th className='inline-block mr-3'>Number</th><th>Transaction Sum</th>
            </tr>
            {transactionsList?.map((x, index) => {
              return (
                <tr key={index}>
                  <td className={(index % 2) ? 'bg-[#A6FAF4]/[0.9]' : 'bg-[#56F0AA]/[0.9]'}>{index+1}</td>
                  <td className={(index % 2) ? 'bg-[#A6FAF4]/[0.9]' : 'bg-[#56F0AA]/[0.9]'}>{BigInt(x).toString(10)}</td>
                </tr>
              )
            })}
          </table>
          <span>Current Page: {currentPage}</span>
        </div>
        {/* TODO: Previous page */}
        <button 
        type="button" 
        onClick={async (event) => {
          event.preventDefault()
          setCurrentPage(currentPage + 1)
          setFetchListDone(false)
        }}
        className={fetchListDone ? 'border-green-700 bg-green-500 border-2 rounded-lg  mb-2 px-1' : 'border-red-700 bg-red-500 border-2 rounded-lg  mb-2 px-1'}
        disabled = {!fetchListDone}
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
          setFetchListDone(true)
        } else {
          setFetchListError(true)
          setFetchListDone(false)
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
    <div className="App font-sans text-gray-800 bg-gradient-to-tr from-[#5A56F0] from-1% via-[#5A90FA] via-30% to-[#5DBBE3] w-full h-full flex flex-col items-center justify-center gap-4">
        <div className='flex flex-col justify-center items-center h-1/5 w-1/3 bg-[#56F0AA]/[0.9] rounded-xl gap-2'>
        <label htmlFor="walletAddress" className=''>Enter wallet address:</label>

            <input
              id="walletAddress"
              name="walletAddress"
              type="text"
              placeholder="Wallet address"
              value={formData}
              onChange={handleInput}
              className='border-solid border-2 rounded-sm border-gray-400 w-[75%] px-2'
            />
            

          <button
            onClick={handleSubmit}
            className='border-solid border-2 rounded border-gray-400 bg-gray-100 w-fit px-2'
            >Get Transactions</button>
        </div>
        <div className='grid grid-cols-2 gap-4 h-3/5 px-4'>
          <div className='col-span-1'>
            {transactionsList ? DisplayTransactions() : ''}
            {fetchListError ? 'Failed to get Transactions List' : ''}
          </div>
          <div className='col-span-1'>
            {statisticsData ? DisplayStatistics() : ''}
            {fetchStatisticsError ? 'Failed to get Statistics' : ''}
          </div>
        </div>
        
    </div>
  );
}

export default App;
