const mongoose = require('mongoose');
const validator = require('validator');
// const moment = require('moment');
const _ = require('lodash');
const { STATUS_ACTIVE, STATUS_INACTIVE } = require('../constant/Status');

const categorySchema = mongoose.Schema({
  id: Number,
  name: {
    type: String,
    required: true,
    trim: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Category',
    index: true
  },
  status: {
    type: Number,
    enum: [STATUS_INACTIVE, STATUS_ACTIVE],
    default: STATUS_ACTIVE
  }
}, {
  timestamps: true
});

//Static methods
categorySchema.statics.getActiveCategory = async ({ parent, limit = 10 }) => {
  let condition = { status: STATUS_ACTIVE };
  if (parent) {
    condition.parent = mongoose.Types.ObjectId.isValid(parent) ? parent : null;
  }

  try {
    const result = await Category.find(condition)
      .select({
        "_id": true,
        "name": true,
        "parent": true,
        "status": true
      })
      .limit(limit)
      .exec();

    return result;
  } catch (error) {
    console.log(error)
  }
}

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;