import mongoose, { Schema } from 'mongoose';
import { IFile } from '../types';

const FileSchema = new Schema<IFile>(
  {
    name: {
      type: String,
      required: [true, 'Please enter file name'],
      trim: true,
      maxlength: [255, 'File name cannot exceed 255 characters'],
    },
    type: {
      type: String,
      required: function() { 
        return !(this as IFile).isFolder; 
      },
    },
    size: {
      type: Number,
      required: function() { 
        return !(this as IFile).isFolder; 
      },
      default: 0,
    },
    path: {
      type: String,
      required: function() { 
        return !(this as IFile).isFolder; 
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,  // Changed Schema.Types to mongoose.Schema.Types
      ref: 'User',
      required: true,
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,  // Changed Schema.Types to mongoose.Schema.Types
      ref: 'File',
      default: null,
      index: true,
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,  // Changed Schema.Types to mongoose.Schema.Types
        ref: 'User',
      },
    ],
    isFolder: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for search optimization
FileSchema.index({ name: 'text', type: 'text' });

// Pre middleware to cascade delete all files within a folder
FileSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const fileId = this._id;
  
  // Find and delete all files/folders that have this document as parent
  await mongoose.model('File').deleteMany({ parent: fileId });
});

export default mongoose.model<IFile>('File', FileSchema);
