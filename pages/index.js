import React, { Component } from "react";
import { Button, Container } from "semantic-ui-react";
import Layout from "../components/Layout.js";
import { Link } from "../routes.js";
import web3 from '../ethereum/web3.js';

class SupplyChainIndex extends Component {
    static async getInitialProps(props) {
        const accounts = await web3.eth.getAccounts();

        return { accounts };
    }

    render() {
        return (
            <Layout>
                <Container>
                    <Link route='/'>
                        <Button 
                            fluid 
                            primary={true} 
                            content="Login"
                            style = {{ marginTop: '40px' }}
                        />
                    </Link>
                </Container>
                <Container>
                    <Link route='register'>
                        <Button 
                            fluid 
                            primary={true} 
                            content="Register Participant"
                            style = {{ marginTop: '40px' }}
                        />
                    </Link>
                </Container>
            </Layout>
        )
    }
}

export default SupplyChainIndex;