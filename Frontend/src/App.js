
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './component/Home';

function App() {
  return (
  <>
    <Router>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
        
          </Routes>
          </Router>
  </>
  );
}

export default App;
