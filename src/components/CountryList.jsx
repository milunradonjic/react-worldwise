import React from 'react'
import styles from './CountryList.module.css'
import Spinner from './Spinner'
import CountryItem from './CountryItem';
import Message from './Message';
import { useCities } from '../contexts/CityContext';

export default function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) {
    return <Spinner />;
  }

  if (!cities.length) {
    return <Message message="Add your first city by clicking on a city on the map" />
  }

  const countries = cities.reduce((countries, city) => {
    if (!countries.includes(city.country)) {
      countries.push({ country: city.country, emoji: city.emoji })
    }
    return countries
  }, [])

  return <ul className={styles.countryList}>
    {countries.map((country) => <CountryItem key={country.country} country={country} />)}
  </ul>
}
