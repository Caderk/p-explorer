import "./App.css"
import { Counter } from "./features/counter/Counter"
import CssBaseline from '@mui/material/CssBaseline';
import logo from "./logo.svg"

import Button from "@mui/material/Button"
import Poketable from "./features/poketable/Poketable"

// We use roboto
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const App = () => {
  return (
    <div className="App">
      <CssBaseline />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button variant="contained">Hello world</Button>
        <Poketable />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  )
}

export default App
