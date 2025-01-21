import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../components/Layout.js";
import { Link, Router } from "../routes.js";
import supplychain from '../ethereum/supplychain.js';
import web3 from "../ethereum/web3.js";

class SupplyChainIndex extends Component {

    state = {
        address: '',
        errormessage: '',
        loading: false
    };
    
    onSubmit = async (event) => {
        event.preventDefault();

        if (!web3.utils.isAddress(this.state.address)) {
            this.setState({ errormessage: 'Invalid Ethereum address' });
            return;
        }
        else {
            this.setState({ loading: true, errormessage: '' });

            try {
                const participant = await supplychain.methods.participants(this.state.address).call();
            
                if (participant.name.length === 0) {
                    this.setState({ errormessage: 'Participant not registered' });
                } else {
                    Router.pushRoute(`/participant/${this.state.address}`);
                }
            } catch (error) {
                console.error("Error fetching participant data:", error);
                this.setState({ errormessage: 'An error occurred while fetching participant data.' });
            }

            this.setState({ loading: false });
        }
    };


    render() {
        return (
            <Layout>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errormessage}>
                        <Form.Field>
                            <label>Participant Address</label>
                            <Input 
                                value={this.state.address}
                                onChange={event => this.setState({ address: event.target.value })}
                            />
                        </Form.Field>
                        <Message error header="Error" content={this.state.errormessage} />
                        <Button 
                            loading={this.state.loading}
                            fluid 
                            primary={true} 
                            content="Login"
                            style = {{ marginTop: '40px' }}
                        />
                        <Link route={`register`}>
                            <Button 
                                fluid 
                                primary={true} 
                                content="Register Participant"
                                style = {{ marginTop: '40px' }}
                            />
                        </Link>
                    </Form>
            </Layout>
        )
    }
}

export default SupplyChainIndex;