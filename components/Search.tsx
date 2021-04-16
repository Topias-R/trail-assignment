import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import { updateTerm, updateReverse } from '../lib/slices/searchSlice'

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
      width: 500,
      borderRadius: '4px 4px 0 0',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        borderRadius: 0
      }
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1
    },
    iconButton: {
      padding: 10
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

  return (
    <Paper
      component="form"
      elevation={5}
      className={classes.root}
      style={{
        flexDirection: reverse ? 'row-reverse' : 'row'
      }}
    >
      <InputBase
        className={classes.input}
        placeholder={reverse ? 'Destination' : 'Origin'}
        inputProps={{ 'aria-label': reverse ? 'Destination' : 'Origin' }}
        onChange={(e) => dispatch(updateTerm(e.target.value))}
        value={term}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        color="primary"
        className={classes.iconButton}
        aria-label="directions"
        onClick={() => dispatch(updateReverse(!reverse))}
      >
        <SwapHorizIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
      <InputBase
        className={classes.input}
        readOnly
        value="Maria 01"
        inputProps={{ 'aria-label': 'Maria 01' }}
      />
    </Paper>
  )
}
