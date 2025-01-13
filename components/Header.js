import { Menu } from "semantic-ui-react";
import { Link } from "../routes.js";

const Header = () => {
    return (
        <Menu style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px' }}>
            <Link route='/'>
                <Menu.Item style={{ flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h1 style={{ margin: 0 }}>Supply Chain</h1>
                </Menu.Item>
            </Link>
        </Menu>

    )
}

export default Header;