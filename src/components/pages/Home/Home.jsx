import "./Home.css";
import Navbar from "../../Navbar/Navbar";
import netflix_spinner from "../../../assets/netflix_spinner.gif";
import hero_title from "../../../assets/hero_title.png";
import play_icon from "../../../assets/play_icon.png";
import info_icon from "../../../assets/info_icon.png";
import TitleCards from "../../TitleCards/TitleCards";
import Footer from "../../Footer/Footer";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: import.meta.env.VITE_API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const randomMovie =
          data.results[Math.floor(Math.random() * data.results.length)];
        setFeaturedMovie(randomMovie);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // Still hide default image to avoid flicker
      });
  }, []);

  // Helper function to truncate text
  const truncate = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return loading ? (
    <div className="login-spinner">
      <img src={netflix_spinner} alt="" />
    </div>
  ) : (
    <div className="home">
      <Navbar />

      {/* Only show hero after data is loaded to prevent layout shift */}
      {!loading && featuredMovie && (
        <div className="hero">
          <img
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt=""
            className="banner-img"
          />
          <div className="hero-caption">
            {featuredMovie.original_title ? (
              <h1 className="caption-title">{featuredMovie.original_title}</h1>
            ) : (
              <img src={hero_title} alt="" className="caption-img" />
            )}

            <p>{truncate(featuredMovie.overview, 25)}</p>

            <div className="hero-btns">
              <Link to={`/player/${featuredMovie.id}`} className="btn">
                <img src={play_icon} alt="" />
                Play
              </Link>
              <button className="btn dark-btn">
                <img src={info_icon} alt="" />
                More Info
              </button>
            </div>

            <TitleCards />
          </div>
        </div>
      )}

      <div className="more-cards">
        <TitleCards title={"Top-Rated Movies"} category={"top_rated"} />
        <TitleCards title={"Popular on Netflix"} category={"popular"} />
        <TitleCards title={"Upcoming"} category={"upcoming"} />
        <TitleCards title={"Now Playing"} category={"now_playing"} />
      </div>

      <Footer />
    </div>
  );
}
