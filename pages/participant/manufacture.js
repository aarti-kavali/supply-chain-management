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
        name: '',
        expirydate: '',
        errormessage: ''
    };
    
    
    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ errormessage: ''});

        if (isNaN(expiryTimestamp)) {
            this.setState({ errormessage: 'Invalid expiry date. Please provide a valid date.' });
            return;
        }
        
        try{
            await supplychain.methods.manufactureBatch(this.state.name, expiryTimestamp)
                .send({
                    from: this.props.address
                });
            Router.pushRoute(`/participant/${this.props.address}/home`);
        }
        catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred.';
            this.setState({ errormessage: errorMessage });
        }
    };

    render() {
        return (
            <Layout>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errormessage}>
                        <Form.Field>
                        <Form.Field>
                            <label>Batch Name</label>
                            <Input
                                value={this.state.name}
                                onChange={event => this.setState({ name: event.target.value })}
                            />
                        </Form.Field>
                            <label>Expiry Date</label>
                            <Input 
                                value={this.state.expirydate}
                                onChange={event => this.setState({ expirydate: event.target.value })}
                            />
                        </Form.Field>
                        <Message error header="Manufacture Error" content={this.state.errormessage} />

                        <Link route={`/participant/${this.props.address}`}>
                            <a>
                                <Button primary>Back</Button>
                            </a>
                        </Link>
                        <Button primary>Manufacture Batch</Button>
                    </Form>
                
            </Layout>
        );
    }
}

export default Register;