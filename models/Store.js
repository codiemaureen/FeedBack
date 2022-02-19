const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');


const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'You must Supply a name!'],
    },
    slug: String,
    description: {
        type: String,
        trim: true,
    },
    tags: [String],
})

//slug the store name
storeSchema.pre('save', function (next) {
    if(!this.isModified('name')) {
        next(); 
        return; 
    }
    this.slug = slug(this.name);
    next();
});



module.exports = mongoose.model('Store', storeSchema);

