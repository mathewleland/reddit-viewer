import React, { Component } from 'react';
import logo from './reddit.svg';
import './App.css';
import axios from 'axios';
import Post from './Post';

class App extends Component {
  constructor() {
    super()

    this.state = {
      posts: [],
      query: ''
    }
    
    this.getPosts = this.getPosts.bind(this);
    this.renderPost = this.renderPost.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.filterPosts = this.filterPosts.bind(this);
  }

  componentDidMount() {
    const defaultSubs = ['programming', 'webdev', 'coding', 'reverseengineering', 'startups', 'python', 'javascript', 'ruby', 'cpp'];
    defaultSubs.map(this.getPosts);
    // this.getPosts('funny');
  }

  getPosts(subreddit) {
    axios.get(`https://www.reddit.com/r/${subreddit}.json`)
         .then(res => {
           let posts = res.data.data.children;
           let noStickies = posts.filter( post => !post.data.stickied );
           
           let addedPosts = this.state.posts;           
           noStickies.forEach( post => addedPosts.push(post));

           this.setState({
            posts: addedPosts
           });
    
         })
         .catch(err => {
           console.log(err);
         })
  }

  renderPost(p) {
    const props = {
      key: p.data.id,
      id: p.data.id,
      title: p.data.title,
      permalink: p.data.permalink,
      ups: p.data.ups,
      score: p.data.score
    }
    return (<Post {...props} />);
  }

  filterPosts() {
    const query = this.state.query.toLowerCase();
    let matches = [];

    this.state.posts.map(post => {
      if (post.data.title.toLowerCase().indexOf(query) > -1) {
        matches.push(post)
      };
    });

    this.setState({
      posts: matches
    })
  }

  handleChange(e) {
    this.setState({ query: e.target.value });
  }

  handleSubmit(e) {
    console.log('submitted');
    e.preventDefault();
    this.filterPosts();
  }
 
  render() {
    let posts = this.state.posts;
    let sorted = posts.sort( (a,b) => {
      return b.data.score - a.data.score;
    }).slice(0,25);

    posts = sorted.map(this.renderPost);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Reddit Viewer</h1>
        </header>


        <div className="content">
          <form onSubmit={this.handleSubmit}>
            <label> Search the posts from the front pages  </label>
            <input onChange={this.handleChange} value={this.state.query}/>
          </form>

          
          {posts}
        </div>
      </div>
    );
  }
}

export default App;
