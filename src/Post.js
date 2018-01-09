import React from 'react';
import axios from 'axios';

export default class Post extends React.Component {
  constructor() {
    super()

    this.state = {
      numberOfComments: 0,
      topComment: "No comments found",
      commentUrl: null,
      author: null
    }

    this.grabData = this.grabData.bind(this);
  }

  componentDidMount() {
    let reqUrl = `https://reddit.com${this.props.permalink}`.slice(0,-1);
    reqUrl += '.json';

    axios.get(reqUrl)
         .then(res => {
           let comments = res.data[1].data.children.sort( (a,b) =>  { return b.score - a.score } );

           this.grabData(comments);
         })
         .catch(err => {
           console.log(err);
         })
  }

  grabData(comments) {
    if (comments) {
      // console.log(comments)
      this.setState({
        numberOfComments: comments.length,
        topComment: comments[0].data.body,
        author: comments[0].data.author
      });
    }
  }


  render() {
    let link = 'http://reddit.com';
    link += this.props.permalink;

    return (
      <div className='post'>
        <div className='score'>
          <h2>Score</h2>
          <p>{this.props.score}</p>
        </div>

        <div className='postContent'>
          <a href={link}> <p className='title'>{this.props.title}</p> </a>
          <div className='commentText'> <strong>TOP COMMENT:</strong>{this.state.topComment} <span className='byline'> `--- {this.state.author}`</span></div>
        </div>
      </div>
    )
  }
}