export default async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Fetch error: ${response.status}`);
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Fetch error: ${error.message}`);
      return null;
    }
  }