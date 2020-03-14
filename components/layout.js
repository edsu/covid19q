const Layout = ({children}) => (
  <html>
    <head>
      <title>#COVID_19 Questions</title>
    </head>
    <body>
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
    </body>
  </html>
)

export default Layout