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
import SavedTranslations from "./dhananji/component/SavedTranslations";

import License from "./lakruwan/pages/license";
import { ProtectedRoute } from "./lakruwan/ProtectedRoute";



function App() {
  

  return (
  <Router>

<>
<Routes>

  {/* <Route path="/" element= {<DashBoard/>}/> */}
  <Route path="/Translator/engp" element={
    <ProtectedRoute>
      <AddEngPolisymous/>
    </ProtectedRoute>
  }/>
  <Route   path="/Translator/sinp" element= {
    <ProtectedRoute>
      <AddSinPolisymous/>
    </ProtectedRoute>
  } />
  <Route path="/Translator/poly" element= {
    <ProtectedRoute>
      <AddPolysimous/>
    </ProtectedRoute>
  }/>
  <Route path="/Translator/pg" element={
    <ProtectedRoute>
      <TranslationPg/>
    </ProtectedRoute>
  }/> 
  
  <Route path="/savedTranslations" element={
    <ProtectedRoute>
      <SavedTranslations/>
    </ProtectedRoute>
  }/>

  <Route path="/License" element={
    <ProtectedRoute>
      <License/>
    </ProtectedRoute>
  }/>

  <Route path='/' element={<Register />} />
  <Route path='/login' element={<Login />} />
  <Route path='/dashboard' element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
    } />
 
</Routes>
</>

  </Router>
  )
}

export default App
