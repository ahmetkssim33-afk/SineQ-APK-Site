const mongoose = require('mongoose');

const appReleaseSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 8000
    },
    version: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40
    },
    logoPath: {
      type: String,
      required: true
    },
    apkPath: {
      type: String,
      required: true
    },
    apkOriginalName: {
      type: String,
      required: true
    },
    apkSizeBytes: {
      type: Number,
      required: true,
      min: 0
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      index: true
    },
    changelog: {
      type: String,
      trim: true,
      maxlength: 6000,
      default: ''
    }
  },
  { timestamps: true, bufferCommands: false }
);

module.exports = mongoose.model('AppRelease', appReleaseSchema);
