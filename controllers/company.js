var formidable = require("formidable");
const _ = require('lodash');
const fs = require('fs');
const Company = require('../models/company');

const getCompany = async (req, res) => {
    let {user} = req;
    if (!user || !user._id) {
        return res.status(403).json({
            error: 'Access denied'
        });  
    }
    let company = await Company.findOne({userId: user._id})
    res.send(company)
}

const updateCompany = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // 1kb = 1000
        // 1mb = 1000000
        let image = {};
        if (files.image) {
            // console.log("FILES PHOTO: ", files.image);
            if (files.image.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            image.data = fs.readFileSync(files.image.path);
            image.contentType = files.image.type;
        }

        fields = _.omit(fields, ['uesrId'])
        
        let update = {}
        if(image && image.data) {
            update.image = image;
        }
        if(fields.name) {
            update.name = fields.name;
        }
        if(fields.companyType) {
            update.companyType = fields.companyType;
        }
        if(fields.website) {
            update.website = fields.website;
        }
        if(fields.address) {
            update.address = fields.address;
        }
        if(fields.facebook) {
            update.facebook = fields.facebook;
        }
        if(fields.twitter) {
            update.twitter = fields.twitter;
        }
        if(fields.linkedIn) {
            update.linkedIn = fields.linkedIn;
        }
        if(fields.instagram) {
            update.instagram = fields.instagram;
        }
        if(fields.bio) {
            update.bio = fields.bio;
        }
        if(fields.image) {
            update.image = fields.image;
        }
        if(fields.video) {
            update.video = fields.video;
        }

        Company.findOneAndUpdate({ userId: req.user._id}, update, {new: true}, (error, doc) => {
            if(error) {
                res.send({error})
            }

            res.send(doc)
        });
    });
}


module.exports = {
    getCompany,
    updateCompany
}