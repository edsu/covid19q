import React from 'react'
import Layout from '../components/layout'
import Question from '../components/question'


class Index extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      questions: []
    }
  }

  componentDidMount() {
    this.events = new EventSource('/questions')
    this.events.onmessage = (event) => {
      if (scrollTop()) {
        const q = JSON.parse(event.data)
        const questions = [
          q,
          ...this.state.questions
        ].slice(0, 20)
        this.setState({questions})
      }
    }
  }

  render() {
    return (
      <Layout>
        <section id="questions">
          {this.state.questions.map(q => (
            <Question 
              key={q.id}
              id={q.id}
              text={q.text}
              screenName={q.screenName}
              avatar={q.avatar} />
          ))}
          <style jsx>{`
            section {
              margin-left: auto;
              margin-right: auto;
              max-width: 800px;
            }
          `}</style>
        </section>
      </Layout>
    )
  }

}

function scrollTop() {
  const e = document.getElementById('questions')
  console.log(e.scrollTop)
  return true
}

export default Index
