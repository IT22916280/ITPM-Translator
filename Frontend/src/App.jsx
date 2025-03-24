import {BrowserRouter as Router ,Routes, Route} from "react-router-dom";
import React from "react"
import DashBoard from "../DashBoard";
import AddEngPolisymous from "./Polysimous/AddEngPolisymous";
import AddSinPolisymous from "./Polysimous/AddSinPolisymous";
import AddPolysimous from "./Polysimous/AddPolysimous";
import TranslationPg from "./TranslationPg";




function App() {
  

  return (
  <Router>

<>
<Routes>

  <Route path="/" element= {<DashBoard/>}/>
  <Route path="/Translator/engp" element={<AddEngPolisymous/>}/>
  <Route   path="/Translator/sinp" element= {<AddSinPolisymous/>} />
  <Route path="/Translator/poly" element= {<AddPolysimous/>}/>
  <Route path="/translationpage" element={<TranslationPg/>}/>
 
</Routes>
</>

  </Router>
  )
}

export default App
