import Grid from './Grid'

const Form = ({ children, gridcolspan = '1 / -1', style, ...rest }) => {
  return (
    <div style={{ gridColumn: gridcolspan, ...style }} {...rest}>
      <Grid>{children}</Grid>
    </div>
  )
}

export default Form
