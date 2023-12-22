import { useState, useEffect } from "react"
import storage from "../store/storage"

export default function Search(){
    const [searchQuery, setSearchQuery] = useState('')
    const [apiData, setApiData] = useState('')
    const {stocksInPortfolio, addStock, removeStock} = storage()

    useEffect(() => {
        // console.log("page refreshed!!! ---> in Search useEffect now");
        // console.log(cachedApiData)

        const timeoutId = setTimeout(async () => {
            if (searchQuery !== ''){
                try {
                    const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchQuery}&apikey=5OSR4OKC5T3E3CT1`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    // console.log(data)
                    setApiData(data.bestMatches)
                } catch (error) {
                    // Handle fetch errors
                    console.error('Fetch error:', error);
                }
            }
        }, 600)

        return () => {
            setApiData('')
            clearTimeout(timeoutId);
        }
    }, [searchQuery])


    
  let setTimeoutID;

  const handleInputChange = (event) => {
    // console.log("Input value changed");
    clearTimeout(setTimeoutID);
    setTimeoutID = setTimeout(() => {
    //   console.log("Updating the search query!!!");
    //   console.log(event.target.value);
      setSearchQuery(event.target.value);
    }, 1200);
  };

    return (
        <div id="seachComponent">
            <section style={{position:"relative", minHeight: "fit-content"}}>
                <h4 style={{paddingLeft: "2vw", paddingTop: "3vh", textAlign: "center"}}>Search</h4>
                <input id="search" type="text" placeholder="Stock" onChange={handleInputChange}></input>
                <svg fill="green"  viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="searchIconForUI" id="searchUILeft">
                    <path d="M917 211.1l-199.2 24c-6.6.8-9.4 8.9-4.7 13.6l59.3 59.3-226 226-101.8-101.7c-6.3-6.3-16.4-6.2-22.6 0L100.3 754.1a8.03 8.03 0 0 0 0 11.3l45 45.2c3.1 3.1 8.2 3.1 11.3 0L433.3 534 535 635.7c6.3 6.2 16.4 6.2 22.6 0L829 364.5l59.3 59.3a8.01 8.01 0 0 0 13.6-4.7l24-199.2c.7-5.1-3.7-9.5-8.9-8.8z"/>
                </svg>
                <svg fill="red" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="searchIconForUI" id="searchUIRight">
                    <path d="M925.9 804l-24-199.2c-.8-6.6-8.9-9.4-13.6-4.7L829 659.5 557.7 388.3c-6.3-6.2-16.4-6.2-22.6 0L433.3 490 156.6 213.3a8.03 8.03 0 0 0-11.3 0l-45 45.2a8.03 8.03 0 0 0 0 11.3L422 591.7c6.2 6.3 16.4 6.3 22.6 0L546.4 490l226.1 226-59.3 59.3a8.01 8.01 0 0 0 4.7 13.6l199.2 24c5.1.7 9.5-3.7 8.8-8.9z"/>
                </svg>
            </section>
            <section>
            {
                (searchQuery !== '') ? (
                    (apiData) ? (
                        (apiData.length) ? (
                        apiData.map((stock, index) => (
                            <div key={index} style={{animationDelay: `${index * 0.4}s` }} className="StockSearchList animate__animated animate__bounceInRight">
                                <section className="searchStockNameSection">
                                <h6>{stock["2. name"]}</h6>
                                <p>{stock["4. region"]}</p>
                                </section>
                                <section>
                                    {(stocksInPortfolio.has(JSON.stringify({
                                                                        'symbol': stock['1. symbol'],
                                                                        'name': stock["2. name"]
                                                                    }))) ? 
                                                                    (
                                                                    <button className="actionButtons" id={JSON.stringify({
                                                                        'symbol': stock['1. symbol'],
                                                                        'name': stock["2. name"]
                                                                    })} onClick={(e)=> {
                                                                        // console.log(e.currentTarget.className)
                                                                        removeStock(e.currentTarget.id)
                                                                        console.log(storage.getState().stocksInPortfolio)
                                                                        }}>
                                        
                                                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="red"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/></svg></button>
                                    )
                                        : (
                                            <button className="actionButtons" id={JSON.stringify({'symbol': stock['1. symbol'],'name': stock["2. name"]})} onClick={(e)=> {addStock(e.currentTarget.id)}}>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="green">
                                                    <path d="M0 0h24v24H0V0z" fill="none"/>
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                                                </svg>
                                            </button>
                                    )}
                                </section>
                            </div>
                            )
                        )
                        ) : (
                            <h5 style={{color: "red"}}>Error while fetching data from API</h5> 
                        )
                    ) : (
                        <h5>Loading...</h5>
                    )
                ) : (
                    <h5>Search query is empty!!!</h5>
                )
            }
            </section>  
        </div>
    )
}