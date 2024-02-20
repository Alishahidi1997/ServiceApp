import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cors from 'cors';

import services from './services';

import users from './users/api';
import resources from './resources/api';
import upload from './upload/api';

const { logger, verifyToken } = services;
const app = express();
app.use(cors());
app.use(express.static(join('www')));
app.set('views', join('views'));
app.set('view engine', 'pug');
app.use(json());
app.use(urlencoded({ extended: false }));

app.use('/api/users', users(services));
app.use('/api/upload', upload(services));
app.use('/api/resources', verifyToken, resources(services));

app.get('*', (_req, res) => {
  res.render('app');
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  logger.info(`App listening on port: ${PORT}`);
});
