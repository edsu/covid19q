import Head from 'next/head'

const Layout = ({children}) => (
  <div>
    <Head>
      <title>#COVID_19 Questions</title>
    </Head>
    <header>
      #COVID_19 Questions?
    </header>
    {children}
    <style jsx>{`
      header {
        font-size: 22pt;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
      }
    `}</style>
  </div>
)

export default Layout