const word = 'message';
const capitalisedWord = word.charAt(0).toUpperCase() + word.slice(1);

console.log(`
import { Router } from 'express'
import ${word}Controller from './${word}.controller'

const ${word}Router = Router();

${word}Router.get('/:id', ${word}Controller.get${capitalisedWord}s);
${word}Router.post('/', ${word}Controller.create${capitalisedWord});
${word}Router.patch('/:id', ${word}Controller.edit${capitalisedWord});
${word}Router.delete('/:id', ${word}Controller.delete${capitalisedWord});

export default ${word}Router;

import { StatusCodes } from "http-status-codes";

const get${capitalisedWord}s = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Get ${capitalisedWord}'
  });
}

const create${capitalisedWord} = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Create ${capitalisedWord}'
  });
}

const edit${capitalisedWord} = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Edit ${capitalisedWord}'
  });
}

const delete${capitalisedWord} = async (req, res) => {
  return res.status(StatusCodes.OK).json({
    data: 'Delete ${capitalisedWord}'
  });
}

export default {
  create${capitalisedWord},
  edit${capitalisedWord},
  delete${capitalisedWord},
  get${capitalisedWord}s
}

import ${word}Router from '../api/${word}/${word}.router';
version1Router.use('/${word}', ${word}Router);

`);