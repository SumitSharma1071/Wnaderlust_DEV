const listing = require('../model/listing.js');

module.exports.index = async (req, res) =>{
    const allListings = await listing.find({});
    res.render("listings/listing.ejs", {allListings});
}

module.exports.newGet =  (req, res) =>{
    res.render('listings/new.ejs');
}

module.exports.newPost = async (req, res) =>{
    let url = req.file.path;
    let  filename = req.file.filename;
    let newListing = new listing({...req.body.listing});
    newListing.owner = req.user.id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash('success', 'New Listing Created');
    res.redirect('/listing');
}

module.exports.editGet = async (req, res) =>{
    let {id} = req.params;
    let listingDetails = await listing.findById(id);
        if(!listingDetails){
            req.flash('error', 'listing which yoou want to access does not exist');
            res.redirect('/listing');
        }else{ 
            res.render('listings/edit.ejs', {list : listingDetails});
        }
}

module.exports.editPut = async (req, res) =>{
    let {id} = req.params;
       let listings =  await listing.findByIdAndUpdate(id, {...req.body.listing});

        if(typeof req.file !== 'undefined'){ 
        let url = req.file.path;
        let filename = req.file.filename;
        listings.image = {url, filename};
        await listings.save();
        }
        req.flash('success', "Listing Updated!");
        res.redirect('/listing/' + id);
}

module.exports.showList = async (req, res) =>{
    let {id} = req.params;
        const listingDetails = await listing.findById(id).populate(
            {path : 'reviews',
             populate : {path : 'author'}
            }).populate('owner');
        if(!listingDetails){
            req.flash('error', 'listing does not exist!');
            res.redirect('/listing');
        }else{ 
        res.render("listings/show.ejs", {listingDetails});
        }
}

module.exports.deleteList = async(req, res) =>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', 'listing Deleted!');
    res.redirect('/listing');
}

module.exports.category = async (req, res) => {
    let { name } = req.params;

    const allListings = await listing.find({ category: name });

    res.render("listings/listing.ejs", { allListings });
}

module.exports.search =  async (req, res) => {
    let { q } = req.query;

    const allListings = await listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } }
        ]
    });

    if(allListings.length == 0){
        req.flash('error', " Sorry ! Nothing is here Relevant to this");
        res.redirect('/listing');
        return;
    }

    res.render("listings/listing.ejs", { allListings });
}