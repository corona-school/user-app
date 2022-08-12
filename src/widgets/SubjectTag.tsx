import { View, Text, useTheme } from 'native-base'
import Tag from '../components/Tag'

type Props = {
  title: string
  variant?: 'normal' | 'outline'
}

const SubjectTag: React.FC<Props> = ({ title, variant = 'normal' }) => {
  const { space, colors } = useTheme()

  return (
    <Tag
      text={title}
      paddingY={space['0.5']}
      paddingX={space['1']}
      borderRadius={20}
      borderColor={variant === 'normal' ? undefined : colors['tertiary']['500']}
    />
  )
}
export default SubjectTag
