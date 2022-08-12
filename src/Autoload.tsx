import useApollo from './hooks/useApollo'

type Props = {}
const Autoload: React.FC<Props> = () => {
  useApollo()
  return <></>
}
export default Autoload
