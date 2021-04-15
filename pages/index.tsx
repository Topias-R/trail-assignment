import Head from 'next/head'
import { useEffect } from 'react'
import { fetchItineraries } from '../lib/slices/itinerarySlice'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import Accordion from '../components/Accordion'
import Details from '../components/AccordionDetails'
import Summary from '../components/AccordionSummary'
import { Paper } from '@material-ui/core'

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
        <Accordion key={idx} square>
          <Summary aria-controls="">
            {itinerary.legs[0].startTime} -{' '}
            {itinerary.legs[0].trip?.pattern.name || itinerary.legs[0].mode} -{' '}
            {itinerary.legs[0].to.name}
          </Summary>
          <Details>
            {itinerary.legs.map((leg) => (
              <Paper key={leg.startTime}>
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
                - {leg.from.name} -{' '}
                <em>{leg.trip?.pattern.name || leg.mode}</em> - {leg.to.name}
              </Paper>
            ))}
          </Details>
        </Accordion>
      ))}
    </>
  )
}

export default Index
