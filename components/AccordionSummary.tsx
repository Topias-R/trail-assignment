import { withStyles } from '@material-ui/core/styles'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'

const AccordionSummary = withStyles({
  root: {
    height: '64px',
    padding: 0,
    boxShadow:
      '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
  },
  expanded: {},
  content: {
    height: '100%',
    margin: '0 !important'
  }
})(MuiAccordionSummary)

export default AccordionSummary
