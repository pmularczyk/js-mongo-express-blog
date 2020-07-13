const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();
mongoose.connect(
  'mongodb://localhost:27017/postDB',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const homeContent = "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const aboutContent = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
const contactContent = "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  content: {
    type: String,
    required: true
  },
});
const Post = mongoose.model('Post', postSchema);

const post1 = new Post({
  title: "Initial post",
  content: "Hello friends on the internet, here I want to share my thoughts and progress on programming. Hope you enjoy."
})

app.get('/', (req, res) => {
  Post.find({}, (err, results) => {
    if (results.length === 0) {
      post1.save(err => {
        if (err) console.log(err);
        else console.log('Initial instance saved')
      });
      res.redirect('/')
    } else {
      res.render('home', {content: homeContent, posts: results})
    }
  });
})

app.get('/about', (req, res) => {
  res.render('about', { content: aboutContent })
})

app.get('/contact', (req, res) => {
  res.render('contact', { content: contactContent })
})

app.get('/compose', (req, res) => {
  res.render('compose')
})

app.get('/posts/:postTitle', (req, res) => {
  postTitle = _.lowerCase(req.params.postTitle);

  Post.find({}, (err, results) => {
    console.log(results)
    results.forEach(result => {
      let resultTitle = _.lowerCase(result.title);
      console.log(resultTitle)
    })
  })
})

app.post('/compose', (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  post.save(function (err) {
    if (err) console.log(err);
    else res.redirect('/');
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, () => console.log('App successfully started'));