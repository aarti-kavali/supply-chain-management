import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

class ShipmentRow extends Component {
    render() {
        const { Row, Cell } = Table;
        const { id, shipment} = this.props;

        return (
            <Row>
                <Cell>{id+1}</Cell>
                <Cell>{parseInt(shipment.batchId)}</Cell>
                <Cell>{shipment.sender}</Cell>
                <Cell>{shipment.receiver}</Cell>
            </Row>
        );
    }
}

export default ShipmentRow;