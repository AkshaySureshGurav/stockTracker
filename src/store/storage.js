import {create} from 'zustand';

const storage = create((set) => ({
  isLoggedin: false,
  user: "",
  cachedApiData: {},
  stocksInPortfolio: new Set(),
  isMainPageVisible: true,
  stockToView: null, //data when we change the component from main from viewStock

  addStock: (newStock) => set((state) => ({ stocksInPortfolio: new Set([...state.stocksInPortfolio, newStock]) })),

  removeStock: (stockToRemove) => set((state) => {
    const updatedPortfolio = new Set(state.stocksInPortfolio);
    updatedPortfolio.delete(stockToRemove);
    const removingStock = JSON.parse(stockToRemove);
    let cachedDataToUpdate = {...state.cachedApiData};
    delete cachedDataToUpdate[removingStock.symbol]
    return { 
      stocksInPortfolio: updatedPortfolio,
      cachedApiData: cachedDataToUpdate
     };
  }),

  addToCachedApiData: (stockData) => set((state) => {
    // console.log(state.cachedApiData)
    let newStock = {}
    newStock[stockData.symbol] = stockData; 
    // {stockData.name: }
    return {cachedApiData: {...state.cachedApiData, ...newStock}}
  }),

  updateLoginStatus: (username) => set((state) => {
    return {
      user: username,
      isLoggedin: true
    }
  }),

  logout: () => set((state) => {
    return {
      user: '',
      isLoggedin: false
    }
  }),


  udpateMainPageVisibility: () => set((state) => {
    return {
      isMainPageVisible: !(state.isMainPageVisible)
    }
  }),

  updateViewStock: (stockData) => set((state) => {
    if (stockData) {
      return {stockToView: stockData}
    } else {
      return null
    }
  })


}));

export default storage;
