import { BrowserRouter, Route, Routes } from "react-router-dom";
import MovieList from "./components/PE_FALL_24_TEST/MovieList";
import MovieDetails from "./components/PE_FALL_24_TEST/MovieDetails";
import CreateMovie from "./components/PE_FALL_24_TEST/CreateMovie";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact={true} path="/" element={<MovieList />} />
        <Route exact={true} path="/movies/:id" element={<MovieDetails />} />
        <Route exact={true} path="/movies/create" element={<CreateMovie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
