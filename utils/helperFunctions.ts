export const mapGenre = (genre: string): string => {
  const genreLowerCase = genre.toLowerCase();

  if (genreLowerCase.includes("rock")) {
    return "rock";
  } else if (genreLowerCase.includes("pop")) {
    return "pop";
  } else if (
    genreLowerCase.includes("hip hop") ||
    genreLowerCase.includes("rap")
  ) {
    return "hip-hop/rap";
  } else if (genreLowerCase.includes("classical")) {
    return "classical";
  } else if (genreLowerCase.includes("country")) {
    return "country";
  } else if (
    genreLowerCase.includes("electronic") ||
    genreLowerCase.includes("edm") ||
    genreLowerCase.includes("techno") ||
    genreLowerCase.includes("house")
  ) {
    return "electronic";
  } else if (genreLowerCase.includes("jazz")) {
    return "jazz";
  } else if (genreLowerCase.includes("metal")) {
    return "metal";
  } else if (genreLowerCase.includes("folk")) {
    return "folk";
  } else if (genreLowerCase.includes("reggae")) {
    return "reggae";
  } else if (
    genreLowerCase.includes("r&b") ||
    genreLowerCase.includes("soul")
  ) {
    return "r&b/soul";
  } else if (genreLowerCase.includes("latin")) {
    return "latin";
  } else if (genreLowerCase.includes("blues")) {
    return "blues";
  } else if (genreLowerCase.includes("world")) {
    return "world";
  } else {
    return "Other"; // Default to the original genre if no broader category found
  }
};
