const { Schema, model } = require('mongoose');
const Thought = require('./Thought');
const moment = require('moment')

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/] 
    },
    // this will include all the data from the thought model while both id's are = 
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thought'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    ],

  },
  { // this will allow us to add virtuals
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false //We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
  }
);
//Here we set a virtual to get the total count of comments and replies on retrieval
UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// create the Pizza model using the PizzaSchema
const User = model('user', UserSchema);

// export the Pizza model
module.exports = User;