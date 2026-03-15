// listingController.js
const Listing = require('../model/listing.js');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/listing.ejs", { allListings });
};

module.exports.newGet = (req, res) => {
    res.render('listings/new.ejs');
};

module.exports.newPost = async (req, res) => {
    try {
        if (!req.file) {
            req.flash('error', 'No image uploaded!');
            return res.redirect('/listing/new');
        }
        const { url, filename } = req.file;
        const newListing = new Listing({ ...req.body.listing });
        newListing.owner = req.user.id;
        newListing.image = { url, filename };
        console.log(newListing)
        await newListing.save();
        req.flash('success', 'New Listing Created');
        res.redirect('/listing');
    } catch (err) {
        console.error("Listing create error:", err);
        req.flash('error', 'Something went wrong!');
        res.redirect('/listing/new');
    }
};

module.exports.editGet = async (req, res) => {
    const { id } = req.params;
    const listingDetails = await Listing.findById(id);
    if (!listingDetails) {
        req.flash('error', 'Listing does not exist');
        return res.redirect('/listing');
    }
    res.render('listings/edit.ejs', { list: listingDetails });
};

module.exports.editPut = async (req, res) => {
    const { id } = req.params;
    const listings = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file) {
        const { path: url, filename } = req.file;
        listings.image = { url, filename };
        await listings.save();
    }
    req.flash('success', "Listing Updated!");
    res.redirect('/listing/' + id);
};

module.exports.showList = async (req, res) => {
    const { id } = req.params;
    const listingDetails = await Listing.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');
    if (!listingDetails) {
        req.flash('error', 'Listing does not exist!');
        return res.redirect('/listing');
    }
    res.render("listings/show.ejs", { listingDetails });
};

module.exports.deleteList = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listing');
};

module.exports.category = async (req, res) => {
    const { name } = req.params;
    const allListings = await Listing.find({ category: name });
    res.render("listings/listing.ejs", { allListings });
};

module.exports.search = async (req, res) => {
    const { q } = req.query;
    const allListings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } }
        ]
    });
    if (allListings.length === 0) {
        req.flash('error', "Sorry! Nothing relevant found.");
        return res.redirect('/listing');
    }
    res.render("listings/listing.ejs", { allListings });
};