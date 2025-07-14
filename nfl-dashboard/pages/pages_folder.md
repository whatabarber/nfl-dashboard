# Pages Folder Files

## pages/_app.js
```javascript
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

## pages/_document.js
```javascript
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

## pages/index.js
```javascript
import Dashboard from '../components/Dashboard'

export default function Home() {
  return <Dashboard />
}
```