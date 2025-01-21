import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';

class BatchRow extends Component {
    constructor(props) {
        super(props);      

        const { batch, role, address} = this.props;

        let action;

        switch(role) {
            case 0:
                action = 'Ship';
                break;
            case 1:
                action = 'Deliver';
                break;
            case 2:
                action = 'Dispatch';
                break;
            case 3:
                action = '';
                break;
        }

        this.state = {
            disabled: (batch.currentOwner != address),
            action
        }
    }

    proceed() {

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
                        <Button color='teal' basic onClick={this.proceed}>{this.state.action}</Button> )
                    }
                </Cell>
            </Row>
        );
    }
}

export default BatchRow;