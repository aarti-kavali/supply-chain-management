import React, { Component } from 'react';
import supplychain from '../../ethereum/supplychain.js';
import Layout from '../../components/Layout.js';
import { Table, Button } from 'semantic-ui-react';
import BatchRow from '../../components/BatchRow.js';
import ShipmentRow from '../../components/ShipmentRow.js';
import { Link } from '../../routes.js';

class ParticipantHome extends Component {
    static async getInitialProps(props) {
        const address = props.query.address;
        const participant = await 
                supplychain.methods.participants(address).call();
        const role = parseInt(participant.role);

        const batchCount = await supplychain.methods.getBatchCount().call();
        const shipmentCount = await supplychain.methods.getShipmentCount().call();

        const batches = await Promise.all(
            Array(parseInt(batchCount)).fill().map((_, index) => {
                return supplychain.methods.batches(index+1).call();
            })
        );

        const shipments = await Promise.all(
            Array(parseInt(shipmentCount)).fill().map((_, index) => {
                return supplychain.methods.shipments(index+1).call();
            })
        );

        return { address, batchCount, shipmentCount, batches, shipments, role };
    }

    renderBatchRow() {
        return this.props.batches.map((batch, index) => {
            return <BatchRow 
                key={index}
                id={index}
                batch={batch}
                role={this.props.role}
                address={this.props.address}
            />
        });
    }

    renderShipmentRow() {
        return this.props.shipments.map((shipment, index) => {
            return <ShipmentRow 
                key={index}
                id={index}
                shipment={shipment}
            />
        });
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;

        let buttonContent = '', route = '';

        if (this.props.role == 0) {
            buttonContent = 'Manufacture Batch'
            route = `/participant/${this.props.address}/manufacture`
        }

        return (
            <Layout>
                <h3>Batch Details</h3>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Name</HeaderCell>
                            <HeaderCell>Manufacturer</HeaderCell>
                            <HeaderCell>Current Owner</HeaderCell>
                            <HeaderCell>Status</HeaderCell>
                            <HeaderCell>Action</HeaderCell>
                        </Row>
                    </Header>

                    <Body>
                        {this.renderBatchRow()}
                    </Body>
                </Table>

                <h3>Shipment Details</h3>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>Shipment ID</HeaderCell>
                            <HeaderCell>Batch ID</HeaderCell>
                            <HeaderCell>Sender</HeaderCell>
                            <HeaderCell>Receiver</HeaderCell>
                        </Row>
                    </Header>

                    <Body>
                        {this.renderShipmentRow()}
                    </Body>
                </Table>

                {buttonContent && route ? (
                    <Link route={route}>
                        <a>
                            <Button primary>{buttonContent}</Button>
                        </a>
                    </Link> ) : null
                }

            </Layout>
        );
    }
}

export default ParticipantHome;