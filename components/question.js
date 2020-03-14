const openTweet = (screenName, id) => {
  window.open(`https://twitter.com/${screenName}/status/${id}`, '_blank')
}

const Question = ({id, screenName, text, avatar}) => {
  text = text.replace(/https:\/\/[^ ]+/, '')

  return (
    <div 
      key={id} 
      className="question" 
      onClick={() => openTweet(screenName, id)}>
      <img src={avatar} title={screenName} />
      {text}
      <style jsx>{`
        .question {
          margin: 20px;
          padding: 5px;
          font-size: 18pt;
          border: thin solid #ddd;
          cursor: pointer;
        }
        img {
          float: left;
          margin-right: 10px;
          vertical-align: bottom;
        }
      `}</style>
    </div>
  )
}

export default Question