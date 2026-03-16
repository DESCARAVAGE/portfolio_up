import './styles/App.css'

interface RootProps {
  readonly children?: React.ReactNode;
}

export function App({children}: Readonly<RootProps> ): React.JSX.Element {

  return (
    <>{children}</>
  )
}