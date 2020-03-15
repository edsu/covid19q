import React from 'react'
import Layout from '../components/layout'
import Question from '../components/question'

class Index extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      questions: [],
      lang: "all",
      langs: [],
      seenLangs: new Map()
    }
    this.setLang = this.setLang.bind(this)
  }

  componentDidMount() {
    this.getLangs()
    this.setupStream()
  }

  render() {

    let LangSelect = ""
    if (this.state.langs.keys) {
      LangSelect = (
        <select value={this.state.lang} name="lang" onChange={this.setLang}>
          {this.state.langs.map(l => {
            let count = this.state.seenLangs.get(l[1])
            if (count) {
              count = `(${count} seen)`
            } else {
              count = ''
            }
            return <option key={l[1]} value={l[1]}>{l[0]} {count}</option>
          })}
        </select>
      )
    }

    return (
      <Layout>
        <section id="filter">
          filter by language: {LangSelect}
        </section>
        <section id="questions">
          {this.state.questions.map(q => (
            <Question 
              key={q.id}
              id={q.id}
              text={q.text}
              screenName={q.screenName}
              lang={q.lang}
              avatar={q.avatar} />
          ))}
        </section>
        <style jsx>{`
          #questions {
            margin-left: auto;
            margin-right: auto;
            max-width: 800px;
          }
          #filter {
            margin-left: auto;
            margin-right: auto;
            text-align: center;
          }
        `}</style>
      </Layout>
    )
  }

  getLangs() {
    fetch('langs.json')
      .then(r => r.json())
      .then(langs => {
        this.setState({langs})
      })
  }

  setupStream() {
    this.events = new EventSource('/questions')
    this.events.onmessage = (event) => {
      const q = JSON.parse(event.data)

      // increment the count for this language
      const seenLangs = new Map(this.state.seenLangs)
      const langCount = seenLangs.get(q.lang) || 0
      seenLangs.set(q.lang, langCount + 1)
      this.setState({seenLangs})

      // only update the visiable questions if the language is correct
      if (this.state.lang == "all" || this.state.lang == q.lang) {
        const questions = [
          q,
          ...this.state.questions
        ].slice(0, 20)
        this.setState({questions})
      }
    }
  }

  setLang(e) {
    this.setState({lang: e.target.value})
  }


}

export default Index
