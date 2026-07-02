import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {IconByKey} from './IconByKey'

function A({className}: {className?: string}) {
  return <span data-testid='a' className={className} />
}
function B({className}: {className?: string}) {
  return <span data-testid='b' className={className} />
}
function Fb({className}: {className?: string}) {
  return <span data-testid='fb' className={className} />
}

const REGISTRY = {a: A, b: B}

describe('IconByKey', () => {
  it('resolves the component for a known key and forwards props', () => {
    const {getByTestId} = render(<IconByKey registry={REGISTRY} id='a' className='x' />)
    expect(getByTestId('a')).toHaveClass('x')
  })

  it('renders the fallback for an unknown key', () => {
    const {getByTestId} = render(<IconByKey registry={REGISTRY} id='nope' fallback={Fb} />)
    expect(getByTestId('fb')).toBeInTheDocument()
  })

  it('renders nothing when key is unknown and no fallback', () => {
    const {container} = render(<IconByKey registry={REGISTRY} id='nope' />)
    expect(container).toBeEmptyDOMElement()
  })
})
