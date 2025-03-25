import {BrowserRouter as Router ,Routes, Route} from "react-router-dom";
import React from "react"
// import DashBoard from "../DashBoard";
import AddEngPolisymous from "./Polysimous/AddEngPolisymous";
import AddSinPolisymous from "./Polysimous/AddSinPolisymous";
import AddPolysimous from "./Polysimous/AddPolysimous";
import TranslationPg from "./TranslationPg";
import Register from  "./naduni/Register";
import Login from "./naduni/Login";
import Dashboard from "./naduni/Dashoboard";

import License from "./lakruwan/pages/license";



function App() {
  

  return (
  <Router>

<>
<Routes>

  {/* <Route path="/" element= {<DashBoard/>}/> */}
  <Route path="/Translator/engp" element={<AddEngPolisymous/>}/>
  <Route   path="/Translator/sinp" element= {<AddSinPolisymous/>} />
  <Route path="/Translator/poly" element= {<AddPolysimous/>}/>
  <Route path="/Translator/pg" element={<TranslationPg/>}/> 
  
  <Route path="/License" element={<License/>}/>

  <Route path='/' element={<Register />} />
  <Route path='/login' element={<Login />} />
  <Route path='/dashboard' element={<Dashboard />} />
 
</Routes>
</>

  </Router>
  )
}

export default App
