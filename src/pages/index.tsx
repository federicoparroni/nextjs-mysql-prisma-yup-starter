import Link from 'next/link';

export default function Home() {
  return (
    <>
      <h2>Home</h2>

      <section>
        <Link href="/users">
          <a>Users</a>
        </Link>
      </section>
    </>
  )
}
