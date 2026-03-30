import axios from "axios";

// 🔹 Base clients
const geoDBApi = axios.create({
  baseURL: "https://wft-geo-db.p.rapidapi.com/v1/geo",
  headers: {
    "X-RapidAPI-Key": "dd2aeb45aemsh2140ca4a3ff0241p160811jsn94f894641e8f",
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  },
  timeout: 10000,
});

const weatherApi = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 10000,
});

const imageApi = axios.create({
  baseURL: "https://api.pexels.com/v1",
  headers: {
    Authorization: "jzOWor46xQQd5rW80AprEI5YFOqYVnHrVMqmPPv0xwr5VNp0Zg2R2Gcc",
  },
  timeout: 10000,
});

// 🔹 Search Cities
export const searchCities = async (city, offset = 0) => {
  try {
    const res = await geoDBApi.get("/cities", {
      params: {
        namePrefix: city,
        limit: 5,
        offset: offset,
      },
    });

    return res.data?.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 🔹 Weather
export const getWeather = async (city) => {
  try {
    const res = await weatherApi.get("/weather", {
      params: {
        q: city,
        appid: "b9cb87ec655562893bba8c366edb8665",
        units: "metric",
      },
    });

    return res.data || null;
  } catch (error) {
    console.error("Weather API Error:", error.message);
    return null;
  }
};

// 🔹 City Image
export const getCityImage = async (city) => {
  try {
    const res = await imageApi.get("/search", {
      params: {
        query: city,
        per_page: 1,
      },
    });

    const photos = res.data?.photos;
    if (!photos || photos.length === 0) return null;

    return photos[0]?.src?.medium || null;
  } catch (error) {
    console.error("Image API Error:", error.message);
    return null;
  }
};