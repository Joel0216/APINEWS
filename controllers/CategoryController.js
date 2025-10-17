const {Category} = require('../models/CategoryModel')
const { validationResult } = require('express-validator');

const get = (request, response) => {
    const {nombre,descripcion,activo,useralta} =request.query
    const filters = {}
    if (nombre) {
        filters.nombre = nombre 
    }
    if (descripcion) {
        filters.descripcion = descripcion
    }
    if (activo){
        filters.activo = activo
    }
    if (useralta){
        filters.useralta =useralta
    }

    //const filters = request.query
    Category.findAll({
      where: filters
    })
      .then(entities => {
        response.json(entities);
      })
      .catch(err => {
          console.log(err)
        response.status(500).send('Error consultando los datos');
      })
  
  }
  
const getById = (request, response) => {
    const id = request.params.id;
    Category.findByPk(id)

      .then(entitie => {
        if (entitie) {
          response.json(entitie);
        }
        else {
          response.status(404).send('Recurso no encontrado')
        }
      })
      .catch(err => {
        response.status(500).send('Error al consultar el dato');
      })
  }
  
  
const create = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.mapped() });
  }

    Category.create(request.body).then(
      newEntitie => {
        response.status(201).json(newEntitie)
      }
    )
      .catch(err => {
        response.status(500).send('Error al crear');
      })
  }
  
  const update = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.mapped() });
  }
    const id = request.params.id;
    Category.update(
      request.body
      , 
      {
        where: {
          id: id
        }
      })
      .then(numRowsUpdated => {
        response.status(200).send(`${numRowsUpdated} registro actualizado`);
      })
      .catch(err => {
        response.status(500).send('Error al actualizar');
      });
  }

  
const destroy = (request, response) => {
    const id = request.params.id;
    Category.destroy(
      {
        where: {
          id: id
        }
      }
    ).then(numRowsDeleted => {
      response.status(200).send(`${numRowsDeleted} registro eliminado`);
    })
      .catch(err => {
        response.status(500).send('Error al eliminar');
      });
  }
  
  module.exports = {
    get,
    getById,
    create,
    update,
    destroy
  };