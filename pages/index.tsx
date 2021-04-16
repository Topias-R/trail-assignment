import Head from 'next/head'
import { useEffect } from 'react'
import { fetchItineraries } from '../lib/slices/itinerarySlice'
import { useAppDispatch, useAppSelector, useDebounce } from '../lib/hooks'
import Accordion from '../components/Accordion'
import Details from '../components/AccordionDetails'
import Summary from '../components/AccordionSummary'
import { Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk'
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus'
import DirectionsSubwayIcon from '@material-ui/icons/DirectionsSubway'
import TrainIcon from '@material-ui/icons/Train'
import TramIcon from '@material-ui/icons/Tram'
import DirectionsBoatIcon from '@material-ui/icons/DirectionsBoat'
import Search from '../components/Search'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    placeItems: 'center',
    paddingBottom: 0,
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '48px'
    }
  },
  container: {
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  details: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gap: '8px'
  },
  detailsLeg: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },
  leftTimeStamp: {
    position: 'absolute',
    top: 0,
    left: '2px'
  },
  rightTimeStamp: {
    position: 'absolute',
    bottom: 0,
    right: '2px'
  },
  summaryLeg: {
    display: 'grid',
    position: 'relative',
    placeItems: 'center',
    width: '100%',
    height: '100%',
    padding: '12px 0',
    textAlign: 'center'
  },
  detailsLegMode: {
    borderRadius: '4px',
    padding: '2px 4px',
    margin: '-2px -4px'
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
  const reverse = useAppSelector((state) => state.search.search.reverse)
  const address = useAppSelector((state) => state.search.search.address)

  const debouncedReverse: boolean = useDebounce<boolean>(reverse, 750)

  useEffect(() => {
    dispatch(
      fetchItineraries({
        latitude: address.coords.latitude,
        longitude: address.coords.longitude,
        reverse
      })
    )
  }, [address, debouncedReverse])
  const classes = useStyles()

  return (
    <>
      <Head>
        {reverse && (
          <title>Maria 01{address.name ? ' - ' + address.name : ''}</title>
        )}
        {!reverse && (
          <title>{address.name ? address.name + ' - ' : ''}Maria 01</title>
        )}
      </Head>
      <Paper className={classes.root}>
        {!itineraries.length && (
          <Typography align="center" variant="h2" component="h1">
            Type your address below
          </Typography>
        )}
        <div className={classes.container}>
          {[...itineraries]
            .sort((a, b) => a.startTime - b.startTime)
            .map((itinerary, idx) => (
              <Accordion key={idx} square elevation={3}>
                <Summary aria-controls="">
                  {itinerary.legs.map((leg, idx) => (
                    <div
                      key={idx}
                      className={classes.summaryLeg}
                      style={{
                        width: `clamp(20%, ${
                          ((leg.endTime - leg.startTime) /
                            (itinerary.legs[itinerary.legs.length - 1].endTime -
                              itinerary.legs[0].startTime)) *
                            100 +
                          '%'
                        }, 100%)`,
                        backgroundColor: {
                          WALK: 'white',
                          BUS: '#006AFF',
                          SUBWAY: '#FC833D',
                          RAIL: '#D543E6',
                          TRAM: '#009E27',
                          FERRY: '#F2E53A'
                        }[leg.mode],
                        color: {
                          WALK: 'black',
                          BUS: 'white',
                          SUBWAY: 'black',
                          RAIL: 'white',
                          TRAM: 'white',
                          FERRY: 'black'
                        }[leg.mode]
                      }}
                    >
                      <em className={classes.leftTimeStamp}>
                        {new Date(leg.startTime).toLocaleString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </em>
                      <em className={classes.rightTimeStamp}>
                        {new Date(leg.endTime).toLocaleString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </em>
                      {
                        {
                          WALK: <DirectionsWalkIcon />,
                          BUS: <DirectionsBusIcon />,
                          SUBWAY: <DirectionsSubwayIcon />,
                          RAIL: <TrainIcon />,
                          TRAM: <TramIcon />,
                          FERRY: <DirectionsBoatIcon />
                        }[leg.mode]
                      }
                    </div>
                  ))}
                </Summary>
                <Details className={classes.details}>
                  {itinerary.legs.map((leg, idx) => (
                    <Paper
                      elevation={2}
                      key={idx}
                      className={classes.detailsLeg}
                    >
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
                        <span
                          className={classes.detailsLegMode}
                          style={{
                            backgroundColor: {
                              WALK: 'white',
                              BUS: '#006AFF',
                              SUBWAY: '#FC833D',
                              RAIL: '#D543E6',
                              TRAM: '#009E27',
                              FERRY: '#F2E53A'
                            }[leg.mode],
                            color: {
                              WALK: 'black',
                              BUS: 'white',
                              SUBWAY: 'black',
                              RAIL: 'white',
                              TRAM: 'white',
                              FERRY: 'black'
                            }[leg.mode]
                          }}
                        >
                          <em>
                            {leg.trip?.pattern.name
                              .split(' ')
                              .filter((word) => {
                                return !/^\([A-Za-z]+\:[\d]+\)$/.test(word)
                              })
                              .join(' ') || (
                              <DirectionsWalkIcon
                                style={{ fontSize: '100%' }}
                              />
                            )}
                          </em>
                        </span>
                        <span>{leg.to.name}</span>
                      </div>
                    </Paper>
                  ))}
                </Details>
              </Accordion>
            ))}
        </div>
        <Search />
      </Paper>
    </>
  )
}

export default Index
