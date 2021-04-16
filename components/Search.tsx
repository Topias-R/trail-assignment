import React, { useState, useEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import LocationSearchingIcon from '@material-ui/icons/LocationSearching'
import { useAppDispatch, useAppSelector, useDebounce } from '../lib/hooks'
import {
  updateTerm,
  updateReverse,
  addressSearch
} from '../lib/slices/searchSlice'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      top: '100%',
      left: '50%',
      transform: 'translate(-50%, -100%)',
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 800,
      borderRadius: '4px 4px 0 0',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        borderRadius: 0
      }
    },
    inputContainer: {
      position: 'relative',
      width: '100%'
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1
    },
    iconButton: {
      padding: 10
    },
    locationButton: {
      padding: 10,
      position: 'absolute',
      right: '0px',
      top: '-6px'
    },
    divider: {
      height: 28,
      margin: 4
    }
  })
)

export default function CustomizedInputBase() {
  const classes = useStyles()

  const dispatch = useAppDispatch()
  const reverse = useAppSelector((state) => state.search.search.reverse)
  const term = useAppSelector((state) => state.search.search.term)
  const address = useAppSelector((state) => state.search.search.address)

  const debouncedSearchTerm = useDebounce(term, 750)
  const debouncedAddress = useDebounce(address, 3000)

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(addressSearch({ term: debouncedSearchTerm }))
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    if (debouncedAddress) {
      dispatch(updateTerm(address.name))
    }
  }, [debouncedAddress])

  return (
    <Paper
      component="form"
      elevation={5}
      className={classes.root}
      style={{
        flexDirection: reverse ? 'row-reverse' : 'row'
      }}
    >
      <div className={classes.inputContainer}>
        <InputBase
          className={classes.input}
          placeholder={reverse ? 'Destination' : 'Origin'}
          inputProps={{ 'aria-label': reverse ? 'Destination' : 'Origin' }}
          onChange={(e) => {
            dispatch(updateTerm(e.target.value))
          }}
          onSubmit={(e) => e.currentTarget.blur()}
          value={term}
        />
        <IconButton
          color="primary"
          className={classes.locationButton}
          aria-label="locate"
          onClick={() => {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
              dispatch(addressSearch({ coords }))
            })
          }}
        >
          <LocationSearchingIcon />
        </IconButton>
      </div>
      <Divider className={classes.divider} orientation="vertical" />

      <IconButton
        color="primary"
        className={classes.iconButton}
        aria-label="swap"
        onClick={() => dispatch(updateReverse(!reverse))}
      >
        <SwapHorizIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
      <div className={classes.inputContainer}>
        <InputBase
          className={classes.input}
          readOnly
          value="Maria 01"
          inputProps={{ 'aria-label': 'Maria 01' }}
        />
      </div>
    </Paper>
  )
}
