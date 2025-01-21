import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Router } from '../routes.js';
// import supplychain from '../ethereum/supplychain.js';

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
        }

        this.state = {
            disabled,
            action,
            route,
            loading: false,
            errorMessage: ''
        }
    }

    proceed = async (event) => {
        event.preventDefault();

        this.setState({ loading: false, errorMessage: '' });

        try {
            switch(this.state.action) {
                case 'Send':
                    Router.pushRoute(this.state.route);
                    break;
                case 'Ship':
                    Router.pushRoute(this.state.route);
                    break;
                case 'Dispatch':
                    Router.pushRoute(this.state.route);
                    break;
                case 'Store':
                    break;
                case 'Receive':
                    break;
            }
        }
        catch(err) {
            const errorMessage = err.message || 'An unexpected error occurred.';
            this.setState({ errormessage: errorMessage });
        }

        this.setState({ loading: false });
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
            </Row>
        );
    }
}

export default BatchRow;