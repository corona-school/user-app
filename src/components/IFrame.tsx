type Props = {
  title: string
  src: string
  width?: number | string
  height?: number | string
}

const IFrame: React.FC<Props> = props => {
  // eslint-disable-next-line jsx-a11y/iframe-has-title
  return <iframe {...props} />
}
export default IFrame
