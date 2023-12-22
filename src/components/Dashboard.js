import { useEffect, useState } from "react"
import storage from "../store/storage"
import fetchData from "../helperFunctions/dataFetcher"

export default function Dashboard(){

    const {stocksInPortfolio, cachedApiData, user, logout, addToCachedApiData, removeStock, udpateMainPageVisibility, updateViewStock} = storage()
    // stocksInPortfolio contains name and symbol of the stock

    const [stockDataToDisplay, setStockDataToDisplay] = useState([])
    const [isEditModeOn, setIsEditModeOn] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [isListSortedByName, setIsListSortedByName] = useState(false)
    const [isListSortedByProfit, setIsListSortedByProfit] = useState(false)

    // strings of the stock symbol and name
    // for use in this component #MANDATE
    // cause we can only make 5 request per minute if more than 5 we will have to keep track of the remaining data 
    // to load after a minute
    const [stockDataToLoad, setStockDataToLoad] = useState(Array.from(stocksInPortfolio))

    useEffect(() => {

        let timeoutID;
        clearTimeout(timeoutID);
        ( 
            async () => {
                async function dataLoader(stockData) {
                    // console.log(stockDataToDisplay)
                    const data = await fetchData(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockData.symbol}&apikey=5OSR4OKC5T3E3CT1`)
                    return data;
                };
                // console.log(stocksInPortfolio)
                if (stockDataToLoad.length) {
                    // console.log(stockDataToLoad)
                    for (let i = 0; i < stockDataToLoad.length; i++) { 
                        // conversion cause stock JSON is stored in string form in dustand store
                        let conversionStockDataToLoad = stockDataToLoad[i];

                        const stockSymbolObj = JSON.parse(conversionStockDataToLoad);

                        // console.log(`Loading data for ${stockSymbolObj.symbol}`);

                        // conversion done
                        let stock;
                        const isStockCached = cachedApiData.hasOwnProperty(stockSymbolObj.symbol);

                        if (isStockCached) {
                            // console.log("using cached data")
                            stock = cachedApiData[stockSymbolObj.symbol]
                        } else {
                            // console.log("Getting data from Api")
                            stock = await dataLoader(stockSymbolObj)
                            if (stock !== null) {
                                // console.log(stock)
                                if (stock.hasOwnProperty("Note")) {
                                    console.error(`Request to API reached limit for ${stockSymbolObj.name}`);
                                    // console.log(`Remaining data will be loaded after a minute`);
                                    
                                    // console.log(stockDataToLoad.slice(i, stockDataToLoad.length))
                                    // to append the remaning the dataToLoad in dispayData
                                    // user  should have something to see till loading
                                    timeoutID = setTimeout(() => {
                                        // setStockDataToLoad(state => state)
                                        setRefresh(state => !state)
                                    }, 60000)
                                    break;
                                } else {
                                    stock = stock["Global Quote"];
                                }
                            } else {
                                console.log(`Error from api for ${stockSymbolObj.name}`)
                                break;
                            }
                        }
                        
                        if (stock) {
                            // console.log(Number(stock["05. price"]).toFixed(2))
                            stock["05. price"] = Number(stock["05. price"]).toFixed(2);
                            stock["09. change"] = Number(stock["09. change"]).toFixed(2);
                            const updatedStock = {
                                "name": stockSymbolObj.name,
                                "symbol": stockSymbolObj.symbol,
                                ...stock
                            }
                            
                            // if the stock dats is not cached
                            if (!isStockCached) {
                                addToCachedApiData(updatedStock)
                            }

                            setStockDataToDisplay(state => {
                                return [
                                    ...state,
                                    updatedStock
                                ]
                            })
                        } else {
                            setStockDataToDisplay(state => {
                                return [
                                    ...state,
                                    {
                                        "name": stockSymbolObj.name,
                                        "symbol": stockSymbolObj.symbol,  
                                    }
                                ]
                            })
                        }
                    }
                } 
            }
        )();
    }, [stockDataToLoad])

    const handleSortingByName = () => {
        if (!isListSortedByName) {
            setStockDataToDisplay(state => {
                let arrayToChange = [...state]
                arrayToChange.sort((a, b) => {
                    const nameA = a.name.toUpperCase(); // Ignore case while sorting
                    const nameB = b.name.toUpperCase(); // Ignore case while sorting
                
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    // Names are equal
                    return 0;
                });
                return arrayToChange
            })

            setIsListSortedByName(true)
            if (isListSortedByProfit) {
                setIsListSortedByProfit(false);
            }
        } else {
            console.log("List is already sorted by name")
        }
    }



    const handleSortingByProfit = () => {
        if (!isListSortedByProfit){
            setStockDataToDisplay(state => {
                let arrayToChange = [...state]
                arrayToChange.sort((a, b) => {
                    const nameA = a["09. change"].toUpperCase(); // Ignore case while sorting
                    const nameB = b["09. change"].toUpperCase(); // Ignore case while sorting
                
                    if (nameA < nameB) {
                        return 1;
                    }
                    if (nameA > nameB) {
                        return -1;
                    }
                    // Names are equal
                    return 0;
                });
                return arrayToChange
            })

            setIsListSortedByProfit(true)
            if (isListSortedByName) {
                setIsListSortedByName(false);
            }
        } else {
            console.log("List is already sorted by profit");
        }
    }


    const funcUpdateMainVisibility = (e) => {
        updateViewStock(JSON.parse(e.target.value))
        udpateMainPageVisibility()
    }
 
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light">
            <h4 style={{margin: "0"}}><span>S</span>tockTracker</h4>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                {/* <span className="navbar-toggler-icon"></span> */}
                
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <p className="nav-link">Signed in as {user}</p>
                </li>
                <li className="nav-item">
                    <button className="nav-link" onClick={() => logout()}>Logout</button>
                </li>
                </ul>
            </div>
            </nav>
            <section style={{display: "flex", justifyContent:"space-between", paddingRight: "3vw"}}>
                <h5 style={{paddingLeft: "2vw", paddingTop: "1.2vh"}}>Portfolio</h5>
                <div className="btn-group">
                    <button id="optionsBtn" type="button" className="btn btn-info dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        Options
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><button className="dropdown-item" type="button" onClick={() => {setIsEditModeOn(state => !state)}}>{(isEditModeOn) ? "Edit mode off" : "Edit mode on"}</button></li>
                        <li><button className={isListSortedByName ? "dropdown-item isActive" : "dropdown-item"} type="button" onClick={handleSortingByName}>{isListSortedByName ? "Sorted by name" : "Sort by name"}</button></li>
                        <li><button className={isListSortedByProfit ? "dropdown-item isActive" : "dropdown-item"} type="button" onClick={handleSortingByProfit}>{isListSortedByProfit ? "Sorted by gain" :"Sort by gain"}</button></li>
                    </ul>
                </div>
            </section>  
            <section id="stocksHolder">  
            {(stocksInPortfolio.size) ? (
                (stockDataToDisplay.length)? 
                (stockDataToDisplay.map((stockData, index) => {
                    return (                  
                        <section key={index} className="stockHolder animate__animated animate__fadeIn">
                            <section>    
                                <h6>{stockData.name}</h6>
                                <p>Closed at <span style={(stockData["09. change"] >= 0) ? {color:"green"} : {color:"red"}}>₹ {stockData["05. price"]}</span> on {stockData["07. latest trading day"]}</p>
                                <p style={{fontSize: "0.85em"}} className="hide">Price {stockData["09. change"] > 0 
                                    ?         
                                        <svg fill="green"  viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="dashboardIconForUI">
                                            <path d="M917 211.1l-199.2 24c-6.6.8-9.4 8.9-4.7 13.6l59.3 59.3-226 226-101.8-101.7c-6.3-6.3-16.4-6.2-22.6 0L100.3 754.1a8.03 8.03 0 0 0 0 11.3l45 45.2c3.1 3.1 8.2 3.1 11.3 0L433.3 534 535 635.7c6.3 6.2 16.4 6.2 22.6 0L829 364.5l59.3 59.3a8.01 8.01 0 0 0 13.6-4.7l24-199.2c.7-5.1-3.7-9.5-8.9-8.8z"/>
                                        </svg>
                                    : 
                                        <svg fill="red" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="dashboardIconForUI">
                                            <path d="M925.9 804l-24-199.2c-.8-6.6-8.9-9.4-13.6-4.7L829 659.5 557.7 388.3c-6.3-6.2-16.4-6.2-22.6 0L433.3 490 156.6 213.3a8.03 8.03 0 0 0-11.3 0l-45 45.2a8.03 8.03 0 0 0 0 11.3L422 591.7c6.2 6.3 16.4 6.3 22.6 0L546.4 490l226.1 226-59.3 59.3a8.01 8.01 0 0 0 4.7 13.6l199.2 24c5.1.7 9.5-3.7 8.8-8.9z"/>
                                        </svg>
                                    } by Rs {Math.abs(stockData["09. change"])} since the last trading day.</p>
                                {(isEditModeOn) ? (<button style={{background: "red"}} className="buttonOnStock" id={JSON.stringify({
                                                                    'symbol': stockData['symbol'],
                                                                    'name': stockData["name"]
                                                                })} onClick={(e) => {
                                                                        removeStock(e.currentTarget.id);
                                                                        setStockDataToDisplay([])
                                                                        setStockDataToLoad(Array.from(stocksInPortfolio))
                                                                    }}>delete</button>) : (<></>)}
                            </section>
                            <button className="buttonOnStock" value={JSON.stringify({stockname: stockData["name"], symbol: stockData['symbol']})} onClick={funcUpdateMainVisibility}>view</button>
                        </section>
                    )
                })) :
                <p style={{textAlign: "center", marginTop: "3vh"}}>Loading...</p>
            ) : (<h6 style={{textAlign: "center", marginTop: "3vh"}}>Empty</h6>)} 
            </section>
        </>
    )
}