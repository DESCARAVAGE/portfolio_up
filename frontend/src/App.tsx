// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './styles/App.css'

interface RootProps {
    children?: React.ReactNode;
}

export function App({children}: RootProps): React.JSX.Element {
//   const [count, setCount] = useState(0)

  return (
    <>{children}</>
  )
}