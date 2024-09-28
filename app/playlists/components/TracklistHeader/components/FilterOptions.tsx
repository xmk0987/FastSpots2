import React from "react";
import styles from "../TrackListHeader.module.css";
import SearchIcon from "../../../../../assets/icons/SearchIcon";
import SortIcon from "../../../../../assets/icons/SortIcon";
import ArrowUpIcon from "../../../../../assets/icons/ArrowUpIcon";
import ArrowDownIcon from "../../../../../assets/icons/ArrowDownIcon";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../store";
import {
  setSelectedGenre,
  setSearchTerm,
  setSortBy,
  setSortAscending,
} from "../../../../../redux/playlistSlice";

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const FilterOptions = () => {
  const dispatch: AppDispatch = useDispatch(); // Typed dispatch

  const { searchTerm, sortAscending, sortBy, genres, selectedGenre, loading } =
    useSelector((state: RootState) => state.playlists);

  const handleGenreClick = (genre: string | null) => {
    dispatch(setSelectedGenre(genre));
  };

  const handleSearchTermChange = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const changeSortBy = (
    type: "name" | "added_at" | "release_date" | "popularity" | "artist"
  ) => {
    if (type === sortBy) {
      dispatch(setSortAscending());
    } else {
      dispatch(setSortBy(type));
    }
  };
  // Sort genres alphabetically and capitalize the first letter
  const sortedGenres = genres
    .filter(
      (genre: string) => genre.toLowerCase() !== selectedGenre?.toLowerCase()
    ) // Exclude the currently selected genre
    .sort()
    .map(capitalizeFirstLetter);

  return (
    <div className={styles.tracksFilterOptions}>
      <h3>Tracks</h3>
      {!loading ? (
        <>
          <div className={styles.searchWrapper}>
            <button>
              <SearchIcon size="15px" />
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              placeholder="Search..."
            />
          </div>
          <div className={styles.dropdown}>
            <button>
              <SortIcon size="15px" />
            </button>
            <div className={styles.dropdownContent}>
              <div onClick={() => changeSortBy("name")}>
                <p>Name</p>
                {sortBy === "name" &&
                  (sortAscending ? (
                    <ArrowUpIcon size="20px" />
                  ) : (
                    <ArrowDownIcon size="20px" />
                  ))}
              </div>
              <div onClick={() => changeSortBy("added_at")}>
                <p>Added</p>
                {sortBy === "added_at" &&
                  (sortAscending ? (
                    <ArrowUpIcon size="20px" />
                  ) : (
                    <ArrowDownIcon size="20px" />
                  ))}
              </div>
              <div onClick={() => changeSortBy("release_date")}>
                <p>Release Date</p>
                {sortBy === "release_date" &&
                  (sortAscending ? (
                    <ArrowUpIcon size="20px" />
                  ) : (
                    <ArrowDownIcon size="20px" />
                  ))}
              </div>
              <div onClick={() => changeSortBy("popularity")}>
                <p>Popularity</p>
                {sortBy === "popularity" &&
                  (sortAscending ? (
                    <ArrowUpIcon size="20px" />
                  ) : (
                    <ArrowDownIcon size="20px" />
                  ))}
              </div>
              <div onClick={() => changeSortBy("artist")}>
                <p>Artist</p>
                {sortBy === "artist" &&
                  (sortAscending ? (
                    <ArrowUpIcon size="20px" />
                  ) : (
                    <ArrowDownIcon size="20px" />
                  ))}
              </div>
            </div>
          </div>
          {genres.length !== 0 ? (
            <div className={styles.dropdown}>
              <button>
                {selectedGenre
                  ? capitalizeFirstLetter(selectedGenre)
                  : "All Genres"}
              </button>
              <div className={styles.dropdownContent}>
                {selectedGenre ? (
                  <div
                    key="all-genres"
                    className={styles.dropdownItem}
                    onClick={() => handleGenreClick(null)}
                  >
                    <p className={!selectedGenre ? styles.selectedGenre : ""}>
                      All Genres
                    </p>
                  </div>
                ) : null}
                {sortedGenres.map((genre: string) => (
                  <div
                    key={genre}
                    className={styles.dropdownItem}
                    onClick={() => handleGenreClick(genre)}
                  >
                    <p
                      className={
                        selectedGenre === genre ? styles.selectedGenre : ""
                      }
                    >
                      {genre}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default FilterOptions;
