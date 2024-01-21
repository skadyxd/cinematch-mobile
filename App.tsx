import React from 'react';
import { SafeAreaView } from 'react-native';
import MovieComponent from './Movies';

const App: React.FC = () => {
  return (
    <SafeAreaView>
      <MovieComponent />
    </SafeAreaView>
  );
};

export default App;
