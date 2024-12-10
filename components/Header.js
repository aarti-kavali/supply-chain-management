import { Menu } from "semantic-ui-react"

const Header = () => {
    return (
        <Menu style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px' }}>
            <Menu.Item style={{ flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ margin: 0 }}>Supply Chain</h1>
            </Menu.Item>
        </Menu>

    )
}

export default Header;