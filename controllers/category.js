const Category = require('../models/category');
const { STATUS_ACTIVE } = require('../constant/status');

const listCategory = async (req, res) => {
    try {
        category = await Category.getActiveCategory(req.query);
        res.send({ "status": "success", "result": category });
    } catch (error) {
        res.status(500).send(error);
    }
};

const findCategory = async (req, res) => {
    const _id = req.params.id;
    try {
        const category = await Category.findOne({ _id: req.params.id });

        if (!category) {
            return res.status(404).send();
        }
        res.send(category);
    } catch (error) {
        res.status(500).send();
    }
};

const saveCategory = async (req, res) => {
    const data = req.body;

    let categoryData = {
        name: data.name,
        parent: data.parent ? data.parent : null
    }
    let category = new Category(categoryData)

    try{
        await category.save();
        res.status(201).send({category});
    } catch(error) {
        res.status(500).send(error);
    }
};

const updateCategory = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'parent', 'userId', 'status'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if(!isValidOperation) {
    return res.status(400).send({error: "Invalid updates!"});
  }

  try {
    const category = await Category.findOne({_id: req.params.id});
    if(!category) {
      return res.status(404).send();
    }

    updates.forEach((update) => category[update] = req.body[update]);
    await category.save();
    res.send(category);
  } catch(error) {
    res.status(400).send();
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({_id: req.params.id});
    if(!category) {
      return res.status(404).send();
    }

    res.send(category);
  } catch(error) {
    res.status(500).send();
  }
};

module.exports = {
    listCategory,
    findCategory,
    saveCategory,
    updateCategory,
    deleteCategory
}