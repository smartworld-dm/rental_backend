var Item = require('../models/item');
var mongoose = require('mongoose');

exports.get_all_items = (req, res) => {
    Item.find({}, (error, items) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(items);
    });
};

exports.get_item_by_id = (req, res) => {
    Item.findOne({_id: req.params.id}, function(err, item){
        if(err) return res.status(500).json({error: err});
        if(!item) return res.status(404).json({error: 'item not found'});
        res.set('Access-Control-Allow-Origin', '*');
        res.status(200).json(item);
    })
};

exports.create_item = (req, res) => {
    console.log('create_item');
    var item = new Item();
    item.small_description = req.body.small_description;
    item.full_description = req.body.full_description;
    item.title = req.body.title;
    var category = mongoose.Types.ObjectId(req.body.category);
    item.category = category;
    item.active = true;
    item.price = req.body.price;
    var user = mongoose.Types.ObjectId(req.body.user);
    item.user = user;
    item.images = req.body.images;
    item.quantity = req.body.quantity;


    item.save(function(err){
        if(err){
            console.error(err);
            res.status(404).json({error: 'failed to create item'});
            return;
        }

        res.status(201).json({message: 'item created!'});
    }); 
}

exports.update_item = (req, res) => {
    Item.update({ _id: req.params.id }, { $set: req.body }, function(err, output){
        if(err) res.status(500).json({ error: 'database failure' });
        console.log(output);
        if(!output.n) return res.status(404).json({ error: 'item not found' });
        res.json( { category: 'item updated' } );
    });
};

exports.delete_item  = (req, res) => {
    Item.remove({ _id: req.params.id }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });
        res.status(204).end();
    });
};