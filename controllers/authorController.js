var Author = require('../models/author');
var Book =  require('../models/book');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Authors.
// Display list of all Authors.
exports.author_list = function(req, res, next) {

    Author.find()
      .sort([['family_name', 'ascending']])
      .exec(function (err, list_authors) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('author_list', { title: 'Author List', author_list: list_authors });
      });
  
  };

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {
    
    async.parallel({
        author: function(callback){
            Author.findById(req.params.id).exec(callback);
        },
        author_books: function(callback){
            Book.find({'author': req.params.id}).exec(callback);
        }
    }, function(err, results){
        if(err){ return next(err);}
        if(results.author == null){
            var err = new Error('No author found');
            err.status = 404;
            return next(err);   
        }
        res.render('author_detail', {title: 'Author', author: results.author, author_books: results.author_books });
    }
);
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.render('author_form', {title: 'Create Author'});
};

// Handle Author create on POST.
exports.author_create_post = [
    body('first_name').isLength({min: 1}).trim().withMessage('Author first name required')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters'),
    body('family_name').isLength({min: 1}).trim().withMessage('Author family name required')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters'),
    body('date_of_birth', 'Date of birth is not valide').optional({ checkFalsy: true}).isISO8601(),
    body('date_of_death', 'Date of death is not valide').optional({ checkFalsy: true}).isISO8601(),

    sanitizeBody('first_name').escape().trim(),
    sanitizeBody('first_name').escape().trim(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').escape().toDate(),


    (req, res, next) => {
        const errors = validationResult(req);

        var author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
        });
        if(req.body.date_of_birth != null) author.date_of_birth = req.body.date_of_birth;
        if(req.body.date_of_death != null) author.date_of_death = req.body.date_of_death;
        //res.send(author);
        if(!errors.isEmpty()){
            res.render('author_form', {title: 'Create author', author: author, errors: errors.array()});
            return;
        }
        else{
            author.save(function(err){
                if(err){return next(err);}
                else{
                    res.redirect(author.url)
                }
            });
        }
    }
];

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};