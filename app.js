const express = require('express');
const app = express();
app.use(express.json());

let users = [
    { id: 1, nome: "João Silva", email: "joao@email.com", senha: "123456" },
    { id: 2, nome: "Maria Souza", email: "maria@email.com", senha: "abcdef" }
];

let movies = [
    { id: 1, titulo: "O Poderoso Chefão", genero: "Drama", ano: 1972 },
    { id: 2, titulo: "Interestelar", genero: "Ficção Científica", ano: 2014 },
    { id: 3, titulo: "Toy Story", genero: "Animação", ano: 1995 }
];

let favorites = [
    { id: 1, user_id: 1, movie_id: 2 },
    { id: 2, user_id: 1, movie_id: 3 },
    { id: 3, user_id: 2, movie_id: 1 }
];

let nextUserId = 3;
let nextMovieId = 4;
let nextFavoriteId = 4;

app.get('/users', (req, res) => {
    const usersSemSenha = users.map(({ senha, ...user }) => user);
    res.json(usersSemSenha);
});

app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    const { senha, ...userSemSenha } = user;
    res.json(userSemSenha);
});

app.post('/users', (req, res) => {
    const { nome, email, senha } = req.body;
    const newUser = { id: nextUserId++, nome, email, senha };
    users.push(newUser);
    const { senha: _, ...userSemSenha } = newUser;
    res.status(201).json(userSemSenha);
});

app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    const { nome, email, senha } = req.body;
    users[userIndex] = {...users[userIndex], nome, email, senha };
    const { senha: _, ...userSemSenha } = users[userIndex];
    res.json(userSemSenha);
});

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    users.splice(userIndex, 1);
    favorites = favorites.filter(f => f.user_id !== id);
    res.status(204).send();
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    res.json(movie);
});

app.post('/movies', (req, res) => {
    const { titulo, genero, ano } = req.body;
    const newMovie = { id: nextMovieId++, titulo, genero, ano };
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

app.put('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === id);
    const { titulo, genero, ano } = req.body;
    movies[movieIndex] = {...movies[movieIndex], titulo, genero, ano };
    res.json(movies[movieIndex]);
});

app.delete('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === id);
    movies.splice(movieIndex, 1);
    favorites = favorites.filter(f => f.movie_id !== id);
    res.status(204).send();
});

app.get('/users/:userId/favorites', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userFavorites = favorites.filter(f => f.user_id === userId);
    const favoriteMovies = userFavorites.map(fav => {
        return movies.find(m => m.id === fav.movie_id);
    });
    res.json(favoriteMovies);
});

app.post('/users/:userId/favorites/:movieId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const movieId = parseInt(req.params.movieId);
    const newFavorite = { id: nextFavoriteId++, user_id: userId, movie_id: movieId };
    favorites.push(newFavorite);
    res.status(201).json({ mensagem: "Filme adicionado aos favoritos" });
});

app.delete('/users/:userId/favorites/:movieId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const movieId = parseInt(req.params.movieId);
    const favoriteIndex = favorites.findIndex(f => f.user_id === userId && f.movie_id === movieId);
    favorites.splice(favoriteIndex, 1);
    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`CineStream API rodando em http://localhost:${PORT}`);
    console.log(`\nEndpoints disponíveis:`);
    console.log(`   GET    /users`);
    console.log(`   GET    /users/:id`);
    console.log(`   POST   /users`);
    console.log(`   PUT    /users/:id`);
    console.log(`   DELETE /users/:id`);
    console.log(`   GET    /movies`);
    console.log(`   GET    /movies/:id`);
    console.log(`   POST   /movies`);
    console.log(`   PUT    /movies/:id`);
    console.log(`   DELETE /movies/:id`);
    console.log(`   GET    /users/:userId/favorites`);
    console.log(`   POST   /users/:userId/favorites/:movieId`);
    console.log(`   DELETE /users/:userId/favorites/:movieId`);
});