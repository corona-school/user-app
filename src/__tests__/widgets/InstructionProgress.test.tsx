import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'
import InstructionProgress from '../../widgets/InstructionProgress'

const instructions = [
  {
    label: 'Verifizierung',
    title: 'Verifizierung',
    content: [
      {
        title: 'Mailadresse verifizieren',
        text: 'Lorem ipsum dolor sit amet'
      },
      {
        title: 'Persönliches Kennenlernen',
        text: 'Lorem ipsum dolor sit amet'
      }
    ]
  },
  {
    label: 'Matching',
    title: 'Match anfragen',
    content: [
      {
        title: 'Lernpartner:in kontaktieren',
        text: 'Lorem ipsum dolor sit amet'
      },
      {
        title: 'Kennenlernen vorbereiten',
        text: 'Lorem ipsum dolor sit amet'
      }
    ]
  },
  {
    label: 'Gruppenkurs',
    title: 'Gruppenkurs geben',
    content: [
      {
        title: 'Kurse erkunden',
        text: 'Lorem ipsum dolor sit amet'
      },
      {
        title: 'Kurse erstellen und freigeben lassen',
        text: 'Lorem ipsum dolor sit amet'
      }
    ]
  }
]

describe('InstructionProgress', () => {
  test('renders correctly by default', () => {
    const { queryByText, queryAllByText } = render(
      <InstructionProgress instructions={instructions} />,
      {
        wrapper: TestWrapper
      }
    )
    expect(queryAllByText(/Verifizierung/).length).toBe(2)
    expect(queryByText(/Mailadresse verifizieren/)).toBeInTheDocument()
    expect(queryByText(/Persönliches Kennenlernen/)).toBeInTheDocument()

    expect(queryByText(/Matching/)).toBeNull()
    expect(queryByText(/Gruppenkurs geben/)).toBeNull()
    expect(queryByText(/Lernpartner:in kontaktieren/)).toBeNull()
    expect(queryByText(/Kurse erstellen und freigeben lassen/)).toBeNull()
  })

  test('renders correctly changed currentIndex', () => {
    const { queryByText } = render(
      <InstructionProgress instructions={instructions} currentIndex={1} />,
      {
        wrapper: TestWrapper
      }
    )
    expect(queryByText(/Matching/)).toBeInTheDocument()
    expect(queryByText(/Match anfragen/)).toBeInTheDocument()
    expect(queryByText(/Lernpartner:in kontaktieren/)).toBeInTheDocument()
    expect(queryByText(/Kennenlernen vorbereiten/)).toBeInTheDocument()

    expect(queryByText(/Verifizierung/)).toBeNull()
    expect(queryByText(/Persönliches Kennenlernen/)).toBeNull()
    expect(queryByText(/Kurse erstellen und freigeben lassen/)).toBeNull()
  })
})
