import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const UpdateSearchCount = async (searchTerm, movie) => {
  try {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("search_term", [normalizedSearchTerm]),
    ]);
    if (response.documents.length > 0) {
      console.log(response.documents);
      const doc = response.documents[0];

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        search_term: searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(10),
      Query.orderDesc("count"),
    ]);
    return response.documents;
  } catch (error) {
    console.log(error);
  }
};
