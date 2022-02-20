const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');


const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'You must supply a name!']
    },
    slug: String,
    description: {
        type: String,
        trim: true,
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: [true, 'You must supply coordinates']
        }],
        address: {
            type: String,
            required: [true, 'You must supply an address']
        },
    },
    photo: String,
});

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

