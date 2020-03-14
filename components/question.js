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
      <div className="avatar">
        <img src={avatar} title={screenName} />
      </div>
      <div className="text">
        {text}
      </div>
      <style jsx>{`
        .question {
          margin: 10px;
          padding: 5px;
          font-size: 18pt;
          display: flex;
          border: thin solid #ddd;
          cursor: pointer;
          transition: 1s;
        }
        .avatar img {
          max-width: 100px;
        }
        .text {
          align-self: flex-start;
          margin-left: 20px;
        }
      `}</style>
    </div>
  )
}

export default Question