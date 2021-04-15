import Head from 'next/head'
import { useEffect } from 'react'
import { fetchItineraries } from '../lib/slices/itinerarySlice'
import { useAppDispatch, useAppSelector } from '../lib/hooks'

export const Index = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { itineraries } = useAppSelector((state) => state.itineraries)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      dispatch(fetchItineraries(coords))
    })
  }, [])
  console.log(itineraries)
  return (
    <>
      <Head>
        <title>Trail-Assignment</title>
      </Head>
      {itineraries.map((itinerary, idx) => (
        <ul key={idx}>
          {itinerary.legs.map((leg) => (
            <li key={leg.startTime}>
              {new Date(leg.startTime).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}{' '}
              -{' '}
              {new Date(leg.endTime).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}{' '}
              - {leg.from.name} - <em>{leg.trip?.pattern.name || leg.mode}</em>{' '}
              - {leg.to.name}
            </li>
          ))}
        </ul>
      ))}
    </>
  )
}

export default Index
