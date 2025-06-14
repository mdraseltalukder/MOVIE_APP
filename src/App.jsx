import React from "react";
import Search from "./components/Search";

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  return (
    <>
      <main>
        <div className="pattern">
          <div className="wrapper">
            <header>
              <img src="hero.png" alt="movie hero image" />
              <h1>
                Find <span className="text-gradient">Movies</span> You’ll Love
                Without the Hassle
              </h1>
            </header>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <div>
            <h1>{searchTerm}</h1>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
