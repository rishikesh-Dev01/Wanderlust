const joi = require('joi');
const Review = require('./src/Models/review.model');

const listingSchema = joi.object({
     listing: joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string().required(),
      country: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.object({
         filename: joi.string().allow("", null),
         url: joi.string().allow("", null)
      }),
     }).required()
});


const reviewSchema = joi.object({
   review: joi.object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
   }).required(),
});

const todoSchema = joi.object({
   todo: joi.object({
      title: joi.string().required().trim().max(200),
      description: joi.string().allow("", null).max(1000),
      priority: joi.string().valid('low', 'medium', 'high'),
      dueDate: joi.date().allow("", null),
      completed: joi.boolean(),
   }).required(),
});

 
module.exports = {listingSchema, reviewSchema, todoSchema}