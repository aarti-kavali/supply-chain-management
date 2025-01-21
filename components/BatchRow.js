import React, { Component } from 'react';
import { Button, Form, Input, Modal, Table } from 'semantic-ui-react';
import { Router } from '../routes.js';
import supplychain from '../ethereum/supplychain.js';

class BatchRow extends Component {
    constructor(props) {
        super(props);      

        const { batch, role, address} = this.props;

        let action;
        let route = '';
        let disabled = false;

        switch(batch.status) {
            case 'Manufactured':
                if (batch.currentOwner != address) {
                    disabled = true;
                }
                else {
                    if (role == 0) {
                        action = 'Send';
                        route = `/participant/${address}/transfer`;
                    }
                    else {
                        action = 'Ship';
                        route = `/participant/${address}/shipment`;
                    }
                }
                break;
            case 'Shipped':
                if (batch.currentOwner != address && role == 2) {
                    action = 'Store';
                }
                else {
                    disabled = true;
                }
                break;
            case 'In Storage':
                if (batch.currentOwner != address) {
                    disabled = true;
                }
                else {
                    if (role == 2) {
                        action = 'Send';
                        route = `/participant/${address}/transfer`;
                    }
                    else {
                        action = 'Dispatch';
                        route = `/participant/${address}/shipment`;
                    }
                }
                break;
            case 'Dispatched':
                if (batch.currentOwner != address && role == 3) {
                    action = 'Receive';
                }
                else {
                    disabled = true;
                }
                break;
            case 'Delivered':
                disabled = true;
        }

        this.state = {
            disabled,
            action,
            route,
            loading: false,
            errorMessage: '',
            showModal: false,
            shipmentId: 0
        }
    }

    proceed = (event) => {
        event.preventDefault();

        this.setState({ loading: false, errorMessage: '' });

        try {
            if (this.state.action === 'Store' || this.state.action === 'Receive') {
                this.setState({ showModal: true });
            } else {
                Router.pushRoute(this.state.route);
            }
        }
        catch(err) {
            const errorMessage = err.message || 'An unexpected error occurred.';
            this.setState({ errormessage: errorMessage });
        }

        this.setState({ loading: false });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const { shipmentId, action } = this.state;
        const { id, address } = this.props;

        if (!shipmentId) {
            this.setState({ errorMessage: 'Shipment ID is required.' });
            return;
        }

        this.setState({ loading: true, errorMessage: '' });

        try {
            if (action == 'Store') {
                await supplychain.methods.storeShipment(shipmentId, id+1).send({
                    from: address
                });
            }
            else {
                await supplychain.methods.deliverShipment(shipmentId, id+1).send({
                    from: address
                });
            }

            this.setState({ showModal: false, shipmentId: '' });
        }
        catch (err) {
            this.setState({ errorMessage: err.message || 'An error occurred while processing the transaction.' });
        } 
        finally {
            this.setState({ loading: false });
            Router.pushRoute(`/participant/${address}`);
            window.location.reload();
        }
    }

    render() {
        const { Row, Cell } = Table;
        const { id, batch} = this.props;

        return (
            <Row>
                <Cell>{id+1}</Cell>
                <Cell>{batch.name}</Cell>
                <Cell>{batch.manufacturer}</Cell>
                <Cell>{batch.currentOwner}</Cell>
                <Cell>{batch.status}</Cell>
                <Cell>
                    {this.state.disabled ? null : (
                        <Button 
                            loading={this.state.loading}
                            color='teal' 
                            basic onClick={this.proceed}
                        >
                            {this.state.action}
                        </Button> )
                    }
                </Cell>

                <Modal
                    open={this.state.showModal}
                    onClose={() => this.setState({ showModal: false })}
                    size="small"
                >
                    <Modal.Header>Enter Shipment Id</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Shipment Id</label>
                                <Input
                                    value={this.state.shipmentId}
                                    onChange={(e) => {
                                        this.setState({ shipmentId: e.target.value })
                                    }}
                                />
                            </Form.Field>
                        </Form>
                        {this.state.errorMessage && (
                            <Message error header="Error" content={this.state.errorMessage} />
                        )}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="red"
                            onClick={() => this.setState({ showModal: false, errorMessage: '' })}
                        >
                            Cancel
                        </Button>

                        <Button primary loading={this.state.loading} onClick={this.handleSubmit}>
                            Submit
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Row>
        );
    }
}

export default BatchRow;