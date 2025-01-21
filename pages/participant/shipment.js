import React, { Component } from 'react';
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout.js";
import { Link, Router } from "../../routes.js";
import supplychain from '../../ethereum/supplychain.js'; 

class Register extends Component {
    static async getInitialProps(props) {
        const address = props.query.address;

        return { address };
    }

    state = {
        batchid: '',
        address: '',
        errormessage: '',
        loading: false
    };
    
    
    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errormessage: '' });
        
        try{
            await supplychain.methods.registerShipment(this.state.batchid, this.state.address)
                .send({
                    from: this.props.address
                });
            Router.pushRoute(`/participant/${this.props.address}`);
        }
        catch (err) {
            this.setState({ errormessage: err.message });
        }

        this.setState({ loading : false });
    };

    render() {
        return (
            <Layout>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errormessage}>
                        <Form.Field>
                            <label>Batch ID</label>
                            <Input
                                value={this.state.batchid}
                                onChange={event => this.setState({ batchid: event.target.value })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Receiver Address</label>
                            <Input 
                                value={this.state.address}
                                onChange={event => this.setState({ address: event.target.value })}
                            />
                        </Form.Field>
                        <Message error header="Shipment Not Registered" content={this.state.errormessage} />

                        <Link route={`/participant/${this.props.address}`}>
                            <a>
                                <Button primary>Back</Button>
                            </a>
                        </Link>
                        <Button loading={this.state.loading} primary>Register Shipment</Button>
                    </Form>
                
            </Layout>
        );
    }
}

export default Register;
