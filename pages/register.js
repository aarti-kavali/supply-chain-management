import React, { Component } from 'react';
import { Button, Container, Form, Input, Message } from "semantic-ui-react";
import Layout from "../components/Layout.js";
import { Router } from "../routes.js";
import supplychain from '../ethereum/supplychain.js'; 

class Register extends Component {

    state = {
        address: '',
        name: '',
        role: '',
        errormessage: ''
    };
    
    onSubmit = async (event) => {
        event.preventDefault();
        
        try{
            await supplychain.methods.registerParticipant(this.state.address, this.state.name, this.state.role)
                .send({
                    from: this.state.address
                })
            Router.pushRoute(`index`);
        }
        catch (err) {
            this.setState({ errormessage: err.message });
        }
    };

    handleRoleChange = (event) => {
        this.setState({ role: event.target.value });
    };
    render() {
        return (
            <Layout>
                <Container>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errormessage}>
                        <Form.Field>
                        <Form.Field>
                            <label>Participant Address</label>
                            <Input
                                value={this.state.address}
                                onChange={event => this.setState({ address: event.target.value })}
                            />
                        </Form.Field>
                            <label>Name</label>
                            <Input 
                                value={this.state.name}
                                onChange={event => this.setState({ name: event.target.value })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Role</label>
                            <select class="ui fluid dropdown"
                                value={this.state.role}
                                onChange={this.handleRoleChange}>
                                <option value="">Select Role</option>
                            <option value="0">Manufacturer</option>
                            <option value="1">Distributor</option>
                            <option value="2">Warehouse</option>
                            <option value="3">Pharmacy</option>
                            </select>
                        </Form.Field>
                        <Message error header="Participant could not be registered"
                         content={this.state.errormessage} />
                        <Button 
                            fluid 
                            primary={true} 
                            content="Register Participant"
                            style = {{ marginTop: '40px' }}
                        />
                    </Form>
                    
                </Container>
                
            </Layout>
        );
    }
}

export default Register;