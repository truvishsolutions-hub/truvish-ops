import Navbar from './components/layout/Navbar/Navbar.jsx'
import Sidebar from './components/layout/Sidebar/Sidebar.jsx'
import CreateOrder from './pages/CreateOrder/CreateOrder.jsx'

import './App.css'

function App() {
    return (
        <div className="app">

            {/* =====================================================
                TOP NAVBAR
            ===================================================== */}
            <Navbar />


            {/* =====================================================
                SIDEBAR
            ===================================================== */}
            <Sidebar />


            {/* =====================================================
                MAIN PAGE
            ===================================================== */}
            <main className="app-main">

                <CreateOrder />

            </main>

        </div>
    )
}

export default App