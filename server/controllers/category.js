var Category = require('../models/category');
exports.get_all_categories = (req, res) => {
    Category.find({}, (error, categories) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(categories);
    });
};

exports.get_category_by_id = (req, res) => {
    Category.findOne({_id: req.params.id}, function(err, category){
        if(err) return res.status(500).json({error: err});
        if(!category) return res.status(404).json({error: 'category not found'});
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(category);
    })
};

exports.create_category = (req, res) => {
    var category = new Category();
    category.name = req.body.name;
    
    category.save(function(err){
        if(err){
            console.error(err);
            res.status(404).json({error: 'failed to create category'});
            return;
        }

        res.status(201).json({message: 'category created!'});
    }); 
}

exports.update_category = (req, res) => {
    Category.update({ _id: req.params.id }, { $set: req.body }, function(err, output){
        if(err) res.status(500).json({ error: 'database failure' });
        console.log(output);
        if(!output.n) return res.status(404).json({ error: 'category not found' });
        res.json( { category: 'category updated' } );
    });
};

exports.delete_category = (req, res) => {
    Category.remove({ _id: req.params.id }, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });
            res.status(204).end();
    });
};