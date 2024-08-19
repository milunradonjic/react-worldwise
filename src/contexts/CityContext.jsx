import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
}

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true
      }
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload
      }
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload
      }
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      }
    case "cities/deleted": 
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(city => city.id !== action.payload),
        currentCity: {},
      }
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    default:
      throw new Error("Unknown action");
  }
}

const BASE_URL = 'http://localhost:8000'

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialState);

  useEffect(function () {
    const fetchCities = async () => {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        console.log(error.message);
        dispatch({ type: "rejected", payload: "There was an error loading the data..." });
      } 
    }
    fetchCities();
  }, [])

  async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: "rejected", payload: "There was an error loading the data..." });
    } 
  }

  async function createCity(city) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(city)
      });
      const data = await res.json();
      dispatch({ type: "cities/created", payload: data });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: "rejected", payload: "There was an error creating the city..." });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      dispatch({ type: "cities/deleted", payload: id });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: "rejected", payload: "There was an error deleting the city..." });
    } 
  }

  return <CitiesContext.Provider value={{
    cities,
    isLoading,
    currentCity,
    getCity,
    createCity,
    deleteCity,
  }}>
    {children}
  </CitiesContext.Provider>;
}

function useCities() {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error('useCities must be used within a CitiesProvider');
  }
  return context;
}

export { useCities, CitiesProvider }