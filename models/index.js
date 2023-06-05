const User = require("./User");
const Event = require("./Event");
const EventComment = require("./EventComment");
const EventPhoto = require("./EventPhoto");
const Friends = require('./Friends');
const EventLike = require('./EventLike');


const cascade = {
    onDelete: "CASCADE",
};

// User
User.hasMany(Event, cascade);
User.hasMany(EventComment, cascade);
User.hasMany(EventLike, cascade);
User.belongsToMany(User, {through: Friends, as: 'Right', foreignKey: {name: 'LeftId'}});

// Event
Event.hasMany(EventComment, cascade);
Event.hasMany(EventPhoto, cascade);
Event.hasMany(EventLike, cascade);
Event.belongsTo(User);

// Event Comment
EventComment.belongsTo(Event);
EventComment.belongsTo(User);

// Event Photo
EventPhoto.belongsTo(Event);


module.exports = {
    User: User,
    Event: Event,
    EventComment: EventComment,
    EventPhoto: EventPhoto,
    EventLike: EventLike,
    Friends: Friends,
};
