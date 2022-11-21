import type { NextPage } from 'next'
import NavBar from '../../components/navbar/NavBar'

const Home: NextPage = () => {
    return (
        <div className="flex flex-row">
            <NavBar />
            <div className="min-h-screen w-full"></div>
        </div>
    )
}

export default Home
