import React, { Component } from "react";
import { Button, Container, Grid, GridColumn, GridRow } from "semantic-ui-react";
import Layout from "../components/Layout.js";
import { Link } from "../routes.js";

class SupplyChainIndex extends Component {

    render() {
        return (
            <Layout>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css" />
                <Grid columns={2} divided style={{ marginTop: '20px' }}>
                    <GridRow>
                        <GridColumn>
                            <Link route="/manufacturer">
                                <Button 
                                    content="Manufacturer"
                                    primary={true}
                                    size='big'
                                />
                            </Link>
                        </GridColumn>
                        <GridColumn>
                            <Link route="/distributor">
                                <Button 
                                        content="Distributor"
                                        primary={true}
                                        size='big'
                                    />
                            </Link>
                        </GridColumn>
                    </GridRow>
                    <GridRow>
                        <GridColumn>
                            <Link route="warehouse">
                                <Button 
                                    content="Warehouse"
                                    primary={true}
                                    size='big'
                                />
                            </Link>
                        </GridColumn>
                        <GridColumn>
                            <Link route="pharmacy">
                                <Button 
                                        content="Pharmacy"
                                        primary={true}
                                        size='big'
                                    />
                            </Link>
                        </GridColumn>
                    </GridRow>
                </Grid>
                <Container>
                    <Button 
                        fluid 
                        primary={true} 
                        content="Register Participant"
                        style = {{ marginTop: '40px' }}
                    />
                </Container>
            </Layout>
        )
    }
}

export default SupplyChainIndex;