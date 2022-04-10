import AppLayout from "../components/AppLayout";
import '../app.css'

export default function App({ Component, pageProps }) {
  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  )
}
