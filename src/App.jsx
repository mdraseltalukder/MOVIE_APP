import React from "react";
import { useDebounce } from "use-debounce";
import { getTrendingMovies, UpdateSearchCount } from "./appwrite";
import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import Spinner from "./components/Spinner";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [trendingErrorMessage, setTrendingErrorMessage] = React.useState("");
  const [movies, setMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [trendingMovies, setTrendingMovies] = React.useState([]);

  const [debounceTerm] = useDebounce(searchTerm, 500);
  const fetchMovies = async (query = "") => {
    setLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `/tmdb/search/movie?query=${query}`
        : `/tmdb/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, options);

      if (!response.ok) {
        throw new Error("Error fetching Movies. Please Try Again.");
      }

      const result = await response.json();

      // TMDB API uses 'results' for data, not checking 'Response' like OMDB
      if (!result.results) {
        setErrorMessage(
          result.Error || "Error fetching Movies. Please Try Again."
        );
        setMovies([]);
        return;
      }

      setMovies(result.results || []);
      console.log(result.results);
      if (query && result.results.length > 0) {
        UpdateSearchCount(query, result.results[0]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage(
        error.message || "Error fetching Movies. Please Try Again."
      );
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(error);
      setTrendingErrorMessage(
        error.message || "Error fetching Trending Movies. Please Try Again."
      );
    }
  };

  React.useEffect(() => {
    fetchMovies(debounceTerm);
  }, [debounceTerm]);
  React.useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="hero.png" alt="movie hero image" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Love
              Without the Hassle
            </h1>
          </header>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={index}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>

          <section className="all-movies">
            <h2 className="">All Movies</h2>
            {loading ? (
              <div className="flex justify-center">
                {" "}
                <Spinner />
              </div>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movies.map((movie) => (
                  <MovieCard movie={movie} key={movie.id} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
