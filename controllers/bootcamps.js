const Bootcamp = require('../models/bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const errorResponse = require('../utils/response');

// @dese       Get all bootcamps
// @route      GET/api/v1/bootcamps
// @access     Public
const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @dese       Get one bootcamp
// @route      GET/api/v1/bootcamps/:id
// @access     Public
const getBootcamp = asyncHandler(async (req, res, next) => {
  const { id: bootCampID } = req.params;
  const bootcamp = await Bootcamp.findOne({ _id: bootCampID });
  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp not found with id ${bootCampID}`),
      404
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @dese       Create all bootcamps
// @route      POST/api/v1/bootcamps
// @access     Public
const createBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @dese       Update all bootcamps
// @route      PUT/api/v1/bootcamps/:id
// @access     Public
const updateBootcamps = asyncHandler(async (req, res, next) => {
  const { id: bootCampID } = req.params;

  const bootcamp = await Bootcamp.findOneAndUpdate(
    { _id: bootCampID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp not found with id ${bootCampID}`),
      404
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @dese       Delete all bootcamps
// @route      GET/api/v1/bootcamps
// @access     Public
const deleteBootcamps = asyncHandler(async (req, res, next) => {
  const { id: bootCampID } = req.params;
  const bootcamp = await Bootcamp.findOne({ _id: bootCampID });
  if (!bootcamp) {
    return next(
      new errorResponse(`Bootcamp not found with id ${bootCampID}`),
      404
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private

const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamps,
  deleteBootcamps,
  getBootcampsInRadius,
};
