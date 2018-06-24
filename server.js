'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { blogPost } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());

app.get('/posts', (req, res) => {
  blogPost
    .find()
    .then(posts => {
      res.json(
        posts.map(
          (post) => post.serialize()));
    });

    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'app.get error!' });
    });
});

app.get('/posts/:id', (req, res) => {
  blogPost

    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'app.get:id error!' });
    });
});

//app.get('/restaurants', (req, res) => {
  //Restaurant
    //.find()
    
    //.limit(10)
    
    //.then(restaurants => {
      //res.json({
        //restaurants: restaurants.map(
          //(restaurant) => restaurant.serialize())
      //});
    //})
    //.catch(err => {
      //console.error(err);
      //res.status(500).json({ message: 'Internal server error' });
    //});
//});


//app.get('/restaurants/:id', (req, res) => {
  //Restaurant
    
    //.findById(req.params.id)
    //.then(restaurant => res.json(restaurant.serialize()))
    //.catch(err => {
      //console.error(err);
      //res.status(500).json({ message: 'Internal server error' });
    //});
//});


app.post('/posts', (req, res) => {

  const requiredFields = ['author', 'title', 'content'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  blogPost
    .create({
      author: req.body.author
      title: req.body.title,
      content: req.body.content,
    })
    .then(blogPost => res.status(201).json(blogPost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'blogpost create error!' });
    });

});


//app.post('/restaurants', (req, res) => {

  //const requiredFields = ['name', 'borough', 'cuisine'];
  //for (let i = 0; i < requiredFields.length; i++) {
    //const field = requiredFields[i];
    //if (!(field in req.body)) {
      //const message = `Missing \`${field}\` in request body`;
      //console.error(message);
      //return res.status(400).send(message);
    //}
  //}

  //Restaurant
    //.create({
      //name: req.body.name,
      //borough: req.body.borough,
      //cuisine: req.body.cuisine,
      //grades: req.body.grades,
      //address: req.body.address
    //})
    //.then(restaurant => res.status(201).json(restaurant.serialize()))
    //.catch(err => {
      //console.error(err);
      //res.status(500).json({ message: 'Internal server error' });
    //});
//});


app.delete('/posts/:id', (req, res) => {
  blogPost
    .findByIdAndRemove(req.params.id)
    .then(blogPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//app.delete('/restaurants/:id', (req, res) => {
  //Restaurant
    //.findByIdAndRemove(req.params.id)
    //.then(restaurant => res.status(204).end())
    //.catch(err => res.status(500).json({ message: 'Internal server error' }));
//});
