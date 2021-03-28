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

// const saveCategory = async (req, res) => {
//     let categoryJson = buildCategory(req.body);
//     let category = new Category(categoryJson)
//     let parent = req.body.parent ? req.body.parent : null;

//     try{
//         await category.save();
//         await category.buildAncestors(parent);
//         res.status(201).send({category});
//     } catch(error) {
//         res.status(500).send(error);
//     }
// };

// const relatedCategory = async (req, res) => {
//   const { id } = req.query;
//   try {
//     const category = await Category.findOne({_id: id});

//     if(!category) {
//       return res.status(404).send();
//     }

//     let parentId;
//     if(category.parent === null) {
//       parentId = category._id;
//     } else {
//       parentId = category.parent;
//     }

//     const relatedCategory = await Category.find({parent: parentId, status: STATUS_ACTIVE})
//       .sort({"_id": 1})
//       .limit(10)
//       .exec();
//     res.send({ "status": "success", "result": relatedCategory });
//   } catch(error) {
//     res.status(500).send();
//   }
// };

// const buildCategory = (data) => {
//     let parent = data.parent ? data.parent : null;

//     return {
//         name: data.name,
//         description: data.description,
//         parent,
//         userId: req.user.userId,
//         ancestors: data.ancestors,
//         status: data.status,
//     }
// }

// const findCategory = async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const category = await Category.findOne({_id: req.params.id});

//     if(!category) {
//       return res.status(404).send();
//     }
//     res.send(category);
//   } catch(error) {
//     res.status(500).send();
//   }
// };

// const updateCategory = async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ['name', 'slug', 'parent', 'ancestors', 'status', 'isFeature', 'icon', 'metaTitle', 'metaDesc', 'metaKeyword', 'description'];
//   const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

//   if(!isValidOperation) {
//     return res.status(400).send({error: "Invalid updates!"});
//   }

//   try {
//     const category = await Category.findOne({_id: req.params.id});
//     if(!category) {
//       return res.status(404).send();
//     }

//     updates.forEach((update) => category[update] = req.body[update]);
//     await category.save();
//     res.send(category);
//   } catch(error) {
//     res.status(400).send();
//   }
// };

// const deleteCategory = async (req, res) => {
//   try {
//     const category = await Category.findOneAndDelete({_id: req.params.id});
//     if(!category) {
//       return res.status(404).send();
//     }

//     res.send(category);
//   } catch(error) {
//     res.status(500).send();
//   }
// };

// const findCategoryWithSub = async (req, res) => {
//   try{
//     category = await Category.getCategoryWithSubcateogry(req.query);
//     res.send({ "status": "success", "result": category });
//   } catch(error) {
//     res.status(500).send(error);
//   }
// };

module.exports = {
    listCategory,
    findCategory
}