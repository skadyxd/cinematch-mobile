import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_KEY = 'V97F9ZA-STG40R0-MVJBRHW-Y8KS3G6'; // Use your actual API key
const API_URL = 'https://api.kinopoisk.dev/v1.4/movie';

interface MovieItem {
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
  genres: string[];
}

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [limit, setLimit] = useState<number>(10); // Initial value
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}?page=1&limit=${limit}`, {
          headers: {
            'X-API-KEY': API_KEY,
            'accept': 'application/json',
          },
        });

        const formattedMovies = response.data.docs.map((movie: any) => ({
          title: movie.name,
          description: movie.shortDescription,
          imageUrl: movie.poster.previewUrl,
          rating: movie.rating.kp,
          genres: movie.genres.map((genre: any) => genre.name),
        }));

        setMovies(formattedMovies);
      } catch (error) {
        //setError('Error fetching movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [limit]); 

  return (
    <View>
      <Text style={styles.title}>Топ фильмов!</Text>
      <View style={styles.inputContainer}>
        <Text style={{ color: 'white' }}>Количество фильмов:</Text>
        <TextInput
          style={styles.input}
          value={limit.toString()}
          onChangeText={(text) => setLimit(Number(text))}
          keyboardType="numeric"
        />
      </View>
      {loading && <ActivityIndicator size="large" color="#007BFF" />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <FlatList
        data={movies}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.movieContainer}>
            {item.imageUrl ? (
              <Image style={styles.movieImage} source={{ uri: item.imageUrl }} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.movieDescription}>{item.description}</Text>
            <Text style={styles.movieRating}>Рейтинг: {item.rating}</Text>
            <Text style={styles.movieGenres}>Жанры: {item.genres.join(', ')}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
    paddingLeft: 5,
  },
  movieContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
  },
  movieImage: {
    width: '40%', 
    height: 200,
    marginBottom: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 200, 
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  movieDescription: {
    fontSize: 14,
    color: 'black',
  },
  movieRating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  movieGenres: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'black',
  },
});

export default MovieList;
