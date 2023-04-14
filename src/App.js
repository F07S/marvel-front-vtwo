import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// PAGES
//###########################################################################
import Home from "./pages/home/Home";
import Characters from "./pages/characters/Characters";
import Comics from "./pages/comics/Comics";
import Character from "./pages/character/Character";
import Comic from "./pages/comic/Comic";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Favourites from "./pages/favourites/Favourites";

// COMPONENTS
//###########################################################################
// import Header from "./components/header/Header";

// CSS
//###########################################################################
import "./pages/home/Home.css";
import "./assets/css/font.css";
import "./pages/characters/Characters.css";
import "./components/header/Header.css";
import "./pages/comics/Comics.css";
import "./pages/character/Character.css";
import "./pages/comic/Comic.css";
import "./pages/signup/Signup.css";
import "./pages/favourites/Favourites.css";

// FONTAWESOME LIBRARY
//###########################################################################
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faStar,
  faTrashCan,
  faMagnifyingGlass,
  faPlus,
  faChevronDown,
  faChevronUp,
  faUserCircle,
  faMask,
  faBook,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faStar,
  faTrashCan,
  faMagnifyingGlass,
  faChevronDown,
  faChevronUp,
  faPlus,
  faUserCircle,
  faMask,
  faBook,
  faUser,
  faRightFromBracket
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/characters" element={<Characters></Characters>}></Route>
        <Route path="/comics" element={<Comics></Comics>}></Route>
        <Route path="/character/:id" element={<Character></Character>}></Route>
        <Route path="/comic/:id" element={<Comic></Comic>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/favourites" element={<Favourites></Favourites>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
