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
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'You must supply an author']
    }
}, {
    toJson: { virtuals: true},
    toObject: {virtuals: true},
});

//define our index

storeSchema.index({
    name: 'text',
    description: 'text'
});

storeSchema.index({ location: '2dsphere'});

//slug the store name
storeSchema.pre('save', async function (next) {
    if(!this.isModified('name')) {
        next(); 
        return; 
    }
    this.slug = slug(this.name);

    //find store with matching names
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
    const storesWithSlug = await this.constructor.find({ slug:slugRegEx });
    if(storesWithSlug.length){
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`
    };
    next();
});

storeSchema.statics.getTagsList = function () {
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } }},
        { $sort: {count: -1 }}
    ]);
};

storeSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'store'
});

module.exports = mongoose.model('Store', storeSchema);

