import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { useEffect, useState, useRef  } from 'react';
import storage from '../store/storage';


export default function ViewStock() {
  const {updateViewStock, udpateMainPageVisibility} = storage();
  const stock = storage(state => state.stockToView);

  const [dataToView, setDataToView] = useState([]);
  const [viewNumber, setViewNumber] = useState(0);

  const apiMappedData = useRef(null);
  const fetchedApiData = useRef(null)

  const fetcher = async (url) => {
    try {
      const responseData = await fetch(url)
      const processedData = await responseData.json()
      const array = Object.entries(processedData["Weekly Time Series"]).map((d) => {
        return (
          {
            "year": (d[0].split('-'))[0],
            "date": d[0],
            "amount": Number(d[1]["4. close"])
          }
        )
      });

      setDataToView(array.reverse());
      fetchedApiData.current = processedData["Weekly Time Series"];
      setApiMappedData()
    } catch (error) {
      console.error('Error fetching data:', error);
      return null
    }
  }

  const setApiMappedData = async () => {
    apiMappedData.current = new Map(Object.entries(fetchedApiData.current));
  }

  useEffect(() => {
    if (fetchedApiData.current !== null) {
      if (viewNumber > 0) {
        const currentYear = new Date().getFullYear();
        let regex
        if (viewNumber === 1) {
          regex = new RegExp('^' + currentYear);
        } else if (viewNumber === 2) {
          regex = new RegExp(`^(${currentYear}|${currentYear - 1})`);
        } else if (viewNumber === 3) {
          regex = new RegExp(`^(${currentYear}|${currentYear - 1}|${currentYear - 2}|${currentYear - 3}|${currentYear - 4})`);
        } else {
          regex = null
        }


        if (regex) {
          let matchingKey = [...(apiMappedData.current).keys()].filter(key => regex.test(key));

          const dddd = matchingKey.map(key => {
            return {
              "year": (key.split('-'))[0],
              "date": key,
              "amount": Number((apiMappedData.current).get(key)["4. close"])
            }
          })
          console.log(dddd)
          setDataToView(dddd.reverse())
        } else {
          console.log("no matching key")
        }
      } else {
        // donot make any change cause user selected for default view
        const re = Object.entries(fetchedApiData.current).map(data => {

          return {
            "year": (data[0].split('-'))[0],
            "date": data[0],
            "amount": Number(data[1]["4. close"])
          }
        })
        setDataToView(re.reverse())
        console.log(`Didn't make any changes cause you selected for default view`)
      }
    } else {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${stock["symbol"]}&apikey=5OSR4OKC5T3E3CT1`;
      fetcher(url)
    }

  }, [viewNumber])

  const handleYearChange = (e) => {
    switch (e.target.value) {
      case "currentYear":
        return setViewNumber(1);
      case "last2Years":
        return setViewNumber(2);
      case "last5Years":
        return setViewNumber(3);
      default:
        return setViewNumber(0);
    }
  }

  const funcUpdateMainVisibility = (e) => {
    updateViewStock({})
    udpateMainPageVisibility()
  }

  return (
    <>
      <button onClick={funcUpdateMainVisibility} id='backURL'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <h3 style={{paddingLeft: "1vw", marginTop: "3vh"}}>{stock["stockname"]}</h3>
      <section style={{textAlign: "right", paddingRight: "5vw"}}>
        <label for="yearSelector">Filter data:</label>
        <select id="yearSelector" onChange={handleYearChange}>
          <option value="default" defaultValue={true}>Default</option>
          <option value="currentYear">Current year</option>
          <option value="last2Years">Last 2 Years</option>
          <option value="last5Years">Last 5 Years</option>
        </select>
      </section>
      <ResponsiveContainer height={500}>
        < LineChart width={300} height={250} data={dataToView}
          margin={{right: 20, left: -15, bottom: 5 }
          }>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis xAxisId="0" dataKey="date" hide={true}/>
          <XAxis xAxisId="1" dataKey="year" interval={"equidistantPreserveStart"} allowDuplicatedCategory={false}>
            <Label value="Dates" offset={-2.5} position="insideBottom" />
          </XAxis>
          <YAxis/>
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer >
    </>
  )
}
