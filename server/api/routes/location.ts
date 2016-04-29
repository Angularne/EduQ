import express = require('express');
import {Location, LocationDocument} from '../models/location';
import {Request, Response, NextFunction} from "express";


var router = express.Router();

/** TODO: Handle image upload */




/** POST: Create location */
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  var location = new Location(req.body);

console.log(location);
  if (!/Admin/i.test(req.authenticatedUser.rights)) {
    return res.status(403).end();
  }

  if (!location.name) {
    return res.status(400).json({message: 'name not set'});
  }

  location.count = location.count || 0;

  location.save((err) => {
    if (!err) {
      res.json(location);
    } else {
      res.status(400).json(err);
    }
  });
});

/** GET: Get all locations */
router.get('', (req: Request, res: Response, next: NextFunction) => {

  if (!/Admin|Teacher/i.test(req.authenticatedUser.rights)) {
    return res.status(403).end();
  }

  Location.find({}).exec((err, locations) => {
    if (!err) {
      res.json(locations);
    } else {
      res.status(400).json(err);
    }
  });
});

/** GET: Get location */
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  var id: string = req.params.id;

  if (!/Admin|Teacher/i.test(req.authenticatedUser.rights)) {
    return res.status(403).end();
  }

  Location.findById(id).exec((err, location) => {
    if (!err) {
      res.json(location);
    } else {
      res.status(400).json(err);
    }
  });
});


/** PUT: Update location */
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  var id: string = req.params.id;

  if (!/Admin/i.test(req.authenticatedUser.rights)) {
    return res.status(403).end();
  }

  let update: LocationDocument = req.body;

  delete update.imagePath;

  Location.findOneAndUpdate({_id: id}, update, {new: true}).exec((err, location) => {
    if (!err) {
      res.json(location);
    } else {
      res.status(400).json(err);
    }
  });
});

/** PUT: Update location */
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  var id: string = req.params.id;

  if (!/Admin/i.test(req.authenticatedUser.rights)) {
    return res.status(403).end();
  }

  let update = req.body;

  Location.findOneAndUpdate({_id: id}, update, {new: true}).exec((err, location) => {
    if (!err) {
      res.json(location);
    } else {
      res.status(400).json(err);
    }
  });
});



/** DELETE: Delete location */
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  var id: string = req.params.id;

  if (!/Admin/i.test(req.authenticatedUser.rights)) {
    return res.status(403).end();
  }

  Location.findOneAndRemove({_id: id}).exec((err, location) => {
    if (!err) {
      res.json(location);
    } else {
      res.status(400).json(err);
    }
  });
});







module.exports = router;
