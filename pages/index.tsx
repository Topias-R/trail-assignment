import Head from 'next/head'
import { useEffect } from 'react'
import { fetchItineraries } from '../lib/slices/itinerarySlice'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import Accordion from '../components/Accordion'
import Details from '../components/AccordionDetails'
import Summary from '../components/AccordionSummary'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    placeItems: 'center'
  },
  container: {
    height: '100%'
  },
  details: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gap: '8px'
  },
  leg: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },
  time: {
    margin: '8px'
  },
  trip: {
    display: 'flex',
    gap: '8px',
    margin: '8px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  }
}))

export const Index = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { itineraries } = useAppSelector((state) => state.itineraries)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      dispatch(fetchItineraries(coords))
    })
  }, [])
  const classes = useStyles()

  return (
    <>
      <Head>
        <title>Trail-Assignment</title>
      </Head>
      <Paper className={classes.root}>
        <div className={classes.container}>
          {itineraries.map((itinerary, idx) => (
            <Accordion key={idx} square>
              <Summary aria-controls="">
                {new Date(itinerary.legs[0].startTime).toLocaleString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}{' '}
                -{' '}
                {itinerary.legs[0].trip?.pattern.name || itinerary.legs[0].mode}{' '}
                - {itinerary.legs[0].to.name}
              </Summary>
              <Details className={classes.details}>
                {itinerary.legs.map((leg) => (
                  <Paper key={leg.startTime} className={classes.leg}>
                    <div className={classes.time}>
                      {new Date(leg.startTime).toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                      &nbsp;-&nbsp;
                      {new Date(leg.endTime).toLocaleString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </div>
                    <div className={classes.trip}>
                      <span>{leg.from.name}</span>
                      <span>
                        <em>{leg.trip?.pattern.name || leg.mode}</em>
                      </span>
                      <span>{leg.to.name}</span>
                    </div>
                  </Paper>
                ))}
              </Details>
            </Accordion>
          ))}
        </div>
      </Paper>
    </>
  )
}

export default Index
