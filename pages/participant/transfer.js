import React, { Component } from 'react';
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout.js";
import { Router } from "../../routes.js";
import supplychain from '../../ethereum/supplychain.js'; 

class Register extends Component {
    static async getInitialProps(props) {
        const address = props.query.address;

        return { address };
    }

    state = {
        batchid: '',
        address: '',
        errormessage: ''
    };
    
    
    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ errormessage: '' });
        
        try{
            await supplychain.methods.transferBatch(this.state.batchid, this.state.address)
                .send({
                    from: this.props.address
                });
            Router.pushRoute(`/participant/${this.props.address}/home`);
        }
        catch (err) {
            this.setState({ errormessage: err.message });
        }
    };

    render() {
        return (
            <Layout>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errormessage}>
                        <Form.Field>
                        <Form.Field>
                            <label>Batch ID</label>
                            <Input
                                value={this.state.batchid}
                                onChange={event => this.setState({ batchid: event.target.value })}
                            />
                        </Form.Field>
                            <label>Receiver Address</label>
                            <Input 
                                value={this.state.address}
                                onChange={event => this.setState({ address: event.target.value })}
                            />
                        </Form.Field>
                        <Message error header="Batch not transferred" content={this.state.errormessage} />
                        <Button 
                            fluid 
                            primary={true} 
                            content="Transfer Batch"
                            style = {{ marginTop: '40px' }}
                        />
                    </Form>
                
            </Layout>
        );
    }
}

export default Register;
