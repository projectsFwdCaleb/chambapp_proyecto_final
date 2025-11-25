import { useState } from 'react'
import Routing from './routes/Routing'
import { UserProvider } from '/Context/UserContext';


function App() {


  return (
    <>
    <UserProvider>  {/* <------ envolver en el context */}
      <div>

        <Routing />
      </div>
    </UserProvider>
    </>
  )
}

export default App