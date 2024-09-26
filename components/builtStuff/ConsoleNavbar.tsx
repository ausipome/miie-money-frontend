import  '../css/ConsoleNavbar.css';

export default function ConsoleNavbar() {
    return (
        <nav className="navbar text-xl">
          <ul className="menu">
          <li className="menu-item hovCol">
            <span>
              <button className='activeCol'>Payments</button>
                </span>
            </li>
            <li className="menu-item hovCol">
              <span>
                <button>Create</button>
                </span>
              <ul className="submenu">
                <li className="submenu-item hovColSub">
                <button>Payment Link</button>
                </li>
                <li className="submenu-item hovColSub">
                <button>Invoice</button>
                </li>
                <li className="submenu-item hovColSub">
                <button>Subscription</button>
                </li>
              </ul>
            </li>
            <li className="menu-item hovCol">
            <span>
            <button>Issued</button>
                </span>
              <ul className="submenu">
                <li className="submenu-item hovColSub">
                <button>Payment Link</button>
                </li>
                <li className="submenu-item hovColSub">
                <button>Invoice</button>
                </li>
                <li className="submenu-item hovColSub">
                <button>Subscription</button>
                </li>
              </ul>
            </li>
            <li className="menu-item hovCol">
            <span>
            <button>Customers</button>
                </span>
            </li>
          </ul>
        </nav>
      )

};