const { Schema, model } = require('mongoose');
const moment = require('moment')

// this is a subdocument and the reason why we initialize it befor the commentSchema because, we need to init something before we can invoque it
const ReactionSchema = new Schema( 
  {
    // set custom id to avoid confusion with parent comment _id.  just to remember that this schema is not a new table
    reactionId: { 
      type: Schema.Types.ObjectId, // this is a way to create another id, because mangoose wont create ID's for you when it comes to subdocuments
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280 
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a') // getter 
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);


const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1, 
      maxlength: 280 
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Added a gatter to transform our date
      get: createdAtVal => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a') // getter 
    },
    username: {
      type: String,
      required: true
    },
    reactions: [ReactionSchema] 
  },
  { // this will allow us to add virtuals
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false //We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
  }
);
ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// create the Pizza model using the PizzaSchema
const Thought = model('thought', ThoughtSchema);

// export the Pizza model
module.exports = Thought;