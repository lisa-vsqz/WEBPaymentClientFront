import Document, { Html, Head, Main, NextScript } from 'next/document'

 
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
          />
           <link
                  rel="stylesheet"
                  href="https://moja-rockies.paymentevolution.com/V3/Content/Content/sass/Site.css"
                />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
 
export default MyDocument