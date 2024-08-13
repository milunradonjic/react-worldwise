import React from 'react'
import styles from './CityItem.module.css'
import { Link } from 'react-router-dom';

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

export default function CityItem({ city }) {
  const { id, emoji, cityName, date, position: { lat, lng} } = city
  return (
    <li>
        <Link to={`${id}?lat=${lat}&lng=${lng}`} className={styles.cityItem}>
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  )
}
